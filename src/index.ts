import 'dotenv/config';
import { Bot } from './Bot';
import container from './inversify.config';
import { TYPES } from './types';

const bot = container.get<Bot>(TYPES.Bot);

bot
  .listen()
  .then(() => {
    console.log('Logged in!');
  })
  .catch((err) => {
    console.error(err);
  });
