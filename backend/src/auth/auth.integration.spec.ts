import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RefreshDto } from './dto/refresh.dto';

const mockTokens = {
  accessToken: 'mock-access-token',
  refreshToken: 'mock-refresh-token',
};

const mockJwtService = {
  sign: jest.fn().mockReturnValue('mock-token'),
  verify: jest.fn(),
};

describe('Auth - Integration test', () => {
  let controller: AuthController;
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => jest.clearAllMocks());


  // login tests
  describe('POST /auth/login', () => {
    const loginDto: LoginDto = { name: 'Jorge', email: 'jorge@test.com' };

    it('retorna accessToken y refreshToken', () => {
      mockJwtService.sign
        .mockReturnValueOnce(mockTokens.accessToken)
        .mockReturnValueOnce(mockTokens.refreshToken);

      const result = controller.login(loginDto);

      expect(result).toEqual(mockTokens);
    });

    it('llama a sign con el payload correcto', () => {
      controller.login(loginDto);

      expect(mockJwtService.sign).toHaveBeenNthCalledWith(
        1,
        { name: loginDto.name, email: loginDto.email },
        expect.objectContaining({
          secret: expect.any(String),
          expiresIn: '10m',
        }),
      );

      expect(mockJwtService.sign).toHaveBeenNthCalledWith(
        2,
        { name: loginDto.name, email: loginDto.email },
        expect.objectContaining({
          secret: expect.any(String),
          expiresIn: '7d',
        }),
      );
    });

    it('llama al service exactamente una vez', () => {
      const spy = jest.spyOn(service, 'login');
      controller.login(loginDto);
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(loginDto);
    });
  });

 
  // refresh tests
  describe('POST /auth/refresh', () => {
    const refreshDto: RefreshDto = { refreshToken: 'valid-refresh-token' };

    const verifiedPayload = {
      name: 'Jorge',
      email: 'jorge@test.com',
      iat: 1234567890,
      exp: 9999999999,
    };

    it('retorna nuevos tokens cuando el refresh token es válido', () => {
      mockJwtService.verify.mockReturnValue(verifiedPayload);
      mockJwtService.sign
        .mockReturnValueOnce(mockTokens.accessToken)
        .mockReturnValueOnce(mockTokens.refreshToken);

      const result = controller.refresh(refreshDto);

      expect(result).toEqual(mockTokens);
    });

    it('llama a verify con el secret correcto', () => {
      mockJwtService.verify.mockReturnValue(verifiedPayload);

      controller.refresh(refreshDto);

      expect(mockJwtService.verify).toHaveBeenCalledWith(
        refreshDto.refreshToken,
        expect.objectContaining({
          secret: expect.any(String),
        }),
      );
    });

    it('los nuevos tokens se generan con el payload del refresh token', () => {
      mockJwtService.verify.mockReturnValue(verifiedPayload);

      controller.refresh(refreshDto);

      const expectedPayload = {
        name: verifiedPayload.name,
        email: verifiedPayload.email,
      };

      expect(mockJwtService.sign).toHaveBeenNthCalledWith(
        1,
        expectedPayload,
        expect.objectContaining({ expiresIn: '10m' }),
      );
      expect(mockJwtService.sign).toHaveBeenNthCalledWith(
        2,
        expectedPayload,
        expect.objectContaining({ expiresIn: '7d' }),
      );
    });

    it('lanza UnauthorizedException cuando verify falla', () => {
      mockJwtService.verify.mockImplementation(() => {
        throw new Error('Token malformado');
      });

      expect(() => controller.refresh(refreshDto)).toThrow(
        UnauthorizedException,
      );
    });

    it('el mensaje de la excepción es el esperado', () => {
      mockJwtService.verify.mockImplementation(() => {
        throw new Error();
      });

      expect(() => controller.refresh(refreshDto)).toThrow(
        'Refresh token inválido o expirado.',
      );
    });
  });
});
