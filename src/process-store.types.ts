import { Class } from 'yummies/utils/types';

import { Process } from './process';

export type ProcessLoadPayload =
  | Class<Process>
  | Class<Process>[]
  | readonly Class<Process>[];

export type ProcessGetPayload<T extends Process> = string | Class<T>;
