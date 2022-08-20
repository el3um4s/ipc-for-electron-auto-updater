# IPC for Electron: Auto Updater (NOT YET TESTED)

Allow the renderer to update electron apps via [electron-updater](https://www.npmjs.com/package/electron-updater)

NPM link: [@el3um4s/ipc-for-electron-auto-updater](https://www.npmjs.com/package/@el3um4s/ipc-for-electron-auto-updater)

Use [@el3um4s/ipc-for-electron](https://www.npmjs.com/package/@el3um4s/ipc-for-electron) and [@el3um4s/renderer-for-electron-auto-updater](https://www.npmjs.com/package/@el3um4s/renderer-for-electron-auto-updater) to allow communication between Electron and a web page

### Install and use the package

To use the package in a project:

```bash
npm i @el3um4s/ipc-for-electron @el3um4s/ipc-for-electron-auto-updater @el3um4s/renderer-for-electron-auto-updater
```

Then the `preload.ts` file:

```ts
import { generateContextBridge } from "@el3um4s/ipc-for-electron";
import autoUpdater from "@el3um4s/ipc-for-electron-auto-updater";

const listAPI = [autoUpdater];

generateContextBridge(listAPI);
```

In main electron file (`index.ts`):

```ts
import autoUpdater from "@el3um4s/ipc-for-electron-auto-updater";

updaterInfo.initAutoUpdater(mainWindow);
updaterInfo.checkForUpdate();

// to start donwloading the update
updaterInfo.startDownloadUpdate();

// to restart the electron app and install the new version
updaterInfo.quitAndInstall();
```

In the renderer file:

```ts
import autoUpdater from "@el3um4s/renderer-for-electron-auto-updater";

systemInfo.requestIsWindows({
  callback: (data) => {
    isWindows = data.isWindows;
  },
});

let app: string = "-";
let chrome: string = "-";
let node: string = "-";
let electron: string = "-";

systemInfo.requestSystemInfo({
  callback: (data) => {
    chrome = data.chrome;
    node = data.node;
    electron = data.electron;
    app = data.app;
  },
});
```

In the renderer you can use:

```ts
let isWindows = false;

globalThis.api.systemInfo.send("requestIsWindows", null);
globalThis.api.systemInfo.receive("getIsWindows", (data) => {
  isWindows = data.isWindows;
});

let chrome: string = "-";
let node: string = "-";
let electron: string = "-";
let app: string = "-";

globalThis.api.systemInfo.send("requestSystemInfo", null);
globalThis.api.systemInfo.receive("getSystemInfo", (data) => {
  chrome = data.chrome;
  node = data.node;
  electron = data.electron;
  app = data.app;
});
```

### API: Electron Side

- `requestSystemInfo` - Request the version of Electron, Chrome and NodeJS. The response is sent to the `getSystemInfo` channel
- `requestIsWindows` - Request if the OS is Windows. The response is sent to the `getIsWindows` channel

### API: Renderer Side - Request

`requestSystemInfo = async (options: { callback?: (arg0: SystemInfo) => void; apiKey?: string; }): Promise<SystemInfo>`

example:

```ts
import systemInfo from "@el3um4s/renderer-for-electron-system-info";

let app: string = "-";
let chrome: string = "-";
let node: string = "-";
let electron: string = "-";

systemInfo.requestSystemInfo({
  apiKey: "ipc",
  callback: (data) => {
    console.log("DATA OK", data);
    chrome = data.chrome;
    node = data.node;
    electron = data.electron;
    app = data.app;
  },
});
```

`requestIsWindows = async (options: { callback?: (arg0: IsWindows) => void; apiKey?: string; }): Promise<IsWindows>`

example:

```ts
import systemInfo from "@el3um4s/renderer-for-electron-system-info";

let isWindows = false;

systemInfo.requestIsWindows({
  apiKey: "ipc",
  callback: (data) => {
    console.log("DATA OK", data);
    isWindows = data.isWindows;
  },
});
```

### API: Renderer Side - Response

`on.getSystemInfo = async (options: { callback?: (arg0: SystemInfo) => void; apiKey?: string; }): Promise<SystemInfo>`

example:

```ts
import systemInfo from "@el3um4s/renderer-for-electron-system-info";

let app: string = "-";
let chrome: string = "-";
let node: string = "-";
let electron: string = "-";
systemInfo.requestSystemInfo();

systemInfo.on.getSystemInfo({
  apiKey: "ipc",
  callback: (data) => {
    console.log("DATA OK", data);
    chrome = data.chrome;
    node = data.node;
    electron = data.electron;
    app = data.app;
  },
});
```

`on.getIsWindows = async (options: { callback?: (arg0: IsWindows) => void; apiKey?: string; }): Promise<IsWindows>`

example:

```ts
import systemInfo from "@el3um4s/renderer-for-electron-system-info";

let isWindows = false;

systemInfo.requestIsWindows();

systemInfo.on.getIsWindows({
  apiKey: "ipc",
  callback: (data) => {
    console.log("DATA OK", data);
    isWindows = data.isWindows;
  },
});
```

### Types

**SystemInfo**

```ts
interface SystemInfo {
  chrome: string;
  node: string;
  electron: string;
  app: string;
}
```

**IsWindows**

```ts
interface IsWindows {
  isWindows: boolean;
}
```

**DefaultApiKey**

```ts
type DefaultApiKey = "ipc";
```
