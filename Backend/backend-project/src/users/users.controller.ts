import { Controller, Post, Get, Delete, Patch, Param, Body, UseGuards } from '@nestjs/common';
import { UsersService, User } from './users.service';
import { AuthGuard, BlockedGuard, RolesGuard } from '../auth/guards';


export interface UserResponse {
    id: string | number;
    username: string;
    roles: string[];
    isBlocked: boolean;
    fullName: string;
    emailAddress: string;
    createdAt: string;
    modifiedAt?: string;
}

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}


    @Post()
    create(@Body() createUserDto: Omit<User, 'id' | 'createdAt' | 'isBlocked'>): UserResponse {
        const createdUser = this.usersService.create(createUserDto);


        const { passwordHash, ...response } = createdUser;
        return response;
    }


    @Get()
    @UseGuards(AuthGuard, BlockedGuard)
    findAll(): UserResponse[] {
        return this.usersService.findAll().map(({ passwordHash, ...user }) => user);
    }


    @Patch(':id')
    @UseGuards(AuthGuard, BlockedGuard)
    update(
        @Param('id') id: string,
        @Body() updateDto: Partial<Omit<User, 'id' | 'createdAt'>>
    ): UserResponse {
        const updatedUser = this.usersService.update(id, updateDto);
        const { passwordHash, ...response } = updatedUser;
        return response;
    }


    @Delete(':id')
    @UseGuards(AuthGuard, BlockedGuard, RolesGuard)
    remove(@Param('id') id: string) {
        this.usersService.remove(id);
        return { message: `User with ID ${id} removed successfully.` };
    }
}