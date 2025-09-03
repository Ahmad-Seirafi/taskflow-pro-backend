import { z } from "zod";

export const createCommentSchema = z.object({
  content: z.string().trim().min(1, "content is required").max(2000),
});

export const listCommentsQuery = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(10),
  order: z.enum(["asc", "desc"]).default("asc"),
});
