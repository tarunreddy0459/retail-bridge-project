import { IsString } from 'class-validator';

export class UpdateSuperAdminDto {
  @IsString()
  name: string;

  @IsString()
  email: string;

  @IsString()
  phoneNumber: string;

  @IsString()
  password: string;
}
