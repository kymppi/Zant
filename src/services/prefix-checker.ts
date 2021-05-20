import { injectable } from 'inversify';

@injectable()
export class PrefixChecker {
  public startWithPrefix(message: string, prefix: string): boolean {
    return message.toLowerCase().startsWith(prefix.toLowerCase());
  }
}
