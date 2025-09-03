import express from "express";
import cors from "cors";
import helmet from "helmet";
import swaggerUi from "swagger-ui-express";
import pinoHttp from "pino-http";
import { v4 as uuidv4 } from "uuid";

import { swaggerSpec } from "./docs/swagger.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import authRoutes from "./modules/auth/auth.routes.js";
import workspaceRoutes from "./modules/workspaces/workspace.routes.js";
import projectRoutes from "./modules/projects/project.routes.js";
import taskRoutes from "./modules/tasks/task.routes.js";
import commentRoutes from "./modules/comments/comment.routes.js";

import { logger } from "./config/logger.js";
import { corsOptions } from "./config/cors.js";
import { apiLimiter } from "./middlewares/rateLimiter.js";

export function createApp() {
  const app = express();

  app.use(helmet());
  app.use(cors(corsOptions));
  app.use(express.json({ limit: "1mb" }));

  app.use(
    pinoHttp({
      logger,
      genReqId: (req, res) => (req.headers["x-request-id"] as string) || uuidv4(),
    })
  );

  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  app.get("/health", (_req, res) => res.json({ ok: true }));

  app.use(apiLimiter);

  app.use("/api/auth", authRoutes);
  app.use("/api/workspaces", workspaceRoutes);
  app.use("/api/projects", projectRoutes);
  app.use("/api/tasks", taskRoutes);
  app.use("/api", commentRoutes);

  app.use(errorHandler);
  return app;
}
