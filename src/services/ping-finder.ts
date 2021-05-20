import { injectable } from 'inversify';

@injectable()
export class PingFinder {
  private regexp = 'ping';

  public isPing(stringToSearch: string) {
    return stringToSearch.search(this.regexp) >= 0;
  }
}
