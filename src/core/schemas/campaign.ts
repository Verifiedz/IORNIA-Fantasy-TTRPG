import { z } from "zod";

export const campaignSchema = z.object({
  schema: z.literal(1),
  name: z.string().min(1),
  tagline: z.string().optional(),
});

export type Campaign = z.infer<typeof campaignSchema>;
