import { Test, TestingModule } from '@nestjs/testing';
import { HttpException, HttpStatus } from '@nestjs/common';
import { AuthCandidateService } from '../services/auth-candidate.service';
import { JwtStrategy } from '../jwt.strategy';
import { mock, MockProxy } from 'jest-mock-extended';
import { faker } from '@faker-js/faker/.';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;
  let authService: MockProxy<AuthCandidateService>;

  beforeEach(async () => {
    process.env.JWT_SECRET = 'test-secret';

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        {
          provide: AuthCandidateService,
          useValue: (authService = mock<AuthCandidateService>()),
        },
      ],
    }).compile();

    strategy = module.get<JwtStrategy>(JwtStrategy);
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  it('should return user payload if validateUser is successful', async () => {
    const mockUser = {
      id: faker.string.uuid(),
      email: faker.internet.email(),
      createdAt: faker.date.recent(),
      name: faker.person.fullName(),
      resume: faker.lorem.paragraph(),
      skills: [faker.lorem.word()],
      status: 'active',
      updatedAt: faker.date.recent(),
    };

    const payload = {
      email: mockUser.email,
      sub: mockUser.id,
      iat: 1234567890,
      exp: 1234567899,
    };

    authService.validateUser.mockResolvedValue(mockUser);

    const done = jest.fn();

    await strategy.validate(payload, done);

    expect(authService.validateUser).toHaveBeenCalledWith(mockUser.id);
    expect(done).toHaveBeenCalledWith(
      null,
      {
        id: mockUser.id,
        email: mockUser.email,
        status: mockUser.status,
      },
      payload.iat,
    );
  });

  it('should call done with Unauthorized exception if validateUser fails', async () => {
    const payload = {
      email: faker.internet.email(),
      sub: 'invalid-id',
      iat: 1234567890,
      exp: 1234567899,
    };

    authService.validateUser.mockResolvedValue(null);

    const done = jest.fn();

    await strategy.validate(payload, done);

    expect(authService.validateUser).toHaveBeenCalledWith('invalid-id');
    expect(done).toHaveBeenCalledWith(
      new HttpException('Unauthorized access', HttpStatus.UNAUTHORIZED),
      false,
    );
  });
});
