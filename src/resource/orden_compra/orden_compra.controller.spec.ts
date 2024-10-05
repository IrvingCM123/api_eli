import { Test, TestingModule } from '@nestjs/testing';
import { OrdenCompraController } from './orden_compra.controller';
import { OrdenCompraService } from './orden_compra.service';

describe('OrdenCompraController', () => {
  let controller: OrdenCompraController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrdenCompraController],
      providers: [OrdenCompraService],
    }).compile();

    controller = module.get<OrdenCompraController>(OrdenCompraController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
