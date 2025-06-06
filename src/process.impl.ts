import { LinkedAbortController } from 'linked-abort-controller';
import {
  action,
  computed,
  makeObservable,
  observable,
  runInAction,
} from 'mobx';
import { Class } from 'yummies/utils/types';

import { ProcessStore } from './process-store.js';
import { Process } from './process.js';
import { ProcessConfig, ProcessStatus } from './process.types.js';

declare const process: { env: { NODE_ENV?: string } };

export class ProcessImpl implements Process {
  private abortController: AbortController;

  protected stopSignal: AbortSignal;

  protected processes: ProcessStore;

  private _childProcesses: Class<Process>[];
  private _isBlocking: boolean = true;
  private _status = ProcessStatus.Initialized;

  childProcesses!: Class<Process>[];
  isBlocking!: boolean;
  status!: ProcessStatus;

  id =
    process.env.NODE_ENV === 'production'
      ? `p_${globalThis.crypto.randomUUID()}`
      : `${(this as any).constructor.name}_p_${globalThis.crypto.randomUUID()}`;

  constructor({ processes, abortSignal, childProcesses }: ProcessConfig) {
    this.processes = processes;
    this._childProcesses = childProcesses ?? [];
    this.abortController = new LinkedAbortController(abortSignal);
    this.stopSignal = this.abortController.signal;

    observable.ref(this, '_status');
    observable.ref(this, '_childProcesses');
    observable.ref(this, '_isBlocking');
    computed(this, 'isWorking');
    action.bound(this, 'init');
    action.bound(this, 'restart');
    action.bound(this, 'start');
    action.bound(this, 'stop');

    makeObservable(this);

    Object.defineProperty(this, 'childProcesses', {
      get: () => this._childProcesses,
      set: (value) => (this._childProcesses = value),
    });

    Object.defineProperty(this, 'isBlocking', {
      get: () => this._isBlocking,
      set: (value) => (this._isBlocking = value),
    });

    Object.defineProperty(this, 'status', {
      get: () => this._status,
      set: (value) => (this._status = value),
    });

    this.init();
  }

  get isWorking() {
    return (
      this.status === ProcessStatus.Working &&
      this.childProcesses.every(
        (childProcess) => this.processes.get(childProcess)?.isWorking,
      )
    );
  }

  init(): void {
    // needs to override
  }

  async restart() {
    await this.processes.reload((this as any).constructor);
  }

  async start() {
    this.status = ProcessStatus.Starting;

    if (this.childProcesses?.length) {
      await this.processes.load(this.childProcesses);
    }

    runInAction(() => {
      this.status = ProcessStatus.Working;
    });
  }

  async stop() {
    this.status = ProcessStatus.Stopping;
    this.abortController.abort();

    if (this.childProcesses?.length) {
      await this.processes.unload(this.childProcesses);
    }

    runInAction(() => {
      this.status = ProcessStatus.Stopped;
    });
  }
}
