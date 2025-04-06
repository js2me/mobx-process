import { describe, expect, it } from 'vitest';
import { sleep } from 'yummies/async';
import { Class } from 'yummies/utils/types';

import { ProcessStoreImpl } from './process-store.impl.js';
import { Process } from './process.js';
import { ProcessMock } from './process.test';

export class ProcessStoreMock extends ProcessStoreImpl {}

describe('ProcessStore', () => {
  it('should be defined', () => {
    const store = new ProcessStoreMock();
    expect(store).toBeDefined();
  });

  it('currentProcesses should be array', () => {
    const store = new ProcessStoreMock();
    expect(store.currentProcesses).toStrictEqual([]);
  });

  it('hasBlockingProcesses should be boolean', () => {
    const store = new ProcessStoreMock();
    expect(store.hasBlockingProcesses).toBe(false);
  });

  it('load should be defined', () => {
    const store = new ProcessStoreMock();
    expect(store.load).toBeDefined();
  });

  it('unload should be defined', () => {
    const store = new ProcessStoreMock();
    expect(store.unload).toBeDefined();
  });

  it('get should be defined', () => {
    const store = new ProcessStoreMock();
    expect(store.get).toBeDefined();
  });

  it('should be able to load process', async () => {
    const store = new ProcessStoreMock();
    class TestProcess extends ProcessMock {}

    await store.load(TestProcess);

    expect(store.currentProcesses).toHaveLength(1);
    expect(store.currentProcesses[0]).toBeInstanceOf(TestProcess);

    expect(store.get(TestProcess)!.spies.start).toBeCalledTimes(1);
  });

  it('should be able to unload process', async () => {
    const store = new ProcessStoreMock();
    class TestProcess extends ProcessMock {}

    await store.load(TestProcess);
    const instance = store.get(TestProcess)!;
    await store.unload(TestProcess);

    expect(store.currentProcesses).toHaveLength(0);

    expect(instance.spies.stop).toBeCalledTimes(1);
  });

  it('should be able to get process instance', async () => {
    const store = new ProcessStoreMock();
    class TestProcess extends ProcessMock {
      foo = 'bar';
    }

    await store.load(TestProcess);

    const process = store.get(TestProcess);

    expect(process).toBeInstanceOf(TestProcess);
    expect(process?.foo).toBe('bar');
  });

  it('should be able to load process with child processes too', async () => {
    const store = new ProcessStoreMock();
    const startedIds: string[] = [];

    class Cp1 extends ProcessMock {
      async start() {
        await super.start();
        startedIds.push('cp1');
      }
    }
    class Cp2 extends ProcessMock {
      async start() {
        await sleep(100);
        await super.start();
        startedIds.push('cp2');
      }
    }
    class Cp3 extends ProcessMock {
      async start(): Promise<void> {
        await super.start();
        startedIds.push('cp3');
      }
    }
    class TestProcess extends ProcessMock {
      childProcesses: Class<Process>[] = [Cp1, Cp2, Cp3];
    }

    await store.load(TestProcess);

    expect(store.currentProcesses).toHaveLength(4);
    expect(store.currentProcesses[0]).toBeInstanceOf(TestProcess);
    expect(store.currentProcesses[1]).toBeInstanceOf(Cp1);
    expect(store.currentProcesses[2]).toBeInstanceOf(Cp2);
    expect(store.currentProcesses[3]).toBeInstanceOf(Cp3);
    expect(startedIds).toStrictEqual(['cp1', 'cp3', 'cp2']);
  });

  it('should be able to unload all child processes', async () => {
    const store = new ProcessStoreMock();
    const stoppedIds: string[] = [];

    class Cp1 extends ProcessMock {
      async stop() {
        await super.stop();
        stoppedIds.push('cp1');
      }
    }
    class Cp2 extends ProcessMock {
      async stop() {
        await sleep(100);
        await super.stop();
        stoppedIds.push('cp2');
      }
    }
    class Cp3 extends ProcessMock {
      async stop(): Promise<void> {
        await super.stop();
        stoppedIds.push('cp3');
      }
    }
    class TestProcess extends ProcessMock {
      childProcesses: Class<Process>[] = [Cp1, Cp2, Cp3];
    }

    await store.load(TestProcess);
    await store.unload(TestProcess);

    expect(store.currentProcesses).toHaveLength(0);
    expect(stoppedIds).toStrictEqual(['cp1', 'cp3', 'cp2']);
  });
});
