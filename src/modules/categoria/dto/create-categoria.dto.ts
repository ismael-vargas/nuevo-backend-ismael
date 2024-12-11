import { IsString, IsOptional } from 'class-validator';

export class CreateCategoriaDto {
  @IsString()  // Asegura que el nombre sea una cadena
  nombreCategoria: string;

  @IsString()  // Asegura que el detalle sea una cadena
  @IsOptional() // Marca detalle como opcional, ya que el valor puede ser nulo
  detalle: string;
}
