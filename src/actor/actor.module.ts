import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';

import { ActorController } from './actor.controller';
import { ActorService } from './actor.service';
import { ActorModel } from './actor.model';

@Module({
	imports: [
		TypegooseModule.forFeature([
			{
				typegooseClass: ActorModel,
				schemaOptions: {
					collection: 'Actor',
				},
			},
		]),
	],
	controllers: [ActorController],
	providers: [ActorService],
})
export class ActorModule {}
