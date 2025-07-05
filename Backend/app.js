import express from "express";
import cors from "cors";
import shareRoutes from "./routes/shareRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());


app.use("/api/share", shareRoutes);

app.get("/", (req, res) => {
  res.send("✅ File Share Backend is Running (Module Type)");
});

export default app;
