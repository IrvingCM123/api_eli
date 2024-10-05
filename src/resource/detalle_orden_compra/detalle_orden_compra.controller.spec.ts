import { Test, TestingModule } from '@nestjs/testing';
import { DetalleOrdenCompraController } from './detalle_orden_compra.controller';
import { DetalleOrdenCompraService } from './detalle_orden_compra.service';

describe('DetalleOrdenCompraController', () => {
  let controller: DetalleOrdenCompraController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DetalleOrdenCompraController],
      providers: [DetalleOrdenCompraService],
    }).compile();

    controller = module.get<DetalleOrdenCompraController>(DetalleOrdenCompraController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
