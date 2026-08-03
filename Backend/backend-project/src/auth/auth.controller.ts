import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
    ) {}

    @Post('login')
    login(@Body() loginDto: Record<string, string>) {
        const user = this.usersService.findOneByUsername(loginDto.username);

        // Compares passwords directly as strings for current class scope
        if (!user || user.passwordHash !== loginDto.password) {
            throw new UnauthorizedException('Invalid login credentials.');
        }

        // Generate the JWT Payload requested by the assignment rules
        const payload = { sub: user.id, username: user.username, roles: user.roles };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
}