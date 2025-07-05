// shareController.js
import { saveLog } from "../service/logService.js";

export async function handleFileMeta(req, res) {
  const { fileName, fileSize, sender, receiver } = req.body;

  try {
    // Save metadata (optional)
    await saveLog({ fileName, fileSize, sender, receiver });
    res.status(200).json({ success: true, message: "Metadata received" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error saving metadata" });
  }
}
