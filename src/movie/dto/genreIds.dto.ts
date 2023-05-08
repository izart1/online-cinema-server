import { IsNotEmpty, MinLength } from 'class-validator';
import { Types } from 'mongoose';

export class GenreIdsDto {
	@IsNotEmpty({ message: 'Enter genre' })
	@MinLength(24, { each: true })
	genreIds: Types.ObjectId[];
}
