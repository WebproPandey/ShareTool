// shareRoutes.js
import express from "express";
import { handleFileMeta } from "../controllers/shareController.js";

const router = express.Router();

router.post("/metadata", handleFileMeta);

export default router;
