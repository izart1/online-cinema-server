import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { Types } from 'mongoose';

export class UpdateCountDto {
	@IsNotEmpty({ message: 'Enter genre' })
	@MinLength(2, { each: true })
	@IsString()
	slug: string;
}
