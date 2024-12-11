import { Body, Controller, Post, Query } from '@nestjs/common';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { AuthService } from './auth.service';
import { ApiTags} from '@nestjs/swagger'
import { ForgotPasswordDto } from './dto/forgot-password.dto';  // Importar el DTO
import { ResetPasswordDto } from './dto/reset-password.dto';  // Importar el DTO

@ApiTags('auth')
@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService) {
    }

    @Post('register')
    registerUser(@Body() userObj: RegisterAuthDto) {
        console.log(userObj);
        return this.authService.funRegister(userObj);
    }

    @Post('login')
    login(@Body() credenciales: LoginAuthDto) {
        return this.authService.login(credenciales)
    }

    // Ruta para solicitar el restablecimiento de contraseña
  @Post('forgot-password')
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto.email);
  }

  // Ruta para restablecer la contraseña
  @Post('reset-password')
  async resetPassword(@Body() body: { token: string, newPassword: string }) {
    const { token, newPassword } = body;
    return this.authService.resetPassword(token, newPassword);
  }
}
