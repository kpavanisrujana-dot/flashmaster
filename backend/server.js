const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const { connectDB, disconnectDB } = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const flashcardRoutes = require("./routes/flashcardRoutes");
const adminRoutes = require("./routes/adminRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const User = require("./models/User");

dotenv.config();

const ensureDemoUser = async () => {
  const demoEmail = process.env.DEMO_EMAIL || "demo@flashmaster.com";
  const demoPassword = process.env.DEMO_PASSWORD || "demo123";
  const demoName = process.env.DEMO_NAME || "Demo User";
  const demoRole = process.env.DEMO_ROLE || "admin";

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(demoPassword, salt);

  await User.findOneAndUpdate(
    { email: demoEmail },
    {
      name: demoName,
      email: demoEmail,
      password: hashedPassword,
      role: demoRole,
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  console.log(`Demo user ready: ${demoEmail}`);
};

const app = express();
const allowedOrigins = (process.env.CLIENT_URL || "http://localhost:5173,http://localhost:5174")
  .split(",")
  .map((origin) => origin.trim());

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("CORS origin not allowed"));
    },
  })
);
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.status(200).json({ message: "FLASHMASTER API is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/flashcards", flashcardRoutes);
app.use("/api/admin", adminRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = Number(process.env.PORT) || 5000;
let server;

const listenOnPort = (port) =>
  new Promise((resolve, reject) => {
    const httpServer = app.listen(port);
    httpServer.once("listening", () => resolve(httpServer));
    httpServer.once("error", (error) => reject(error));
  });

const startServer = async () => {
  await connectDB();
  await ensureDemoUser();

  const MAX_PORT_ATTEMPTS = 10;
  for (let attempt = 0; attempt < MAX_PORT_ATTEMPTS; attempt += 1) {
    const candidatePort = PORT + attempt;
    try {
      server = await listenOnPort(candidatePort);
      if (candidatePort !== PORT) {
        console.warn(
          `Port ${PORT} is busy, using fallback port ${candidatePort} instead`
        );
      }
      console.log(`Server running on port ${candidatePort}`);
      return;
    } catch (error) {
      if (error.code === "EADDRINUSE" && attempt < MAX_PORT_ATTEMPTS - 1) {
        continue;
      }
      throw error;
    }
  }
};

startServer().catch((error) => {
  console.error("Startup failed:", error.message);
  process.exit(1);
});

const gracefulShutdown = async () => {
  if (!server) {
    process.exit(0);
    return;
  }
  server.close(async () => {
    await disconnectDB();
    process.exit(0);
  });
};

process.on("SIGINT", gracefulShutdown);
process.on("SIGTERM", gracefulShutdown);
