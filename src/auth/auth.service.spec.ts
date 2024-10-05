import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { CuentasService } from 'src/resource/cuentas/cuentas.service';
import { ClientService } from 'src/client/client.service';
import { JwtService } from '@nestjs/jwt';
import { TransaccionService } from 'src/common/transaction/transaccion.service';
import { RegisterDto } from './dto/registro.dto';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { Estado } from 'src/common/enums/cuentas.enum';
import * as bcrypt from 'bcrypt';


describe('AuthService', () => {
  let authService: AuthService;
  let cuentasService: CuentasService;
  let clientService: ClientService;
  let jwtService: JwtService;
  let transaccionService: TransaccionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: CuentasService,
          useValue: {
            findOneByEmail: jest.fn(),
          },
        },
        {
          provide: ClientService,
          useValue: {
            validar_cuenta: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn(),
          },
        },
        {
          provide: TransaccionService,
          useValue: {
            transaction: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    cuentasService = module.get<CuentasService>(CuentasService);
    clientService = module.get<ClientService>(ClientService);
    jwtService = module.get<JwtService>(JwtService);
    transaccionService = module.get<TransaccionService>(TransaccionService);
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      const registroDTO: RegisterDto = {
        identificador: 'test@example.com',
        contraseña: 'testpassword',
        usuario_Nombre: 'Test',
        usuario_Apellidos: 'User',
        usuario_Edad: 25,
        usuario_Tarjeta_Titular: 'Test User',
        usuario_Tarjeta_Direccion: '123 Test St',
        usuario_Tarjeta_Numero_Tarjeta: '4111111111111111',
        usuario_Tarjeta_Fecha_Vencimiento: '12/25'
      };

      jest.spyOn(cuentasService, 'findOneByEmail').mockResolvedValue(false);
      jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedpassword' as never);
      jest.spyOn(transaccionService, 'transaction')
        .mockResolvedValueOnce({ mensaje: 'Éxito', resultado: { id_Usuario: 1 } } as any) // For Usuario
        .mockResolvedValueOnce({ mensaje: 'Éxito', resultado: { id_Tarjeta: 1 } } as any) // For Tarjeta
        .mockResolvedValueOnce({ mensaje: 'Éxito' } as any); // For Cuenta
      jest.spyOn(clientService, 'validar_cuenta').mockResolvedValue({ status: 201, codigo: 'activationcode' });

      const result = await authService.register(registroDTO);

      expect(result).toEqual({
        usuario_Nombre: 'Test',
        identificador: 'test@example.com',
        message: 'Usuario creado exitosamente',
      });
    });

    it('should throw error if user already exists', async () => {
      const registroDTO: RegisterDto = {
        identificador: 'test@example.com',
        contraseña: 'testpassword',
        usuario_Nombre: 'Test',
        usuario_Apellidos: 'User',
        usuario_Edad: 25,
        usuario_Tarjeta_Titular: 'Test User',
        usuario_Tarjeta_Direccion: '123 Test St',
        usuario_Tarjeta_Numero_Tarjeta: '4111111111111111',
        usuario_Tarjeta_Fecha_Vencimiento: '12/25'
      };

      const existingUser = {
        cuenta: {
          cuenta_ID: 1,
          cuenta_Identificador: 'test@example.com',
          cuenta_Contraseña: 'hashedpassword',
          cuenta_Estado_Cuenta: Estado.ACTIVO,
          cuenta_Rol: 'user',
        },
        usuario: {
          usuario_ID: 1,
          usuario_Nombre: 'Test',
          usuario_Apellidos: 'User',
        }
      };

      jest.spyOn(cuentasService, 'findOneByEmail').mockResolvedValue(existingUser);

      await expect(authService.register(registroDTO)).rejects.toThrow(BadRequestException);
    });
  });

  //   describe('login', () => {
  //     it('should login successfully', async () => {
  //       const loginDto: LoginDto = {
  //         identificador: 'test@example.com',
  //         contraseña: 'testpassword',
  //       };

  //       const cuenta = {
  //         cuenta: {
  //           cuenta_Identificador: 'test@example.com',
  //           cuenta_Contraseña: 'hashedpassword',
  //           cuenta_Rol: 'user',
  //           cuenta_Estado_Cuenta: Estado.ACTIVO,
  //         },
  //       };

  //       jest.spyOn(cuentasService, 'findOneByEmail').mockResolvedValue(cuenta);
  //       jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);
  //       jest.spyOn(jwtService, 'signAsync').mockResolvedValue('accesstoken');

  //       const result = await authService.login(loginDto);

  //       expect(result).toEqual({
  //         access_Token: 'accesstoken',
  //         identificador: 'test@example.com',
  //         role: 'user',
  //         message: 'Sesión activa',
  //       });
  //     });

  //     it('should throw error if account not found', async () => {
  //       const loginDto: LoginDto = {
  //         identificador: 'test@example.com',
  //         contraseña: 'testpassword',
  //       };

  //       jest.spyOn(cuentasService, 'findOneByEmail').mockResolvedValue(null);

  //       await expect(authService.login(loginDto)).rejects.toThrow(UnauthorizedException);
  //     });

  //     it('should throw error if password does not match', async () => {
  //       const loginDto: LoginDto = {
  //         identificador: 'test@example.com',
  //         contraseña: 'testpassword',
  //       };

  //       const cuenta = {
  //         cuenta: {
  //           cuenta_Identificador: 'test@example.com',
  //           cuenta_Contraseña: 'hashedpassword',
  //           cuenta_Rol: 'user',
  //           cuenta_Estado_Cuenta: Estado.ACTIVO,
  //         },
  //       };

  //       jest.spyOn(cuentasService, 'findOneByEmail').mockResolvedValue(cuenta);
  //       jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);

  //       await expect(authService.login(loginDto)).rejects.toThrow(UnauthorizedException);
  //     });

  //     it('should throw error if account is inactive', async () => {
  //       const loginDto: LoginDto = {
  //         identificador: 'test@example.com',
  //         contraseña: 'testpassword',
  //       };

  //       const cuenta = {
  //         cuenta: {
  //           cuenta_Identificador: 'test@example.com',
  //           cuenta_Contraseña: 'hashedpassword',
  //           cuenta_Rol: 'user',
  //           cuenta_Estado_Cuenta: Estado.INACTIVO,
  //         },
  //       };

  //       jest.spyOn(cuentasService, 'findOneByEmail').mockResolvedValue(cuenta);

  //       await expect(authService.login(loginDto)).rejects.toThrow(UnauthorizedException);
  //     });
  //   });
});