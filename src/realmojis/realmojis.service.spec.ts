import { Test, TestingModule } from '@nestjs/testing';
import { RealmojisService } from './realmojis.service';

describe('RealmojisService', () => {
  let service: RealmojisService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RealmojisService],
    }).compile();

    service = module.get<RealmojisService>(RealmojisService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
