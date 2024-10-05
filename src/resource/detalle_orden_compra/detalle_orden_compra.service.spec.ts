import { Test, TestingModule } from '@nestjs/testing';
import { DetalleOrdenCompraService } from './detalle_orden_compra.service';

describe('DetalleOrdenCompraService', () => {
  let service: DetalleOrdenCompraService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DetalleOrdenCompraService],
    }).compile();

    service = module.get<DetalleOrdenCompraService>(DetalleOrdenCompraService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
