import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { MovieModel } from './movie.model';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { Types } from 'mongoose';
import { GenreIdsDto } from './dto/genreIds.dto';
import { UpdateCountDto } from './dto/updateCount.dto';
import { log } from 'console';

@Injectable()
export class MovieService {
	constructor(
		@InjectModel(MovieModel) private readonly movieModel: ModelType<MovieModel>,
	) {}

	async getAll(searchTerm: string) {
		let options = {};

		if (searchTerm) {
			options = {
				$or: [
					{
						title: new RegExp(searchTerm, 'i'),
					},
				],
			};
		}

		return this.movieModel
			.find(options)
			.select('-updatedAt -__v')
			.sort({ createdAt: 'desc' })
			.populate('actors genres')
			.exec();
	}

	async bySlug(slug: string) {
		const doc = await this.movieModel
			.findOne({ slug })
			.populate('actors genres')
			.exec();
		if (!doc) throw new NotFoundException('Movie not found');

		return doc;
	}

	async byActor(actorId: Types.ObjectId) {
		const docs = await this.movieModel.find({ actors: actorId }).exec();
		if (!docs) throw new NotFoundException('Movies not found');

		return docs;
	}

	async byGenres(genreIds: GenreIdsDto[]) {
		const docs = await this.movieModel
			.find({ genres: { $in: genreIds } })
			.exec();
		if (!docs) throw new NotFoundException('Movies not found');

		return docs;
	}

	async getMostPopular() {
		return this.movieModel
			.find({ countOpened: { $gt: 0 } })
			.populate('genres')
			.sort({ countOpened: -1 })
			.exec();
	}

	async updateCountOpened(slug: string) {
		const doc = await this.movieModel
			.findOneAndUpdate(
				{ slug },
				{
					$inc: { countOpened: 1 },
				},
				{
					new: true,
				},
			)
			.exec();

		if (!doc) throw new NotFoundException('Movie not found');

		return doc;
	}

	async updateRating(id: Types.ObjectId, newRating: number) {
		return this.movieModel
			.findByIdAndUpdate(
				id,
				{
					rating: newRating,
				},
				{
					new: true,
				},
			)
			.exec();
	}

	async byId(_id: string) {
		const doc = await this.movieModel.findById(_id).exec();
		if (!doc) throw new NotFoundException('Movie not found');

		return doc;
	}

	async create() {
		const defaultValue = {
			bigPoster: '',
			actors: [],
			genres: [],
			poster: '',
			title: '',
			videoUrl: '',
			slug: '',
		};
		const movie = await this.movieModel.create(defaultValue);

		return movie._id;
	}

	async update(_id: string, dto: UpdateMovieDto) {
		const doc = await this.movieModel
			.findByIdAndUpdate(_id, dto, {
				new: true,
			})
			.exec();
		if (!doc) throw new NotFoundException('Movie not found');

		return doc;
	}

	async delete(_id: string) {
		const doc = await this.movieModel.findByIdAndDelete(_id);
		if (!doc) throw new NotFoundException('Movie not found');

		return doc;
	}
}
