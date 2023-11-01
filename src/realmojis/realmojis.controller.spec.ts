import { Test, TestingModule } from '@nestjs/testing';
import { RealmojisController } from './realmojis.controller';
import { RealmojisService } from './realmojis.service';

describe('RealmojisController', () => {
  let controller: RealmojisController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RealmojisController],
      providers: [RealmojisService],
    }).compile();

    controller = module.get<RealmojisController>(RealmojisController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
