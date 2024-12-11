import { PartialType } from "@nestjs/mapped-types";
import { LoginAuthDto } from "./login-auth.dto";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class RegisterAuthDto extends PartialType(LoginAuthDto){
    @IsNotEmpty()
    name: string;

    @IsOptional()
    @IsString()
    telefono: string;  // Agregar este campo
    
}