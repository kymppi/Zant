import { Message } from 'discord.js';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import { PingFinder } from './ping-finder';
import { PrefixChecker } from './prefix-checker';

@injectable()
export class MessageResponder {
  private prefix: string;
  private pingFinder: PingFinder;
  private prefixChecker: PrefixChecker;

  constructor(
    @inject(TYPES.PingFinder) pingFinder: PingFinder,
    @inject(TYPES.PrefixChecker) prefixChecker: PrefixChecker,
    @inject(TYPES.Prefix) prefix: string
  ) {
    this.pingFinder = pingFinder;
    this.prefixChecker = prefixChecker;
    this.prefix = prefix;
  }

  handle(message: Message): Promise<Message | Message[]> {
    if (!this.prefixChecker.startWithPrefix(message.content, this.prefix)) {
      return Promise.reject();
    }

    if (this.pingFinder.isPing(message.content)) {
      return message.reply('pong!');
    }

    return Promise.reject();
  }
}
