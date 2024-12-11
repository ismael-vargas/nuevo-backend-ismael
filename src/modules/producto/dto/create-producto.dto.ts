import { IsDecimal, IsInt, IsNotEmpty, IsString, IsOptional, IsBoolean, IsIn, IsNumber } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateProductoDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;
  
  @Transform(({ value }) => parseFloat(value))  // Convierte a número
  @IsNumber()
  @IsNotEmpty()
  precio: number;

  @IsInt()
  @IsNotEmpty()
  stock: number;

  @IsOptional()
  @IsString()
  image: string;

  @IsOptional()
  @IsString()
  descripcion: string;

  @IsOptional()
  @IsBoolean()
  estado: boolean;

  @IsInt()
  @IsNotEmpty()
  categoriaId: number;
}
