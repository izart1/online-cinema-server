import { Controller, Get } from '@nestjs/common';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { UserService } from './user.service';
import { User } from './decorators/user.decorator';

@Controller('user')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Get('profile')
	@Auth('admin')
	async getProfile(@User('_id') _id: string) {
		return this.userService.byId(_id);
	}
}
