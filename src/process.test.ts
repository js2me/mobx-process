import { describe, expect, it, vi } from 'vitest';

import { ProcessImpl } from './process.impl';
import { ProcessConfig } from './process.types';

export class ProcessMock extends ProcessImpl {
  spies = {
    start: vi.fn(),
    stop: vi.fn(),
    restart: vi.fn(),
  };

  constructor(config: ProcessConfig) {
    super(config);
  }

  async start() {
    await super.start();
    this.spies.start();
  }

  async stop() {
    await super.stop();
    this.spies.stop();
  }

  async restart() {
    await super.restart();
    this.spies.restart();
  }
}

describe('Process', () => {
  it('should be defined', async () => {
    const { ProcessStoreMock } = await import('./process-store.test');
    const store = new ProcessStoreMock();
    const processes = new ProcessMock({
      processes: store,
    });
    expect(processes).toBeDefined();
  });
});
