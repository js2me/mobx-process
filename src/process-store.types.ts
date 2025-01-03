import { Class } from 'yummies/utils/types';

import { ProcessModel } from './process-model';

export type ProcessLoadPayload =
  | Class<ProcessModel>
  | Class<ProcessModel>[]
  | readonly Class<ProcessModel>[];
