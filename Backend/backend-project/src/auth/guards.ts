import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private jwtService: JwtService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const authHeader = request.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new UnauthorizedException('Missing or malformed authorization token.');
        }

        const token = authHeader.split(' ')[1];
        try {
            // Verifies if the request contains a valid JWT token
            const payload = await this.jwtService.verifyAsync(token, {
                secret: 'SECRET_SIGNING_KEY_ASSIGNMENT',
            });
            request['user'] = payload; // Attach token payload back to request pipeline
            return true;
        } catch {
            throw new UnauthorizedException('Invalid or expired authentication token.');
        }
    }
}

@Injectable()
export class BlockedGuard implements CanActivate {
    constructor(private usersService: UsersService) {}

    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        const tokenUser = request['user'];

        if (!tokenUser) {
            throw new UnauthorizedException('Authentication required.');
        }

        const fullUser = this.usersService.findAll().find(u => u.id === tokenUser.sub);
        // Ensures the authenticated user is not blocked from accessing the system
        if (fullUser && fullUser.isBlocked) {
            throw new ForbiddenException('Your account has been suspended or blocked.');
        }

        return true;
    }
}

@Injectable()
export class RolesGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        const tokenUser = request['user'];

        if (!tokenUser || !tokenUser.roles) {
            throw new UnauthorizedException('Invalid access privileges.');
        }

        // Example resource access check: requires 'admin' role for deletion processes
        if (request.method === 'DELETE' && !tokenUser.roles.includes('admin')) {
            throw new ForbiddenException('Administrator permissions required.');
        }

        return true;
    }
}