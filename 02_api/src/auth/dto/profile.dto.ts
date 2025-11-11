import {
  IsString,
  IsOptional,
  IsNumber,
  IsBoolean,
  IsEmail,
} from 'class-validator';

export class ProfileDto {
  @IsString()
  @IsOptional()
  id?: string;

  @IsString()
  @IsOptional()
  line_user_id?: string;

  @IsString()
  @IsOptional()
  display_name?: string;

  @IsString()
  @IsOptional()
  avatar_url?: string;

  @IsString()
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsNumber()
  @IsOptional()
  trust_level?: number;

  @IsNumber()
  @IsOptional()
  trust_score?: number;

  @IsBoolean()
  @IsOptional()
  is_verified?: boolean;

  @IsOptional()
  verification_data?: any;

  @IsString()
  @IsOptional()
  updated_at?: string;
}

export class UpdateProfileDto {
  @IsString()
  @IsOptional()
  display_name?: string;

  @IsString()
  @IsOptional()
  avatar_url?: string;

  @IsString()
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsString()
  @IsOptional()
  phone?: string;
}
