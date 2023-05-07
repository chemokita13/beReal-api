import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  ping(): { statusCode: number; message: string } {
    return { statusCode: 200, message: 'Pong' };
  }
}
