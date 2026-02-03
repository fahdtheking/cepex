import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/roles.enum';
import { RolesGuard } from '../auth/roles.guard';
import { CreateProductServiceDto } from './dto/create-product-service.dto';
import { UpdateProductServiceDto } from './dto/update-product-service.dto';
import { ProductsServicesService } from './products-services.service';

@Controller('products-services')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class ProductsServicesController {
  constructor(private readonly productsServicesService: ProductsServicesService) {}

  @Post()
  @Roles(Role.Exporter)
  async create(@Body() payload: CreateProductServiceDto) {
    return this.productsServicesService.createProductService('system', payload);
  }

  @Patch(':id')
  @Roles(Role.Exporter)
  async update(@Param('id') id: string, @Body() payload: UpdateProductServiceDto) {
    return this.productsServicesService.updateProductService('system', id, payload);
  }

  @Get('organization/:organizationId')
  @Roles(Role.Exporter, Role.CepexAgent)
  async listByOrganization(@Param('organizationId') organizationId: string) {
    return this.productsServicesService.listByOrganization(organizationId);
  }

  @Delete(':id')
  @Roles(Role.Exporter)
  async remove(@Param('id') id: string) {
    return this.productsServicesService.deleteProductService('system', id);
  }
}
