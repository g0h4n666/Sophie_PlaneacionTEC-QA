import { z } from 'zod';

export const scenarioSchema = z.object({
  name: z.string().min(3, 'Mínimo 3 caracteres').max(120, 'Máximo 120 caracteres'),
  description: z.string().max(280, 'Máximo 280 caracteres').optional(),
  markAsBaseline: z.boolean().optional()
});

export type ScenarioFormValues = z.infer<typeof scenarioSchema>;
