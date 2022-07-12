import { Test, TestingModule } from '@nestjs/testing';
import { UserConfigService } from './userconfig.service';

describe('UserConfigService', () => {
  let service: UserConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserConfigService],
    }).compile();

    service = module.get<UserConfigService>(UserConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
