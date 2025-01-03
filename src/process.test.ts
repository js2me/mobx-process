import { describe, expect, it } from 'vitest';

import { ProcessImpl } from './process.impl';

export class ProcessMock extends ProcessImpl {}

describe('Process', () => {
  it('should be defined', async () => {
    const { ProcessStoreMock } = await import('./process-store.test');
    const store = new ProcessStoreMock();
    const p = new ProcessMock({
      processes: store,
    });
    expect(p).toBeDefined();
  });
});
