import { expect } from 'chai';
import { Message } from 'discord.js';
import { beforeEach, describe, it } from 'mocha';
import { instance, mock } from 'ts-mockito';
import { PrefixChecker } from '../../src/services/prefix-checker';

describe('PrefixChecker', () => {
  let mockedMessageClass: Message;
  let mockedMessageInstance: Message;
  let service: PrefixChecker;

  beforeEach(() => {
    mockedMessageClass = mock(Message);
    mockedMessageInstance = instance(mockedMessageClass);
    setMessageContents();

    service = new PrefixChecker();
  });

  it('should not find prefix', () => {
    expect(service.startWithPrefix(mockedMessageInstance.content, '?')).to.be
      .false;
  });

  it('should find prefix', () => {
    expect(service.startWithPrefix(mockedMessageInstance.content, 'Non')).to.be
      .true;
  });

  it('should find prefix with randomly capitalized letters', () => {
    expect(service.startWithPrefix(mockedMessageInstance.content, 'NOn')).to.be
      .true;
  });

  function setMessageContents() {
    mockedMessageInstance.content = 'Non-empty string';
  }
});
