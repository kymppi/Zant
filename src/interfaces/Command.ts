/* eslint-disable no-unused-vars */
import { Message } from 'discord.js';
import { Bot } from 'src/Bot';
import { Category } from './Category';

export interface RunFunction {
  (client: Bot, message: Message, args: string[]): Promise<unknown>;
}

export interface Command {
  name: string;
  category: Category;
  run: RunFunction;
}
