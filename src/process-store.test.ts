import { describe, expect, it } from 'vitest';

import { ProcessStoreImpl } from './process-store.impl';
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
  });
});
