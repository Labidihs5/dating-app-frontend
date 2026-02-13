import { IsString, IsEnum, IsOptional, IsInt, Min, MaxLength } from 'class-validator';

export enum RoomType {
  PUBLIC = 'PUBLIC',
  PRIVATE = 'PRIVATE',
  EVENT = 'EVENT',
}

export enum RoomCategory {
  RESPECT = 'RESPECT',
  ADULT = 'ADULT',
  SERIOUS = 'SERIOUS',
  FUN = 'FUN',
  CITY = 'CITY',
}

export enum MemberRole {
  OWNER = 'OWNER',
  MODERATOR = 'MODERATOR',
  MEMBER = 'MEMBER',
}

export class CreateRoomDto {
  @IsString()
  @MaxLength(100)
  name: string;

  @IsString()
  @MaxLength(500)
  description: string;

  @IsEnum(RoomType)
  type: RoomType;

  @IsEnum(RoomCategory)
  category: RoomCategory;

  @IsOptional()
  @IsInt()
  @Min(0)
  ageRestriction?: number;

  @IsOptional()
  expiresAt?: Date;
}

export class SendMessageDto {
  @IsString()
  @MaxLength(2000)
  content: string;
}

export class InviteUserDto {
  @IsString()
  invitedUserId: string;
}
