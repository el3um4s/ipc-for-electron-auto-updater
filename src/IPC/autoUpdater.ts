/* eslint-disable @typescript-eslint/no-unused-vars */
import { IPC, SendChannels } from "@el3um4s/ipc-for-electron";
import { BrowserWindow, app } from "electron";
import {
  autoUpdater as AU,
  UpdateInfo,
  ProgressInfo,
  UpdateDownloadedEvent,
} from "electron-updater";

import { NameAPI } from "./interfaces";

const nameAPI: NameAPI = "autoUpdater";

// to Main
const validSendChannel: SendChannels = {
  requestVersionNumber: requestVersionNumber,
  checkForUpdates: checkForUpdates,
  startDownloadUpdate: startDownloadUpdate,
  quitAndInstall: quitAndInstall,
};

// from Main
const validReceiveChannel: string[] = [
  "getVersionNumber",
  "checkingForUpdate",
  "updateAvailable",
  "updateNotAvailable",
  "downloadProgress",
  "updateDownloaded",
  "errorOnAutoUpdate",
  "autoUpdateAvailable",
  "autoUpdateDownloaded",
];

class UpdaterInfo extends IPC {
  initAutoUpdater(mainWindow: BrowserWindow) {
    initAutoUpdater(mainWindow);
  }
  requestVersionNumber(mainWindow: BrowserWindow) {
    requestVersionNumber(mainWindow);
  }
  checkForUpdates() {
    checkForUpdates();
  }
  startDownloadUpdate() {
    startDownloadUpdate();
  }
  quitAndInstall() {
    quitAndInstall();
  }
}

const autoUpdater = new UpdaterInfo({
  nameAPI,
  validSendChannel,
  validReceiveChannel,
});

export default autoUpdater;

// Enter here the functions for ElectronJS

function initAutoUpdater(mainWindow: BrowserWindow) {
  AU.on("checking-for-update", () => {
    mainWindow.webContents.send("checkingForUpdate", null);
  });

  AU.on("error", (err) => {
    mainWindow.webContents.send("errorOnAutoUpdate", err);
  });

  AU.on("update-available", (info: UpdateInfo) => {
    mainWindow.webContents.send("updateAvailable", info);
  });

  AU.on("update-not-available", (info: UpdateInfo) => {
    mainWindow.webContents.send("updateNotAvailable", info);
  });

  AU.on("download-progress", (info: ProgressInfo) => {
    mainWindow.webContents.send("downloadProgress", info);
  });

  AU.on("update-downloaded", (info: UpdateDownloadedEvent) => {
    mainWindow.webContents.send("updateDownloaded", info);
  });
}

function requestVersionNumber(
  mainWindow: BrowserWindow,
  event?: Electron.IpcMainEvent,
  message?: unknown
) {
  const version = app.getVersion();
  const result = { version };
  mainWindow.webContents.send("getVersionNumber", result);
}

function checkForUpdates(
  mainWindow?: BrowserWindow,
  event?: Electron.IpcMainEvent,
  message?: unknown
) {
  AU.autoDownload = false;
  AU.checkForUpdates();
}

function startDownloadUpdate(
  mainWindow?: BrowserWindow,
  event?: Electron.IpcMainEvent,
  message?: unknown
) {
  AU.downloadUpdate();
}

function quitAndInstall(
  mainWindow?: BrowserWindow,
  event?: Electron.IpcMainEvent,
  message?: unknown
) {
  AU.quitAndInstall();
}
