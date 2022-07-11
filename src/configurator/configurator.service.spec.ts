import { Test, TestingModule } from '@nestjs/testing';
import { ConfiguratorService } from './configurator.service';

describe('ConfiguratorService', () => {
  let service: ConfiguratorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConfiguratorService],
    }).compile();

    service = module.get<ConfiguratorService>(ConfiguratorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
