import cors from "cors";
import { env } from "./env.js";

const parsed = env.CORS_ORIGIN === "*" ? "*" : env.CORS_ORIGIN.split(",").map(s => s.trim()).filter(Boolean);

export const corsOptions: cors.CorsOptions =
  parsed === "*"
    ? { origin: true, credentials: true }
    : {
        origin: (origin, cb) => {
          if (!origin) return cb(null, true);
          if (parsed.includes(origin)) return cb(null, true);
          return cb(new Error("Not allowed by CORS"));
        },
        credentials: true,
      };
