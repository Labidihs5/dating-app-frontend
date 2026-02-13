import { Injectable, ForbiddenException, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateRoomDto, RoomType, RoomCategory, MemberRole } from './dto/room.dto';

const prisma = new PrismaClient();

@Injectable()
export class RoomsService {
  async getAllRooms(userId: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    
    return prisma.room.findMany({
      where: {
        OR: [
          { type: 'PUBLIC' },
          { members: { some: { userId } } },
        ],
        ageRestriction: { lte: user?.age || 0 },
      },
      include: {
        members: { select: { userId: true, role: true } },
        _count: { select: { members: true, messages: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createRoom(userId: string, dto: CreateRoomDto) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    
    if (user?.premiumStatus !== 'GOLD') {
      throw new ForbiddenException('Only GOLD users can create rooms');
    }

    if (dto.type !== 'PUBLIC' && user.premiumStatus !== 'GOLD') {
      throw new ForbiddenException('Only GOLD users can create PRIVATE/EVENT rooms');
    }

    const room = await prisma.room.create({
      data: {
        name: dto.name,
        description: dto.description,
        type: dto.type,
        category: dto.category,
        ownerId: userId,
        ageRestriction: dto.ageRestriction || 0,
        expiresAt: dto.expiresAt,
        members: {
          create: {
            userId,
            role: MemberRole.OWNER,
          },
        },
      },
      include: { members: true },
    });

    return room;
  }

  async getRoom(roomId: string, userId: string) {
    const room = await prisma.room.findUnique({
      where: { id: roomId },
      include: {
        members: { include: { user: { select: { id: true, name: true, photos: true } } } },
        _count: { select: { messages: true } },
      },
    });

    if (!room) throw new NotFoundException('Room not found');

    const isMember = room.members.some(m => m.userId === userId);
    if (room.type === 'PRIVATE' && !isMember) {
      throw new ForbiddenException('Private room');
    }

    return room;
  }

  async joinRoom(roomId: string, userId: string) {
    const room = await prisma.room.findUnique({ where: { id: roomId } });
    if (!room) throw new NotFoundException('Room not found');

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    if (room.ageRestriction > 0 && user.age < room.ageRestriction) {
      throw new ForbiddenException(`Must be ${room.ageRestriction}+ to join`);
    }

    if (room.type === 'PRIVATE') {
      const invite = await prisma.roomInvite.findFirst({
        where: { roomId, invitedUserId: userId, status: 'PENDING' },
      });
      if (!invite) throw new ForbiddenException('Invite required');
      
      await prisma.roomInvite.update({
        where: { id: invite.id },
        data: { status: 'ACCEPTED' },
      });
    }

    const existing = await prisma.roomMember.findUnique({
      where: { roomId_userId: { roomId, userId } },
    });

    if (existing) throw new BadRequestException('Already a member');

    return prisma.roomMember.create({
      data: { roomId, userId, role: MemberRole.MEMBER },
    });
  }

  async leaveRoom(roomId: string, userId: string) {
    const member = await prisma.roomMember.findUnique({
      where: { roomId_userId: { roomId, userId } },
    });

    if (!member) throw new NotFoundException('Not a member');
    if (member.role === MemberRole.OWNER) {
      throw new ForbiddenException('Owner cannot leave');
    }

    return prisma.roomMember.delete({ where: { id: member.id } });
  }

  async getMembers(roomId: string) {
    return prisma.roomMember.findMany({
      where: { roomId },
      include: { user: { select: { id: true, name: true, photos: true, age: true } } },
      orderBy: { joinedAt: 'asc' },
    });
  }

  async getMessages(roomId: string, userId: string, limit = 50) {
    const isMember = await prisma.roomMember.findUnique({
      where: { roomId_userId: { roomId, userId } },
    });

    if (!isMember) throw new ForbiddenException('Not a member');

    return prisma.roomMessage.findMany({
      where: { roomId },
      include: { user: { select: { id: true, name: true, photos: true } } },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  async sendMessage(roomId: string, userId: string, content: string) {
    const isMember = await prisma.roomMember.findUnique({
      where: { roomId_userId: { roomId, userId } },
    });

    if (!isMember) throw new ForbiddenException('Not a member');

    // AI safety check placeholder
    if (content.toLowerCase().includes('spam')) {
      throw new BadRequestException('Message blocked by safety filter');
    }

    return prisma.roomMessage.create({
      data: { roomId, userId, content },
      include: { user: { select: { id: true, name: true, photos: true } } },
    });
  }

  async inviteUser(roomId: string, inviterId: string, invitedUserId: string) {
    const room = await prisma.room.findUnique({ where: { id: roomId } });
    if (!room) throw new NotFoundException('Room not found');

    const inviter = await prisma.roomMember.findUnique({
      where: { roomId_userId: { roomId, userId: inviterId } },
    });

    if (!inviter || (inviter.role !== MemberRole.OWNER && inviter.role !== MemberRole.MODERATOR)) {
      throw new ForbiddenException('Only owner/moderator can invite');
    }

    const existing = await prisma.roomInvite.findUnique({
      where: { roomId_invitedUserId: { roomId, invitedUserId } },
    });

    if (existing) throw new BadRequestException('Already invited');

    return prisma.roomInvite.create({
      data: { roomId, invitedUserId, invitedBy: inviterId },
    });
  }

  async kickUser(roomId: string, kickerId: string, targetUserId: string) {
    const kicker = await prisma.roomMember.findUnique({
      where: { roomId_userId: { roomId, userId: kickerId } },
    });

    if (!kicker || (kicker.role !== MemberRole.OWNER && kicker.role !== MemberRole.MODERATOR)) {
      throw new ForbiddenException('Only owner/moderator can kick');
    }

    const target = await prisma.roomMember.findUnique({
      where: { roomId_userId: { roomId, userId: targetUserId } },
    });

    if (!target) throw new NotFoundException('User not in room');
    if (target.role === MemberRole.OWNER) throw new ForbiddenException('Cannot kick owner');

    return prisma.roomMember.delete({ where: { id: target.id } });
  }
}
