import {ApiProperty} from "@nestjs/swagger"
import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator"

export class CreateUserDto {

    @ApiProperty({ description:'Nombre no encontrado'})
    @IsString({message: "El nombre debe ser caracteres"})
    @IsNotEmpty({message: "El nombre no debe estar vacío"})
    name:string

    @ApiProperty({ description:'Nombre no encontrado'})
    @IsEmail({},{message: "El nombre debe ser caracteres"})
    @IsNotEmpty({message: "El nombre no debe estar vacío"})
    email:string

    @ApiProperty({ description:'Nombre no encontrado'})
    @MinLength(6, {message: "La contraseña debe tener 6 caracteres"})
    @IsString({message: "La contraseña debe ser en cadena"})
    password:string
}
