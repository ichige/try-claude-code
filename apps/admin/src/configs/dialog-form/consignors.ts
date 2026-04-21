import { z } from 'zod'

export const schema = z.object({
  companyName: z.string().min(1, '会社名は必須です'),
  companyCode: z.string().default(''),
  invoiceNumber: z.string().default(''),
  paymentRate: z.coerce.number({ error: '数値を入力してください' }),
  postalCode: z.string().default(''),
  prefecture: z.string().default(''),
  cityStreet: z.string().default(''),
  building: z.string().default(''),
  phone: z.string().default(''),
  email: z.string().default(''),
  website: z.string().default(''),
  notes: z.string().default(''),
})

export const initialForm: Record<string, string | number> = {
  companyName: '',
  companyCode: '',
  invoiceNumber: '',
  paymentRate: 85,
  postalCode: '',
  prefecture: '',
  cityStreet: '',
  building: '',
  phone: '',
  email: '',
  website: '',
  notes: '',
}
