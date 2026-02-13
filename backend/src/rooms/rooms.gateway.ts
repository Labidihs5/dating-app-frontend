import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { RoomsService } from './rooms.service';

@WebSocketGateway({ cors: true, namespace: '/rooms' })
export class RoomsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private readonly roomsService: RoomsService) {}

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('room:join')
  async handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomId: string; userId: string },
  ) {
    try {
      await this.roomsService.joinRoom(data.roomId, data.userId);
      client.join(data.roomId);
      
      this.server.to(data.roomId).emit('room:member:joined', {
        roomId: data.roomId,
        userId: data.userId,
        timestamp: new Date(),
      });

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  @SubscribeMessage('room:leave')
  async handleLeaveRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomId: string; userId: string },
  ) {
    try {
      await this.roomsService.leaveRoom(data.roomId, data.userId);
      client.leave(data.roomId);
      
      this.server.to(data.roomId).emit('room:member:left', {
        roomId: data.roomId,
        userId: data.userId,
        timestamp: new Date(),
      });

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  @SubscribeMessage('room:message:send')
  async handleSendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomId: string; userId: string; content: string },
  ) {
    try {
      const message = await this.roomsService.sendMessage(data.roomId, data.userId, data.content);
      
      this.server.to(data.roomId).emit('room:message:new', message);

      return { success: true, message };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  @SubscribeMessage('room:typing')
  handleTyping(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomId: string; userId: string; isTyping: boolean },
  ) {
    client.to(data.roomId).emit('room:typing', {
      userId: data.userId,
      isTyping: data.isTyping,
    });
  }

  async notifyKick(roomId: string, userId: string) {
    this.server.to(roomId).emit('room:moderation:kick', {
      roomId,
      userId,
      timestamp: new Date(),
    });
  }
}
