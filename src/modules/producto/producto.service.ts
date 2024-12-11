import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Producto } from './entities/producto.entity';
import { Categoria } from '../categoria/entities/categoria.entity';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';

@Injectable()
export class ProductoService {
  constructor(
    @InjectRepository(Producto)
    private readonly productoRepository: Repository<Producto>,

    @InjectRepository(Categoria)
    private readonly categoriaRepository: Repository<Categoria>,
  ) {}

  // Crear un producto y asignar la categoría
  async create(createProductoDto: CreateProductoDto) {
    const { categoriaId, ...productoData } = createProductoDto;

    // Buscar la categoría correspondiente
    const categoria = await this.categoriaRepository.findOne({ where: { id: categoriaId } });
    if (!categoria) {
      throw new Error(`Categoría con ID ${categoriaId} no encontrada.`);
    }

    // Crear el producto y asignar la categoría
    const producto = this.productoRepository.create({
      ...productoData,
      categoria, // Relación con la categoría
    });

    return this.productoRepository.save(producto);
  }

  // Obtener todos los productos con la categoría asociada
  async findAll() {
    return this.productoRepository.find({ relations: ['categoria'] });
  }

  // Buscar un producto por ID
  async findOne(id: number) {
    const producto = await this.productoRepository.findOne({
      where: { id },
      relations: ['categoria'], // Incluir la categoría asociada
    });

    if (!producto) {
      throw new Error('Producto no encontrado');
    }

    return producto;
  }

  // Actualizar un producto y su categoría
  async update(id: number, updateProductoDto: UpdateProductoDto) {
    const { categoriaId, ...productoData } = updateProductoDto;

    // Buscar el producto existente
    const producto = await this.productoRepository.findOne({
      where: { id },
      relations: ['categoria'],
    });

    if (!producto) {
      throw new Error('Producto no encontrado');
    }

    // Si se pasa un nuevo categoriaId, buscar y asignar la nueva categoría
    if (categoriaId) {
      const categoria = await this.categoriaRepository.findOne({ where: { id: categoriaId } });
      if (!categoria) {
        throw new Error(`Categoría con ID ${categoriaId} no encontrada.`);
      }
      producto.categoria = categoria;
    }

    // Actualizar las propiedades del producto
    Object.assign(producto, productoData);

    return this.productoRepository.save(producto);
  }

  // Eliminar un producto
  async remove(id: number) {
    const producto = await this.productoRepository.findOne({ where: { id } });

    if (!producto) {
      throw new Error('Producto no encontrado');
    }

    await this.productoRepository.remove(producto);

    return { message: 'Producto eliminado exitosamente' };
  }

  // Query Builder para consultas personalizadas
  queryBuilder(alias: string) {
    return this.productoRepository.createQueryBuilder(alias);
  }
}
