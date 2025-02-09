import { Test, TestingModule } from '@nestjs/testing';
import { IUserRepository } from '../../repositories/user/user-repository.interface';
import { User } from '../../entities/user/user.entity';
import { UserUseCase } from './user-use-case.service';

describe('UserUseCase', () => {
  let userUseCase: UserUseCase;
  let userRepository: IUserRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserUseCase,
        {
          provide: IUserRepository,
          useValue: {
            createUser: jest.fn(),
            findByEmail: jest.fn(),
          },
        },
      ],
    }).compile();

    userUseCase = module.get<UserUseCase>(UserUseCase);
    userRepository = module.get<IUserRepository>(IUserRepository);
  });

  it('should create a user and return the id', async () => {
    const user = User.buildUser('secret', 'john@example.com', '1');
    jest.spyOn(userRepository, 'createUser').mockResolvedValueOnce(undefined);

    const result = await userUseCase.createUser(user);

    expect(userRepository.createUser).toHaveBeenCalledWith(user);
    expect(result).toBe(user.id);
  });
});
