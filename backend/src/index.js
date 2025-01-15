import express from "express";
import dotenv from "dotenv";
import { clerkMiddleware } from "@clerk/express";
import userRoutes from "./routes/user.route.js";
import authRoutes from "./routes/auth.route.js";
import adminRoutes from "./routes/admin.route.js";
import albumRoutes from "./routes/album.route.js";
import statRoutes from "./routes/stat.route.js";
import songRoutes from "./routes/song.route.js";
import { connectDB } from "./lib/db.js";
import fileUpload from "express-fileupload";
import path from "path";
import cors from "cors";
import { createServer } from "http";
import { initSocket } from "./lib/socket.js";
import cron from "node-cron";
import fs from "fs";

dotenv.config();

const app = express();
const __dirname = path.resolve();

const httpServer = createServer(app);

initSocket(httpServer);

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(clerkMiddleware()); //add auth to req object (req.auth.userId)
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: path.join(__dirname, "temp"),
    createParentPath: true,
    limits: {
      fileSize: 10 * 1024 * 1024, //10MB file size
    },
  })
);

const tempDir = path.join(process.cwd(), "temp");

cron.schedule("0 * * * *", () => {
  if (fs.existsSync(tempDir)) {
    fs.readdir;
    tempDir,
      (err, files) => {
        if (err) return console.log("error", err);

        for (const file of files)
          fs.unlink(path.join(tempDir, file), (err) => {});
      };
  }
});

app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/songs", songRoutes);
app.use("/api/albums", albumRoutes);
app.use("/api/stats", statRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../frontend/dist/index.html"));
  });
}
app.use((err, _, res) => {
  res.status(500).json({
    message:
      process.env.NODE_ENV === "production"
        ? "Internal Server Error"
        : err.message,
  });
});

const PORT = process.env.PORT;
httpServer.listen(PORT, () => {
  connectDB();
  console.log("Server is listening on port:", PORT);
});
