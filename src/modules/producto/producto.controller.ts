import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards} from '@nestjs/common';
import { ProductoService } from './producto.service';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { NotFoundException } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

//@UseGuards(JwtAuthGuard)
@ApiTags('producto')
@Controller('producto')
export class ProductoController {
  constructor(private readonly productoService: ProductoService) {}

  @Post()
  create(@Body() createProductoDto: CreateProductoDto) {
    console.log(createProductoDto);
    return this.productoService.create(createProductoDto);
  }

  @Get()
  findAll() {
    return this.productoService.findAll();
  }

  @Get('back')
  async backend(@Req() req: Request) {
    const builder = this.productoService.queryBuilder('productos');
    
    // Filtrar por nombre si existe el parámetro q
    if (req.query.q) {
      builder.where("productos.nombre LIKE :q", { q: `%${req.query.q}%` });
    }
  
    const sort: any = req.query.sort;
    if (sort) {
      builder.orderBy('productos.precio', sort.toUpperCase());
    }
  
    const page: number = parseInt(req.query.page as any) || 1;
    const limit = 10;
    builder.offset((page - 1) * limit).limit(limit);
  
    // Ejecutar la consulta y almacenar los productos
    const productos = await builder.getMany();
    
    // Obtener el total de productos
    const total = await builder.getCount();
  
    // Retornar los productos con la paginación
    return {
      data: productos,
      total,
      page,
      last_page: Math.ceil(total / limit),
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const producto = await this.productoService.findOne(+id);
    if (!producto) {
      throw new NotFoundException(`Producto con ID ${id} no encontrado.`);
    }
    return producto;
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductoDto: UpdateProductoDto) {
    return this.productoService.update(+id, updateProductoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productoService.remove(+id);
  }
}
