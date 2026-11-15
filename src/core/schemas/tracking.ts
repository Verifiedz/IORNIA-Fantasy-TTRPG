import { z } from "zod";

export const metaCurrenciesSchema = z.object({
  plotPoints: z.number().int().min(0).default(0),
  flashbackPoints: z.number().int().min(0).default(0),
  dharma: z.number().int().min(0).default(0),
  karma: z.number().int().min(0).default(0),
  wildcardPoints: z.number().int().min(0).default(0),
});

export const effectSchema = z.object({
  name: z.string().min(1),
  note: z.string().optional(),
  turnsLeft: z.number().int().min(0).optional(),
});

export const exceedSchema = z.object({
  used: z.union([z.literal(0), z.literal(1), z.literal(2), z.literal(3)]),
});

export const trackingSchema = z.object({
  schema: z.literal(1),
  essos: z.number().int().min(0).max(100),
  reserve: z.number().int().min(0).max(100),
  hp: z.number().int(),
  fp: z.number().int(),
  exceed: exceedSchema,
  // Plot Points cap at one spend per encounter (CLAUDE.md's meta-currency
  // rules). Reset by `newEncounter` alongside the Exceed slots, since both
  // are per-encounter limits.
  plotPointSpentThisEncounter: z.boolean().default(false),
  metaCurrencies: metaCurrenciesSchema,
  effects: z.array(effectSchema).default([]),
});

export type MetaCurrencies = z.infer<typeof metaCurrenciesSchema>;
export type Effect = z.infer<typeof effectSchema>;
export type Exceed = z.infer<typeof exceedSchema>;
export type TrackingState = z.infer<typeof trackingSchema>;
