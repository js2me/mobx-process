<img src="assets/logo.png" align="right" height="156" alt="logo" />

# mobx-process  

[![NPM version][npm-image]][npm-url] [![test status][github-test-actions-image]][github-actions-url] [![build status][github-build-actions-image]][github-actions-url] [![npm download][download-image]][download-url] [![bundle size][bundlephobia-image]][bundlephobia-url]


[npm-image]: http://img.shields.io/npm/v/mobx-process.svg
[npm-url]: http://npmjs.org/package/mobx-process
[github-build-actions-image]: https://github.com/js2me/mobx-process/workflows/Build/badge.svg
[github-test-actions-image]: https://github.com/js2me/mobx-process/workflows/Test/badge.svg
[github-actions-url]: https://github.com/js2me/mobx-process/actions
[download-image]: https://img.shields.io/npm/dm/mobx-process.svg
[download-url]: https://npmjs.org/package/mobx-process
[bundlephobia-url]: https://bundlephobia.com/result?p=mobx-process
[bundlephobia-image]: https://badgen.net/bundlephobia/minzip/mobx-process

_**MobX** code blocks working by start\stop mechanism_  

Main goal which these "processes" are needed is the executing some business logic across whole application. Naming "process" was borrowed from [FSD architectural methodology](https://feature-sliced.design/docs/get-started/overview#layers). More about this idea of this process implementation you can read [here](https://feature-sliced.design/docs/reference/layers#processes)

# Usage  

### 1. Create instance of the [`ProcessStore`](src/process-store.ts)   

You can create your own implementation or use [ready from package](src/process-store.impl.ts).   

```ts
import { ProcessStoreImpl } from "mobx-process";

const processStore = new ProcessStoreImpl();
```

### 2. Create implementation of the [`Process`](src/process.ts)  

Or you can use [ready from package](src/process.impl.ts).   

```ts
import { Process, ProcessImpl } from "mobx-process";

export class MyProcess extends ProcessImpl implements Process {
  childProcesses = [];

  async start() {
    // do some logic
    await super.start();
  }

  async stop() {
    await super.stop();
  }
}
```

### 3. Load process into store   

```ts
await processStore.load(MyProcess)
```