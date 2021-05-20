import { Client, Message } from 'discord.js';
import { inject, injectable } from 'inversify';
import logger from './logger';
import { MessageResponder } from './services/message-responder';
import { TYPES } from './types';

@injectable()
export class Bot {
  private client: Client;
  private readonly token: string;
  private messageResponder: MessageResponder;

  public prefix: string;

  constructor(
    @inject(TYPES.Client) client: Client,
    @inject(TYPES.Token) token: string,
    @inject(TYPES.MessageResponder) messageResponder: MessageResponder,
    @inject(TYPES.Prefix) prefix: string
  ) {
    this.client = client;
    this.token = token;
    this.messageResponder = messageResponder;
    this.prefix = prefix;
  }

  public listen(): Promise<string> {
    this.client.on('message', (message: Message) => {
      // Ignore messages from other bots
      if (message.author.bot) return;

      // Just log the event
      logger.info('Message received! Contents: ', message.content);

      this.messageResponder.handle(message).catch(() => {
        // eslint workaround for empty functions
      });
    });

    return this.client.login(this.token);
  }

  public getClient(): Client {
    return this.client;
  }
}
