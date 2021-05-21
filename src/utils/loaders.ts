import { promisify } from 'util';
import glob from 'glob';
import { Command } from '../interfaces/Command';
import { Event } from '../interfaces/Event';
import { Collection } from 'discord.js';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';

@injectable()
export class Loader {
  private commands: Collection<string, Command>;
  private events: Collection<string, Event>;
  private globPromise = promisify(glob);

  constructor(
    @inject(TYPES.Commands) commands: Collection<string, Command>,
    @inject(TYPES.Events) events: Collection<string, Event>
  ) {
    this.commands = commands;
    this.events = events;
  }

  public async loadCommands(commandsDirectory: string): Promise<boolean> {
    let hasFailed = false;
    const commandFiles: string[] = await this.globPromise(
      `${commandsDirectory}/**/*{.ts,.js}`
    );

    // loading files
    commandFiles.map(async (value: string) => {
      try {
        const file: Command = await import(value);
        this.commands.set(file.name, file);
      } catch (error) {
        hasFailed = true;
      }
    });
    return hasFailed;
  }

  public async loadEvents(eventsDirectory: string): Promise<boolean> {
    let hasFailed = false;

    const eventFiles: string[] = await this.globPromise(
      `${eventsDirectory}/**/*{.ts,.js}`
    );

    // Loading files
    eventFiles.map(async (value: string) => {
      try {
        const file: Event = await import(value);
        this.events.set(file.name, file);
      } catch (error) {
        hasFailed = true;
      }
    });

    return hasFailed;
  }
}
