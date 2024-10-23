import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { CuentasService } from 'src/resource/cuentas/cuentas.service';
import { JwtService } from '@nestjs/jwt';
import { TransaccionService } from 'src/common/transaction/transaccion.service';
import { RegisterDto } from 'src/auth/dto/registro.dto';
import { LoginDto } from 'src/auth/dto/login.dto';
import * as bcrypt from 'bcrypt';
import { Estado_Logico } from 'src/common/enums/estado_logico.enum';
import { Roles } from 'src/common/enums/roles.enum'; // Importa tu enum

describe('AuthService', () => {
  let service: AuthService;
  let cuentasService: Partial<CuentasService>;
  let jwtService: Partial<JwtService>;
  let transaccionService: Partial<TransaccionService>;

  beforeEach(async () => {
    cuentasService = {
      findOne: jest.fn(), // Asegúrate de que el método coincida con tu servicio real
    };
    jwtService = {
      signAsync: jest.fn(),
    };
    transaccionService = {
      transaction: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: CuentasService, useValue: cuentasService },
        { provide: JwtService, useValue: jwtService },
        { provide: TransaccionService, useValue: transaccionService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  describe('register', () => {
    it('should return error if email is missing', async () => {
      const registroDTO: RegisterDto = {
        Correo_electronico: '', // Correo vacío o faltante
        Contraseña: 'password123',
        cuenta_rol: Roles.ADMIN,
        Nombre: 'John',
        Apellidos: 'Doe',
      };
  
      const result = await service.register(registroDTO);
      expect(result.status).toBe(500);
      expect(result.mensaje).toBe('Correo electrónico es requerido'); // Ajustar mensaje si es necesario
    });
  
    it('should return error if the account already exists', async () => {
      const registroDTO: RegisterDto = {
        Correo_electronico: 'test@example.com',
        Contraseña: 'password123',
        cuenta_rol: Roles.ADMIN,
        Nombre: 'John',
        Apellidos: 'Doe',
      };
  
      (cuentasService.findOne as jest.Mock).mockResolvedValue({
        status: 201,
        mensaje: 'La cuenta ya existe',
      });
  
      const result = await service.register(registroDTO);
      expect(result.status).toBe(500);
      expect(result.mensaje).toBe('La cuenta ya existe');
    });
  
    it('should return error if account creation fails', async () => {
      const registroDTO: RegisterDto = {
        Correo_electronico: 'newuser@example.com',
        Contraseña: 'password123',
        cuenta_rol: Roles.ADMIN,
        Nombre: 'John',
        Apellidos: 'Doe',
      };
  
      (cuentasService.findOne as jest.Mock).mockResolvedValue({ status: 404 });
      (transaccionService.transaction as jest.Mock).mockResolvedValue({ status: 500 });
  
      const result = await service.register(registroDTO);
      expect(result.status).toBe(500);
      expect(result.mensaje).toBe('Error en el servidor, intente más tarde');
    });
  });


  describe('login', () => {
    it('should return error if email is missing', async () => {
      const loginDto: LoginDto = {
        Correo_electronico: '', // Correo faltante
        Contraseña: 'password123',
      };
  
      const result = await service.login(loginDto);
      expect(result.status).toBe(500);
      expect(result.mensaje).toBe('Correo electrónico es requerido');
    });
  
    it('should return error if account is deleted', async () => {
      const loginDto: LoginDto = {
        Correo_electronico: 'deleteduser@example.com',
        Contraseña: 'password123',
      };
  
      (cuentasService.findOne as jest.Mock).mockResolvedValue({
        status: 200,
        cuenta: {
          cuenta_Estado_Cuenta: Estado_Logico.ELIMINADO,
        },
      });
  
      const result = await service.login(loginDto);
      expect(result.status).toBe(500);
      expect(result.mensaje).toBe('La cuenta ha sido eliminada.');
    });
  
    it('should return error if password is incorrect', async () => {
      const loginDto: LoginDto = {
        Correo_electronico: 'test@example.com',
        Contraseña: 'wrongpassword',
      };
  
      (cuentasService.findOne as jest.Mock).mockResolvedValue({
        status: 200,
        cuenta: {
          cuenta_Contrasena: await bcrypt.hash('correctpassword', 10),
          cuenta_Estado_Cuenta: Estado_Logico.ACTIVO,
        },
      });
  
      const result = await service.login(loginDto);
      expect(result.status).toBe(500);
      expect(result.mensaje).toBe('Contraseña incorrecta.');
    });
  });
  
  
});
