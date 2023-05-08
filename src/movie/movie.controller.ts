import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	Param,
	Post,
	Query,
	UsePipes,
	ValidationPipe,
	Put,
} from '@nestjs/common';
import { Types } from 'mongoose';

import { Auth } from 'src/auth/decorators/auth.decorator';
import { IdValidationPipe } from 'src/pipes/id.validation.pipe';
import { MovieService } from './movie.service';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { GenreIdsDto } from './dto/genreIds.dto';
import { UpdateCountDto } from './dto/updateCount.dto';

@Controller('movie')
export class MovieController {
	constructor(private readonly moviesService: MovieService) {}

	@Get('by-slug/:slug')
	async bySlug(@Param('slug') slug: string) {
		return this.moviesService.bySlug(slug);
	}

	@Get('by-actor/:actorId')
	async byActor(@Param('actorId', IdValidationPipe) actorId: Types.ObjectId) {
		return this.moviesService.byActor(actorId);
	}

	@UsePipes(new ValidationPipe())
	@Post('by-genres')
	@HttpCode(200)
	async byGenres(@Body('genreIds') genreIds: Types.ObjectId[]) {
		return this.moviesService.byGenres(genreIds);
	}

	@Get()
	async getAll(@Query('searchTerm') searchTerm?: string) {
		return this.moviesService.getAll(searchTerm);
	}

	@Get('most-popular')
	async getMostPopular() {
		return this.moviesService.getMostPopular();
	}

	// @UsePipes(new ValidationPipe())
	@Put('update-count-opened')
	@HttpCode(200)
	async updateCountOpened(@Body('slug') slug: string) {
		return this.moviesService.updateCountOpened(slug);
	}

	@Get(':id')
	@Auth('admin')
	async getOne(@Param('id', IdValidationPipe) id: string) {
		return this.moviesService.byId(id);
	}

	@UsePipes(new ValidationPipe())
	@Post()
	@HttpCode(200)
	@Auth('admin')
	async create() {
		return this.moviesService.create();
	}

	@UsePipes(new ValidationPipe())
	@Put(':id')
	@HttpCode(200)
	@Auth('admin')
	async update(
		@Param('id', IdValidationPipe) id: string,
		@Body() dto: UpdateMovieDto,
	) {
		return this.moviesService.update(id, dto);
	}

	@Delete(':id')
	@HttpCode(200)
	@Auth('admin')
	async delete(@Param('id', IdValidationPipe) id: string) {
		return this.moviesService.delete(id);
	}
}
