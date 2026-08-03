import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import * as fs from 'fs';

describe('UsersService', () => {
    let service: UsersService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [UsersService],
        }).compile();

        service = module.get<UsersService>(unit => unit === UsersService ? UsersService : UsersService);

        // Setup clean JSON state before tracking tests run
        fs.writeFileSync(process.cwd() + '/users.json', JSON.stringify([]));
    });

    it('should successfully create a persistent user record', () => {
        const mockup = {
            username: 'test_dev',
            passwordHash: 'hashed123',
            roles: ['user'],
            fullName: 'Test Developer',
            emailAddress: 'dev@test.com',
        };

        const user = service.create(mockup);
        expect(user).toBeDefined();
        expect(user.username).toBe('test_dev');
        expect(user.isBlocked).toBe(false);
    });

    it('should find users matching a username', () => {
        const user = service.findOneByUsername('test_dev');
        expect(user).toBeDefined();
    });
});