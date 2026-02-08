import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { SuperAdminService } from './super_admin.service';
import { CreateSuperAdminDto } from './dto/create_super_admin.dto';
// import { CreateSuperAdminResponseDto } from './dto/create_super_admin_response.dto';
import { UpdateSuperAdminDto } from './dto/update_super_admin.dto';

@Controller('super-admins')
export class SuperAdminController {
  constructor(private readonly service: SuperAdminService) {}

  @Post()
  create(@Body() dto: CreateSuperAdminDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateSuperAdminDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
