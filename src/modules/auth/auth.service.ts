import { Injectable, HttpException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { hash, compare } from 'bcrypt';
import * as nodemailer from 'nodemailer';  // Importa nodemailer
import * as dotenv from 'dotenv';  // Importa dotenv

// Carga las variables de entorno
dotenv.config();

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  // Método para registrar un usuario
  async funRegister(objUser: RegisterAuthDto) {
    const { password } = objUser;
    const plainToHash = await hash(password, 12);

    objUser = { ...objUser, password: plainToHash };
    return this.userRepository.save(objUser);
  }

  // Método para iniciar sesión
  async login(credenciales: LoginAuthDto) {
    const { email, password } = credenciales;
    const user = await this.userRepository.findOne({
      where: { email: email },
    });
    if (!user) return new HttpException('Usuario no encontrado', 404);

    const verificarPass = await compare(password, user.password);
    if (!verificarPass) throw new HttpException('Contraseña Invalida', 401);
    const payload = { email: user.email, id: user.id };
    const token = this.jwtService.sign(payload);
    return { user: user, token: token };
  }

  // Método para solicitar el restablecimiento de contraseña
  async forgotPassword(email: string) {
    // Verificar si el usuario existe
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new HttpException('Usuario no encontrado', 404);
    }
  
    // Generar un token para restablecer la contraseña
    const token = this.jwtService.sign({ email: user.email }, { expiresIn: '1h' });
  
    const resetLink = `${process.env.BASE_URL}/auth/reset-password?token=${token}`;
  
    // Configuración de Nodemailer para enviar el correo
    const transporter = nodemailer.createTransport({
      service: 'gmail',  // Usando Gmail como servicio de correo
      auth: {
        user: process.env.GMAIL_USER,  // Usa la variable de entorno para el correo
        pass: process.env.GMAIL_APP_PASSWORD,  // Usa la variable de entorno para la contraseña de la aplicación
      },
    });
  
    const mailOptions = {
      from: process.env.GMAIL_USER,  // Usar la variable de entorno
      to: email,
      subject: 'Restablecer Contraseña',
      text: `Haz clic en el siguiente enlace para restablecer tu contraseña: ${resetLink}`,
    };
  
    try {
      // Enviar el correo
      await transporter.sendMail(mailOptions);
      console.log('Correo enviado');
    } catch (error) {
      console.error('Error al enviar el correo: ', error);
      throw new HttpException('Error al enviar el correo', 500);
    }
  
    return { message: 'Enlace de restablecimiento enviado (simulado)', resetLink };
  }

  // Método para restablecer la contraseña
  async resetPassword(token: string, newPassword: string) {
    try {
      // Decodificar el token
      const decoded = this.jwtService.verify(token);
      const userEmail = decoded.email;

      // Encontrar el usuario por su correo electrónico
      const user = await this.userRepository.findOne({ where: { email: userEmail } });
      if (!user) {
        throw new HttpException('Usuario no encontrado', 404);
      }

      // Encriptar la nueva contraseña
      const hashedPassword = await hash(newPassword, 12);

      // Actualizar la contraseña del usuario
      await this.userRepository.update({ email: userEmail }, { password: hashedPassword });

      return { message: 'Contraseña actualizada con éxito.' };
    } catch (error) {
      throw new HttpException('Token no válido o expirado', 401);
    }
  }
}
