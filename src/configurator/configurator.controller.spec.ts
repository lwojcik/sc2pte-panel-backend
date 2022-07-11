import { Test, TestingModule } from '@nestjs/testing';
import { ConfiguratorController } from './configurator.controller';

describe('ConfiguratorController', () => {
  let controller: ConfiguratorController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConfiguratorController],
    }).compile();

    controller = module.get<ConfiguratorController>(ConfiguratorController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
