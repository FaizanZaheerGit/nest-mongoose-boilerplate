// NOTE: Remove this and passport, and implement normal Jwt verification with CanActivate
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard() {}
