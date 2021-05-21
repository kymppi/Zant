/* eslint-disable no-unused-vars */
import { Bot } from 'src/Bot';

export interface RunFunction {
  (client: Bot, ...args: any[]): Promise<unknown>;
}

export interface Event {
  name: string;
  run: RunFunction;
}
