import { IsString, IsNotEmpty, IsObject } from 'class-validator';

export class LineProfileDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  displayName: string;

  @IsString()
  pictureUrl?: string;

  @IsString()
  statusMessage?: string;
}

export class LineLoginDto {
  @IsString()
  @IsNotEmpty()
  code: string;

  @IsString()
  @IsNotEmpty()
  state: string;

  @IsObject()
  lineProfile?: LineProfileDto;
}
