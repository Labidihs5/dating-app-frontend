import { Controller, Get, Post, Body, Param, UseGuards, Request, Delete, Query } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { CreateRoomDto, SendMessageDto, InviteUserDto } from './dto/room.dto';

@Controller('v1/rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Get()
  async getRooms(@Request() req) {
    return this.roomsService.getAllRooms(req.user.id);
  }

  @Post()
  async createRoom(@Request() req, @Body() dto: CreateRoomDto) {
    return this.roomsService.createRoom(req.user.id, dto);
  }

  @Get(':id')
  async getRoom(@Param('id') id: string, @Request() req) {
    return this.roomsService.getRoom(id, req.user.id);
  }

  @Post(':id/join')
  async joinRoom(@Param('id') id: string, @Request() req) {
    return this.roomsService.joinRoom(id, req.user.id);
  }

  @Post(':id/leave')
  async leaveRoom(@Param('id') id: string, @Request() req) {
    return this.roomsService.leaveRoom(id, req.user.id);
  }

  @Get(':id/members')
  async getMembers(@Param('id') id: string) {
    return this.roomsService.getMembers(id);
  }

  @Get(':id/messages')
  async getMessages(@Param('id') id: string, @Request() req, @Query('limit') limit?: number) {
    return this.roomsService.getMessages(id, req.user.id, limit);
  }

  @Post(':id/messages')
  async sendMessage(@Param('id') id: string, @Request() req, @Body() dto: SendMessageDto) {
    return this.roomsService.sendMessage(id, req.user.id, dto.content);
  }

  @Post(':id/invite')
  async inviteUser(@Param('id') id: string, @Request() req, @Body() dto: InviteUserDto) {
    return this.roomsService.inviteUser(id, req.user.id, dto.invitedUserId);
  }

  @Post(':id/kick')
  async kickUser(@Param('id') id: string, @Request() req, @Body('userId') userId: string) {
    return this.roomsService.kickUser(id, req.user.id, userId);
  }
}
