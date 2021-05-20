import 'reflect-metadata';
import { describe, beforeEach, it } from 'mocha';
import { expect } from 'chai';
import { PingFinder } from '../../src/services/ping-finder';
import { MessageResponder } from '../../src/services/message-responder';
import { instance, mock, verify, when } from 'ts-mockito';
import { Message } from 'discord.js';
import { PrefixChecker } from '../../src/services/prefix-checker';

describe('MessageResponder', () => {
  let mockedPingFinderClass: PingFinder;
  let mockedPingFinderInstance: PingFinder;
  let mockedMessageClass: Message;
  let mockedMessageInstance: Message;
  let mockedPrefixCheckerClass: PrefixChecker;
  let mockedPrefixCheckerInstance: PrefixChecker;

  let service: MessageResponder;

  beforeEach(() => {
    mockedPingFinderClass = mock(PingFinder);
    mockedPingFinderInstance = instance(mockedPingFinderClass);
    mockedMessageClass = mock(Message);
    mockedMessageInstance = instance(mockedMessageClass);
    mockedPrefixCheckerClass = mock(PrefixChecker);
    mockedPrefixCheckerInstance = instance(mockedPrefixCheckerClass);

    setMessageContents();

    service = new MessageResponder(
      mockedPingFinderInstance,
      mockedPrefixCheckerInstance,
      'non'
    );
  });

  it('should reply', async () => {
    whenIsPingThenReturn(true);
    whenIsPrefixThenReturn(true);

    await service.handle(mockedMessageInstance);

    verify(mockedMessageClass.reply('pong!')).once();
  });

  it('should not reply', async () => {
    whenIsPingThenReturn(false);
    whenIsPrefixThenReturn(true);

    await service
      .handle(mockedMessageInstance)
      .then(() => {
        // Successful promise is unexpected, so we fail the test
        expect.fail('Unexpected promise');
      })
      .catch(() => {
        // Rejected promise is expected, so nothing happens here
      });

    verify(mockedMessageClass.reply('pong!')).never();
  });

  function setMessageContents() {
    mockedMessageInstance.content = 'Non-empty string';
  }

  function whenIsPingThenReturn(result: boolean) {
    when(mockedPingFinderClass.isPing('Non-empty string')).thenReturn(result);
  }

  function whenIsPrefixThenReturn(result: boolean) {
    when(
      mockedPrefixCheckerClass.startWithPrefix('Non-empty string', 'non')
    ).thenReturn(result);
  }
});
