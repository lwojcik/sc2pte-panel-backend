import { Test, TestingModule } from '@nestjs/testing';
import { SasService } from './sas.service';

describe('SasService', () => {
  let service: SasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SasService],
    }).compile();

    service = module.get<SasService>(SasService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
