import { Injectable, NotFoundException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';


export interface User {
    id: string;
    username: string;
    passwordHash: string;
    roles: string[];
    isBlocked: boolean;
    fullName: string;
    emailAddress: string;
    createdAt: string;
    modifiedAt?: string;
}

@Injectable()
export class UsersService {

    private readonly filePath = path.resolve(process.cwd(), 'users.json');


    private readFromFile(): User[] {
        try {
            if (!fs.existsSync(this.filePath)) {
                fs.writeFileSync(this.filePath, JSON.stringify([]));
                return [];
            }
            const data = fs.readFileSync(this.filePath, 'utf-8');
            return JSON.parse(data || '[]');
        } catch (error) {
            return [];
        }
    }


    private writeToFile(users: User[]): void {
        fs.writeFileSync(this.filePath, JSON.stringify(users, null, 2));
    }


    create(userDto: Omit<User, 'id' | 'createdAt' | 'isBlocked'>): User {
        const users = this.readFromFile();

        const newUser: User = {
            id: (users.length + 1).toString(),
            ...userDto,
            isBlocked: false,
            createdAt: new Date().toISOString(),
        };

        users.push(newUser);
        this.writeToFile(users);
        return newUser;
    }

    findAll(): User[] {
        return this.readFromFile();
    }

    findOneByUsername(username: string): User | undefined {
        const users = this.readFromFile();
        return users.find((user) => user.username === username);
    }


    update(id: string, updateDto: Partial<Omit<User, 'id' | 'createdAt'>>): User {
        const users = this.readFromFile();
        const userIndex = users.findIndex((user) => user.id === id);

        if (userIndex === -1) {
            throw new NotFoundException(`User with ID ${id} not found.`);
        }


        const updatedUser = {
            ...users[userIndex],
            ...updateDto,
            modifiedAt: new Date().toISOString(),
        };

        users[userIndex] = updatedUser;
        this.writeToFile(users);
        return updatedUser;
    }


    remove(id: string): void {
        const users = this.readFromFile();
        const filteredUsers = users.filter((user) => user.id !== id);

        if (users.length === filteredUsers.length) {
            throw new NotFoundException(`User with ID ${id} not found.`);
        }

        this.writeToFile(filteredUsers);
    }
}