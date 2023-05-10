import { Telegram } from 'src/telegram/telegram.interface';

export const getTelegramConfig = (): Telegram => ({
	chatId: process.env.TG_CHAT_ID,
	token: process.env.TG_TOKEN,
});
