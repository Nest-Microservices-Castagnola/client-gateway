import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Min,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  public name: string;

  @IsOptional()
  public description: string;

  @IsNumber({
    maxDecimalPlaces: 4,
  })
  @IsNotEmpty()
  @IsPositive()
  @Min(0)
  @Type(() => Number)
  public price: number;
}
