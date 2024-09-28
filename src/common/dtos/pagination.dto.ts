
import { IsInt, IsOptional, IsPositive } from 'class-validator';

export class PaginationDto {
    @IsInt()
    @IsPositive()
    @IsOptional()
    page?: number = 1; 

    @IsInt()
    @IsPositive()
    @IsOptional()
    limit?: number = 5; 
}
