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

autoUpdater.initAutoUpdater(mainWindow);
autoUpdater.checkForUpdates();

// to start donwloading the update
autoUpdater.startDownloadUpdate();

// to restart the electron app and install the new version
autoUpdater.quitAndInstall();
```

In the renderer file:

```ts
import autoUpdater from "@el3um4s/renderer-for-electron-auto-updater";

let version: string;

autoUpdater.requestVersionNumber({
  apiKey: "my-api-key",
  callback: (data) => {
    version = data.version;
  },
});

autoUpdater.checkForUpdates({
  apiKey: "my-api-key",
  callback: (data) => {
    const { version, releaseName, releaseDate } = data;
    console.log("Update available", version, releaseName, releaseDate);
    autoUpdater.startDownloadUpdate({ apiKey: "my-api-key" });
  },
});

autoUpdater.on.downloadProgress({
  callback: (data) => {
    const { total, delta, transferred, percent, bytesPerSecond } = data;
    console.log(
      "Download progress",
      total,
      delta,
      transferred,
      percent,
      bytesPerSecond
    );
  },
});

autoUpdater.on.updateDownloaded({
  callback: (data) => {
    const { version, releaseName, releaseDate } = data;
    console.log("Update downloaded", version, releaseName, releaseDate);
    autoUpdater.quitAndInstall();
  },
});
```

In the renderer you can use:

```ts
let version: string;

globalThis.api.autoUpdater.send("requestVersionNumber", null);
globalThis.api.systemInfo.receive("getVersionNumber", (data) => {
  version = data.version;
});
```

### API: Electron Side

- `requestVersionNumber` - Request the version number. The response is sent to the `getVersionNumber` channel
- `checkForUpdates` - Check if an update is available. The response is sent to the `updateAvailable` channel (or via the `updateNotAvailable` channel if no update is available)
- `startDownloadUpdate` - Request to start downloading the update. The response is sent to the `downloadProgress` channel
- `quitAndInstall` - Request to quit and install the update. The response is sent to the `updateDownloaded` channel

If an error occurs, the response is sent to the `errorOnAutoUpdate` channel.

### API: Renderer Side - Request

`requestVersionNumber = async (options: { callback?: (arg0: VersionNumber) => void; apiKey?: string; }): Promise<VersionNumber>`

example:

```ts
import autoUpdater from "@el3um4s/renderer-for-electron-auto-updater";

let version: string;

autoUpdater.requestVersionNumber({
  apiKey: "my-api-key",
  callback: (data) => {
    version = data.version;
  },
});
```

`checkForUpdates = async (options: { callback?: (arg0: UpdateInfo) => void; apiKey?: string; }): Promise<UpdateInfo>`

example:

```ts
import autoUpdater from "@el3um4s/renderer-for-electron-auto-updater";

autoUpdater.checkForUpdates({
  callback: (data) => {
    const { version, releaseName, releaseDate } = data;
    console.log("Update available", version, releaseName, releaseDate);
    autoUpdater.startDownloadUpdate({ apiKey: "my-api-key" });
  },
});
```

`startDownloadUpdate = async (options: { apiKey?: string; }): Promise<void>`

example:

```ts
import autoUpdater from "@el3um4s/renderer-for-electron-auto-updater";

autoUpdater.startDownloadUpdate();
```

`quitAndInstall = async (options: { apiKey?: string }): Promise<void>`

example:

```ts
import autoUpdater from "@el3um4s/renderer-for-electron-auto-updater";

autoUpdater.on.updateDownloaded({
  callback: (data) => {
    const { version, releaseName, releaseDate } = data;
    console.log("Update downloaded", version, releaseName, releaseDate);
    autoUpdater.quitAndInstall();
  },
});
```

### API: Renderer Side - Response

`on.getVersionNumber = async (options: { callback?: (arg0: VersionNumber) => void; apiKey?: string; }): Promise<VersionNumber>`

example:

```ts
import autoUpdater from "@el3um4s/renderer-for-electron-auto-updater";

let version: string;

autoUpdater.requestVersionNumber();

autoUpdater.on.getVersionNumber({
  callback: (data) => {
    version = data.version;
    console.log("Version number", version);
  },
});
```

`on.errorOnAutoUpdate = async (options: { callback?: (arg0: Error) => void; apiKey?: string; }): Promise<Error>`

example:

```ts
import autoUpdater from "@el3um4s/renderer-for-electron-auto-updater";

autoUpdater.checkForUpdates();

systemInfo.on.errorOnAutoUpdate({
  callback: (data) => {
    console.log("Error on auto update");
    console.log(data);
  },
});
```

`on.updateAvailable = async (options: { callback?: (arg0: UpdateInfo) => void; apiKey?: string; }): Promise<UpdateInfo>`

example:

```ts
import autoUpdater from "@el3um4s/renderer-for-electron-auto-updater";

autoUpdater.checkForUpdates();

systemInfo.on.updateAvailable({
  callback: (data) => {
    const { version, releaseName, releaseDate } = data;
    console.log("Update available", version, releaseName, releaseDate);
    autoUpdater.startDownloadUpdate();
  },
});
```

`on.updateNotAvailable = async (options: { callback?: (arg0: UpdateInfo) => void; apiKey?: string; }): Promise<UpdateInfo>`

example:

```ts
import autoUpdater from "@el3um4s/renderer-for-electron-auto-updater";

autoUpdater.checkForUpdates();

systemInfo.on.updateNotAvailable({
  callback: (data) => {
    console.log("Update not available", data);
  },
});
```

`on.downloadProgress = async (options: { callback?: (arg0: ProgressInfo) => void; apiKey?: string; }): Promise<ProgressInfo>`

example:

```ts
import autoUpdater from "@el3um4s/renderer-for-electron-auto-updater";

autoUpdater.checkForUpdates();

autoUpdater.on.downloadProgress({
  callback: (data) => {
    const { total, delta, transferred, percent, bytesPerSecond } = data;
    console.log(
      "Download progress",
      total,
      delta,
      transferred,
      percent,
      bytesPerSecond
    );
  },
});
```

`on.updateDownloaded = async (options: { callback?: (arg0: UpdateDownloadedEvent) => void; apiKey?: string; }): Promise<UpdateDownloadedEvent>`

example:

```ts
import autoUpdater from "@el3um4s/renderer-for-electron-auto-updater";

autoUpdater.checkForUpdates();

autoUpdater.on.updateDownloaded({
  callback: (data) => {
    const { version, releaseName, releaseDate } = data;
    console.log("Update downloaded", version, releaseName, releaseDate);
    autoUpdater.quitAndInstall();
  },
});
```

### Types

**VersionNumber**

```ts
interface VersionNumber {
  version: string;
}
```

**UpdateInfo**

```ts
interface UpdateInfo {
  version: string;
  releaseName: string | undefined;
  releaseDate: string;
}
```

**UpdateDownloadedEvent**

```ts
interface UpdateDownloadedEvent extends UpdateInfo {
  downloadedFile: string;
}
```

**ProgressInfo**

```ts
interface ProgressInfo {
  total: number;
  delta: number;
  transferred: number;
  percent: number;
  bytesPerSecond: number;
}
```

**DefaultApiKey**

```ts
type DefaultApiKey = "ipc";
```
