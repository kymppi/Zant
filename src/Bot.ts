import { Client, Collection, Message } from 'discord.js';
import { inject, injectable } from 'inversify';
import { Logger } from 'winston';
import { Command } from './interfaces/Command';
import loggerFromFile from './logger';
import { MessageResponder } from './services/message-responder';
import { TYPES } from './types';
import { Loader } from './utils/loaders';

@injectable()
export class Bot {
  private client: Client;
  private readonly token: string;
  private messageResponder: MessageResponder;
  private loader: Loader;

  public commands: Collection<string, Command>;
  public prefix: string;

  public logger: Logger;

  constructor(
    @inject(TYPES.Client) client: Client,
    @inject(TYPES.Token) token: string,
    @inject(TYPES.MessageResponder) messageResponder: MessageResponder,
    @inject(TYPES.Prefix) prefix: string,
    @inject(TYPES.Loader) loader: Loader
  ) {
    this.client = client;
    this.token = token;
    this.messageResponder = messageResponder;
    this.prefix = prefix;
    this.commands = new Collection();
    this.logger = loggerFromFile;
    this.loader = loader;
  }

  public listen(): Promise<string> {
    this.client.on('message', (message: Message) => {
      // Ignore messages from other bots
      if (message.author.bot) return;

      // Just log the event
      this.logger.info('Message received! Contents: ', message.content);

      this.messageResponder.handle(message).catch(() => {
        // eslint workaround for empty functions
      });
    });

    return this.client.login(this.token);
  }

  public async loadCommands(path: string) {
    const hasFailed = await this.loader.loadCommands(path);
    if (hasFailed) {
      this.logger.error('An error occurred while loading commands!');
    }
  }

  public async loadEvents(path: string) {
    const hasFailed = await this.loader.loadEvents(path);
    if (hasFailed) {
      this.logger.error('An error occurred while loading events!');
    }
  }

  public getClient(): Client {
    return this.client;
  }
}
