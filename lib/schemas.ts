import { z } from "zod";
export const inquirySchema = z.object({
  full_name: z.string().trim().min(2).max(120), email: z.email().max(254).transform(v => v.toLowerCase()),
  phone: z.string().trim().min(7).max(30), project_type: z.enum(["residential","commercial","renovation","management","other"]),
  project_location: z.string().trim().min(2).max(160), budget_range: z.enum(["","under_1m","1m_5m","5m_20m","over_20m","unsure"]).optional().default(""),
  desired_start_date: z.union([z.literal(""), z.string().regex(/^\d{4}-\d{2}-\d{2}$/)]).nullable().optional(),
  description: z.string().trim().min(20).max(5000), privacy_acknowledged: z.union([z.literal(true),z.literal("true"),z.literal("on")]),
  website: z.string().max(200).optional().default(""), idempotency_key: z.string().uuid()
});
const itemSchema = z.object({ category:z.enum(["Materials","Labor","Equipment","Other"]), description:z.string().trim().min(2).max(500), quantity:z.string().regex(/^\d{1,7}(\.\d{1,3})?$/), unit:z.string().trim().min(1).max(40), unit_price:z.string().regex(/^\d{1,12}(\.\d{1,2})?$/) });
export const quotationSchema = z.object({
  id:z.string().uuid().nullable().optional(), quotation_number:z.string().max(40).optional().nullable(), inquiry_id:z.string().uuid().nullable().optional(), client_id:z.string().uuid(), project_id:z.string().uuid().nullable().optional(),
  valid_until:z.union([z.literal(""),z.string().regex(/^\d{4}-\d{2}-\d{2}$/)]).nullable().optional(), scope_of_work:z.string().trim().min(10).max(6000), terms:z.string().max(8000).default(""), notes_visible_to_client:z.string().max(4000).default(""),
  discount_amount:z.string().regex(/^\d{1,12}(\.\d{1,2})?$/).default("0"), tax_label:z.string().max(120).optional().default(""), tax_rate_percent:z.string().regex(/^(\d{1,3})(\.\d{1,2})?$/).optional().default("0"), items:z.array(itemSchema).min(1).max(100)
});
export type InquiryInput = z.infer<typeof inquirySchema>;
export type QuotationInput = z.infer<typeof quotationSchema>;
