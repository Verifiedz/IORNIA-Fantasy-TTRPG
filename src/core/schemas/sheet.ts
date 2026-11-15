import { z } from "zod";

export const attributesSchema = z.object({
  st: z.number(),
  dx: z.number(),
  iq: z.number(),
  ht: z.number(),
});

export const secondaryCharacteristicsSchema = z.object({
  will: z.number(),
  perception: z.number(),
  basicSpeed: z.number(),
  basicMove: z.number(),
  dodge: z.number(),
});

export const traitSchema = z.object({
  name: z.string().min(1),
  points: z.number().optional(),
  note: z.string().optional(),
});

export const skillSchema = z.object({
  name: z.string().min(1),
  level: z.number(),
  points: z.number().optional(),
});

export const weaponSchema = z.object({
  name: z.string().min(1),
  damage: z.string().min(1),
  reach: z.string().optional(),
  parry: z.string().optional(),
  skillLevel: z.number().optional(),
  note: z.string().optional(),
});

export const equipmentItemSchema = z.object({
  name: z.string().min(1),
  quantity: z.number().int().positive().default(1),
  note: z.string().optional(),
});

export const pointTotalsSchema = z.object({
  total: z.number(),
  attributes: z.number().optional(),
  advantages: z.number().optional(),
  disadvantages: z.number().optional(),
  skills: z.number().optional(),
});

export const sheetSchema = z.object({
  schema: z.literal(1),
  attributes: attributesSchema,
  secondaryCharacteristics: secondaryCharacteristicsSchema,
  hp: z.object({ max: z.number() }),
  fp: z.object({ max: z.number() }),
  traits: z.array(traitSchema).default([]),
  skills: z.array(skillSchema).default([]),
  weapons: z.array(weaponSchema).default([]),
  equipment: z.array(equipmentItemSchema).default([]),
  pointTotals: pointTotalsSchema,
});

export type Attributes = z.infer<typeof attributesSchema>;
export type SecondaryCharacteristics = z.infer<
  typeof secondaryCharacteristicsSchema
>;
export type Trait = z.infer<typeof traitSchema>;
export type Skill = z.infer<typeof skillSchema>;
export type Weapon = z.infer<typeof weaponSchema>;
export type EquipmentItem = z.infer<typeof equipmentItemSchema>;
export type PointTotals = z.infer<typeof pointTotalsSchema>;
export type Sheet = z.infer<typeof sheetSchema>;
