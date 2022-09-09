import { NameAPI, DefaultApiKey } from "./interfaces";

const nameAPI: NameAPI = "autoUpdater";
const defaultApiKey: DefaultApiKey = "ipc";

interface VersionNumber {
  version: string;
}

interface UpdateInfo {
  version: string;
  releaseName: string | undefined;
  releaseDate: string;
}

interface ProgressInfo {
  total: number;
  delta: number;
  transferred: number;
  percent: number;
  bytesPerSecond: number;
}

interface UpdateDownloadedEvent extends UpdateInfo {
  downloadedFile: string;
}

const getVersionNumber = async (options?: {
  callback?: (arg0: VersionNumber) => void;
  apiKey?: string;
}): Promise<VersionNumber> => {
  const callback = options?.callback;
  const apiKey = options?.apiKey || defaultApiKey;
  const api = globalThis[apiKey as keyof typeof globalThis][nameAPI];

  return new Promise((resolve) => {
    api.receive("getVersionNumber", (data: VersionNumber) => {
      const { version } = data;
      if (callback) {
        callback({ version });
      }
      resolve({ version });
    });
  });
};

const errorOnAutoUpdate = async (options?: {
  callback?: (arg0: Error) => void;
  apiKey?: string;
}): Promise<Error> => {
  const callback = options?.callback;
  const apiKey = options?.apiKey || defaultApiKey;
  const api = globalThis[apiKey as keyof typeof globalThis][nameAPI];

  return new Promise((resolve) => {
    api.receive("errorOnAutoUpdate", (data: Error) => {
      if (callback) {
        callback(data);
      }
      resolve(data);
    });
  });
};

const checkingForUpdate = async (options?: {
  callback?: () => void;
  apiKey?: string;
}): Promise<void> => {
  const callback = options?.callback;
  const apiKey = options?.apiKey || defaultApiKey;
  const api = globalThis[apiKey as keyof typeof globalThis][nameAPI];

  return new Promise((resolve) => {
    api.receive("checkingForUpdate", () => {
      if (callback) {
        callback();
      }
      resolve();
    });
  });
};

const updateAvailable = async (options?: {
  callback?: (arg0: UpdateInfo) => void;
  apiKey?: string;
}): Promise<UpdateInfo> => {
  const callback = options?.callback;
  const apiKey = options?.apiKey || defaultApiKey;
  const api = globalThis[apiKey as keyof typeof globalThis][nameAPI];

  return new Promise((resolve) => {
    api.receive("updateAvailable", (data: UpdateInfo) => {
      if (callback) {
        callback(data);
      }
      resolve(data);
    });
  });
};

const updateNotAvailable = async (options?: {
  callback?: (arg0: UpdateInfo) => void;
  apiKey?: string;
}): Promise<UpdateInfo> => {
  const callback = options?.callback;
  const apiKey = options?.apiKey || defaultApiKey;
  const api = globalThis[apiKey as keyof typeof globalThis][nameAPI];

  return new Promise((resolve) => {
    api.receive("updateNotAvailable", (data: UpdateInfo) => {
      if (callback) {
        callback(data);
      }
      resolve(data);
    });
  });
};

const downloadProgress = async (options?: {
  callback?: (arg0: ProgressInfo) => void;
  apiKey?: string;
}): Promise<ProgressInfo> => {
  const callback = options?.callback;
  const apiKey = options?.apiKey || defaultApiKey;
  const api = globalThis[apiKey as keyof typeof globalThis][nameAPI];

  return new Promise((resolve) => {
    api.receive("downloadProgress", (data: ProgressInfo) => {
      if (callback) {
        callback(data);
      }
      resolve(data);
    });
  });
};

const updateDownloaded = async (options?: {
  callback?: (arg0: UpdateDownloadedEvent) => void;
  apiKey?: string;
}): Promise<UpdateDownloadedEvent> => {
  const callback = options?.callback;
  const apiKey = options?.apiKey || defaultApiKey;
  const api = globalThis[apiKey as keyof typeof globalThis][nameAPI];

  return new Promise((resolve) => {
    api.receive("updateDownloaded", (data: UpdateDownloadedEvent) => {
      if (callback) {
        callback(data);
      }
      resolve(data);
    });
  });
};

const requestVersionNumber = async (options?: {
  callback?: (arg0: VersionNumber) => void;
  apiKey?: string;
}): Promise<VersionNumber> => {
  const callback = options?.callback;
  const apiKey = options?.apiKey || defaultApiKey;
  const api = globalThis[apiKey as keyof typeof globalThis][nameAPI];

  api.send("requestVersionNumber", null);

  return getVersionNumber({ callback, apiKey });
};

const checkForUpdates = async (options?: {
  callback?: (arg0: UpdateInfo) => void;
  apiKey?: string;
}): Promise<UpdateInfo> => {
  const callback = options?.callback;
  const apiKey = options?.apiKey || defaultApiKey;
  const api = globalThis[apiKey as keyof typeof globalThis][nameAPI];

  api.send("checkForUpdates", null);
  return updateAvailable({ callback, apiKey });
};

const startDownloadUpdate = async (options?: {
  apiKey?: string;
}): Promise<void> => {
  const apiKey = options?.apiKey || defaultApiKey;
  const api = globalThis[apiKey as keyof typeof globalThis][nameAPI];

  api.send("startDownloadUpdate", null);
};

const quitAndInstall = async (options?: { apiKey?: string }): Promise<void> => {
  const apiKey = options?.apiKey || defaultApiKey;
  const api = globalThis[apiKey as keyof typeof globalThis][nameAPI];

  api.send("quitAndInstall", null);
};

const renderer = {
  requestVersionNumber,
  checkForUpdates,
  startDownloadUpdate,
  quitAndInstall,
  on: {
    getVersionNumber,
    checkingForUpdate,
    errorOnAutoUpdate,
    updateAvailable,
    updateNotAvailable,
    downloadProgress,
    updateDownloaded,
  },
};

export default renderer;
