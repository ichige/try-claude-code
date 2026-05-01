import { z } from 'zod'

/**
 * 運賃の範囲スキーマ
 */
export const tariffRangeSchema = z.object({
  minKm: z.number().int().min(1),
  maxKm: z.number().int().min(1),
  baseFare: z.number().int().min(0),
  unitKm: z.number().int().min(1),
  unitFare: z.number().int().min(0),
})

/**
 * 運賃表のスキーマ
 */
export const tariffDraftSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1).max(32),
  notes: z.string(),
  enabled: z.boolean(),
  isActive: z.boolean(),
  ranges: z.array(tariffRangeSchema).min(1).superRefine((ranges, ctx) => {
    for (let i = 1; i < ranges.length; i++) {
      if (ranges[i]!.maxKm <= ranges[i - 1]!.maxKm) {
        ctx.addIssue({
          code: "custom",
          path: [i, 'maxKm'],
          message: `ranges[${i}].maxKm must be greater than ranges[${i - 1}].maxKm`,
        })
      }
    }
  }),
})
