import 'reflect-metadata';
import { Container } from 'inversify';
import { TYPES } from './types';
import { Bot } from './bot';
import { Client } from 'discord.js';
import { MessageResponder } from './services/message-responder';
import { PingFinder } from './services/ping-finder';
import logger from './logger';
import { PrefixChecker } from './services/prefix-checker';

const container = new Container();

container.bind<Bot>(TYPES.Bot).to(Bot).inSingletonScope();
container.bind<Client>(TYPES.Client).toConstantValue(new Client());

if (!process.env.TOKEN) {
  logger.error('Please give me a token in process.env.TOKEN');
  process.exit(1);
}
container.bind<string>(TYPES.Token).toConstantValue(process.env.TOKEN);

if (!process.env.PREFIX) {
  logger.error('Please supply a prefix in process.env.PREFIX');
  process.exit(1);
}
container.bind<string>(TYPES.Prefix).toConstantValue(process.env.PREFIX);

container
  .bind<MessageResponder>(TYPES.MessageResponder)
  .to(MessageResponder)
  .inSingletonScope();
container.bind<PingFinder>(TYPES.PingFinder).to(PingFinder).inSingletonScope();
container
  .bind<PrefixChecker>(TYPES.PrefixChecker)
  .to(PrefixChecker)
  .inSingletonScope();

export default container;
