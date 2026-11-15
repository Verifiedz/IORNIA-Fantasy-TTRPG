import { z } from "zod";

export const essosAffinitiesSchema = z.object({
  cultivation: z.number().int().min(0),
  magic: z.number().int().min(0),
  invocation: z.number().int().min(0),
  awakened: z.number().int().min(0),
  modulation: z.number().int().min(0),
  transmission: z.number().int().min(0),
});

export const profileSchema = z.object({
  schema: z.literal(1),
  name: z.string().min(1),
  title: z.string().optional(),
  player: z.string().optional(),
  portrait: z.string().optional(),
  essosAffinities: essosAffinitiesSchema,
  inventoryNotes: z.string().optional(),
});

export type EssosAffinities = z.infer<typeof essosAffinitiesSchema>;
export type Profile = z.infer<typeof profileSchema>;
