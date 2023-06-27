import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaService } from '../persistence/prisma/prisma.service';
import { User, Prisma } from '@prisma/client';

describe('UserService', () => {
  let service: UserService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService, PrismaService],
    }).compile();

    service = module.get<UserService>(UserService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
      const user: User = {
        id: 1,
        username: 'John Doe',
        email: 'johndoe@example.com',
        phone: '+77777777777',
        password_hash:
          'pbkdf2_sha512$10000$b3f161706567ac0d2cfad1862b763256$5dd608f97410c76a785789ed08d32099f97b03ff8610f47a5f63f2e5c8d70bf85674ac4518dbb9738f23da32d589cf11e387f7296a9cd2122dcfa33ee5fa4afd',
        emailConfirmed: false,
      };

      jest.spyOn(prismaService.user, 'create').mockResolvedValue(user);

      const createUserInput: Prisma.UserCreateInput = {
        username: 'John Doe',
        email: 'johndoe@example.com',
        phone: '+77777777777',
        password_hash:
          'pbkdf2_sha512$10000$b3f161706567ac0d2cfad1862b763256$5dd608f97410c76a785789ed08d32099f97b03ff8610f47a5f63f2e5c8d70bf85674ac4518dbb9738f23da32d589cf11e387f7296a9cd2122dcfa33ee5fa4afd',
        emailConfirmed: false,
      };

      const createdUser = await service.createUser(createUserInput);

      expect(prismaService.user.create).toHaveBeenCalledWith({
        data: createUserInput,
      });
      expect(createdUser).toEqual(user);
    });
  });

  describe('getAllUsers', () => {
    it('should return all users', async () => {
      const users: User[] = [
        {
          id: 1,
          username: 'John Doe',
          email: 'johndoe@example.com',
          phone: '+77777777771',
          password_hash:
            'pbkdf2_sha512$10000$b3f161706567ac0d2cfad1862b763256$5dd608f97410c76a785789ed08d32099f97b03ff8610f47a5f63f2e5c8d70bf85674ac4518dbb9738f23da32d589cf11e387f7296a9cd2122dcfa33ee5fa4afd',
          emailConfirmed: false,
        },
        {
          id: 2,
          username: 'John Mal',
          email: 'idiot@example.com',
          phone: '+77777777777',
          password_hash:
            'pbkdf2_sha512$10000$b3f161706567ac0d2cfad1862b763256$5dd608f97410c76a785789ed08d32099f97b03ff8610f47a5f63f2e5c8d70bf85674ac4518dbb9738f23da32d589cf11e387f7296a9cd2122dcfa33ee5fa4afd',
          emailConfirmed: false,
        },
        {
          id: 3,
          username: 'Albert Doe',
          email: 'maryana@example.com',
          phone: '+77777777778',
          password_hash:
            'pbkdf2_sha512$10000$b3f161706567ac0d2cfad1862b763256$5dd608f97410c76a785789ed08d32099f97b03ff8610f47a5f63f2e5c8d70bf85674ac4518dbb9738f23da32d589cf11e387f7296a9cd2122dcfa33ee5fa4afd',
          emailConfirmed: false,
        },
      ];

      jest.spyOn(prismaService.user, 'findMany').mockResolvedValue(users);

      const fetchedUsers = await service.getAllUsers();

      expect(prismaService.user.findMany).toHaveBeenCalled();
      expect(fetchedUsers).toEqual(users);
    });
  });

  describe('getUserById', () => {
    it('should return the user with the given ID', async () => {
      const userId = 1;
      const user: User = {
        id: userId,
        username: 'John Doe',
        email: 'johndoe@example.com',
        phone: '+77777777777',
        password_hash:
          'pbkdf2_sha512$10000$b3f161706567ac0d2cfad1862b763256$5dd608f97410c76a785789ed08d32099f97b03ff8610f47a5f63f2e5c8d70bf85674ac4518dbb9738f23da32d589cf11e387f7296a9cd2122dcfa33ee5fa4afd',
        emailConfirmed: false,
      };

      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(user);

      const fetchedUser = await service.getUserById(userId);

      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: userId },
      });
      expect(fetchedUser).toEqual(user);
    });

    it('should return null if the user is not found', async () => {
      const userId = 1;

      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(null);

      const fetchedUser = await service.getUserById(userId);

      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: userId },
      });
      expect(fetchedUser).toBeNull();
    });
  });

  describe('getUserByEmail', () => {
    it('should return the user with the given email', async () => {
      const email = 'johndoe@example.com';
      const user: User = {
        id: 1,
        username: 'John Doe',
        email: email,
        phone: '+77777777777',
        password_hash:
          'pbkdf2_sha512$10000$b3f161706567ac0d2cfad1862b763256$5dd608f97410c76a785789ed08d32099f97b03ff8610f47a5f63f2e5c8d70bf85674ac4518dbb9738f23da32d589cf11e387f7296a9cd2122dcfa33ee5fa4afd',
        emailConfirmed: false,
      };

      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(user);

      const fetchedUser = await service.getUserByEmail(email);

      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email },
      });
      expect(fetchedUser).toEqual(user);
    });

    it('should return null if the user is not found', async () => {
      const email = 'johndoe@example.com';

      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(null);

      const fetchedUser = await service.getUserByEmail(email);

      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email },
      });
      expect(fetchedUser).toBeNull();
    });
  });

  describe('updateUser', () => {
    it('should update the user with the given ID', async () => {
      const userId = 1;
      const updatedUser: User = {
        id: 1,
        username: 'John Doe',
        email: 'johndoe@example.com',
        phone: '+77777777777',
        password_hash:
          'pbkdf2_sha512$10000$b3f161706567ac0d2cfad1862b763256$5dd608f97410c76a785789ed08d32099f97b03ff8610f47a5f63f2e5c8d70bf85674ac4518dbb9738f23da32d589cf11e387f7296a9cd2122dcfa33ee5fa4afd',
        emailConfirmed: false,
      };

      jest.spyOn(prismaService.user, 'update').mockResolvedValue(updatedUser);

      const updateUserInput: Prisma.UserUpdateInput = {
        username: 'John Doe',
        email: 'johndoe@example.com',
        // Add other properties as required
      };

      const updatedUserResult = await service.updateUser(
        userId,
        updateUserInput,
      );

      expect(prismaService.user.update).toHaveBeenCalledWith({
        where: { id: userId },
        data: updateUserInput,
      });
      expect(updatedUserResult).toEqual(updatedUser);
    });

    it('should return null if the user is not found', async () => {
      const userId = 1;

      jest.spyOn(prismaService.user, 'update').mockResolvedValue(null);

      const updateUserInput: Prisma.UserUpdateInput = {
        username: 'John Doe',
        email: 'johndoe@example.com',
        // Add other properties as required
      };

      const updatedUserResult = await service.updateUser(
        userId,
        updateUserInput,
      );

      expect(prismaService.user.update).toHaveBeenCalledWith({
        where: { id: userId },
        data: updateUserInput,
      });
      expect(updatedUserResult).toBeNull();
    });
  });

  describe('deleteUser', () => {
    it('should delete the user with the given ID', async () => {
      const userId = 1;
      const deletedUser: User = {
        id: userId,
        username: 'John Doe',
        email: 'johndoe@example.com',
        phone: '+77777777777',
        password_hash:
          'pbkdf2_sha512$10000$b3f161706567ac0d2cfad1862b763256$5dd608f97410c76a785789ed08d32099f97b03ff8610f47a5f63f2e5c8d70bf85674ac4518dbb9738f23da32d589cf11e387f7296a9cd2122dcfa33ee5fa4afd',
        emailConfirmed: false,
      };

      jest.spyOn(prismaService.user, 'delete').mockResolvedValue(deletedUser);

      const deletedUserResult = await service.deleteUser(userId);

      expect(prismaService.user.delete).toHaveBeenCalledWith({
        where: { id: userId },
      });
      expect(deletedUserResult).toEqual(deletedUser);
    });

    it('should return null if the user is not found', async () => {
      const userId = 1;

      jest.spyOn(prismaService.user, 'delete').mockResolvedValue(null);

      const deletedUserResult = await service.deleteUser(userId);

      expect(prismaService.user.delete).toHaveBeenCalledWith({
        where: { id: userId },
      });
      expect(deletedUserResult).toBeNull();
    });
  });
});
