import 'dotenv/config';
import { Bot } from './Bot';
import container from './inversify.config';
import logger from './logger';
import { TYPES } from './types';

const bot = container.get<Bot>(TYPES.Bot);
const client = bot.getClient();

bot
  .listen()
  .then(() => {
    logger.info(`Logged in as ${client.user?.tag}`);
  })
  .catch((err) => {
    logger.error(err);
  });
