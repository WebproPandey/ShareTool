// logService.js
import fs from "fs-extra";
import path from "path";
import { formatBytes } from "../utils/helpers.js";

const logPath = path.resolve("logs/share-log.json");

export async function saveLog(data) {
  const exists = await fs.pathExists(logPath);
  let logs = [];

  if (exists) {
    logs = await fs.readJSON(logPath);
  }

  logs.push({
    ...data,
    fileSizeReadable: formatBytes(data.fileSize),
    timestamp: new Date().toISOString()
  });

  await fs.outputJSON(logPath, logs, { spaces: 2 });
}
