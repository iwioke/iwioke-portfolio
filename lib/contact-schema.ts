import {z} from "zod";

const optionalText = (max: number) => z.string().trim().max(max).optional().or(z.literal(""));

export const contactSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email().max(254),
  company: optionalText(120),
  subject: optionalText(140),
  message: z.string().trim().min(20).max(3000),
  consent: z.literal(true),
  website: z.string().max(0).optional().default(""),
  turnstileToken: z.string().trim().max(2048).optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;

export const contactFormSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email().max(254),
  company: z.string().trim().max(120),
  subject: z.string().trim().max(140),
  message: z.string().trim().min(20).max(3000),
  consent: z.boolean().refine((value) => value),
  website: z.string().max(0),
});
export type ContactFormValues = z.infer<typeof contactFormSchema>;
