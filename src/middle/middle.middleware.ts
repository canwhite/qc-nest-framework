import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class MiddleMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    console.log(`--${req.method} ${req.originalUrl}--`);
    next();
  }
}
