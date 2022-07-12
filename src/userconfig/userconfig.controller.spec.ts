import { Test, TestingModule } from '@nestjs/testing';
import { UserConfigController } from './userconfig.controller';

describe('ConfiguratorController', () => {
  let controller: UserConfigController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserConfigController],
    }).compile();

    controller = module.get<UserConfigController>(UserConfigController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
