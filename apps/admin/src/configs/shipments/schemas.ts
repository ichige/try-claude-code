import { z } from 'zod'
import { i18n } from 'src/boot/i18n'

const { t } = i18n.global

export const step1Schema = z.object({
  consignorId:        z.string().min(1, t('validation.required', { field: t('shipments.fields.consignorId') })),
  deliveryDate:       z.string().min(1, t('validation.required', { field: t('shipments.fields.deliveryDate') })),
  origin:             z.string().min(1, t('validation.required', { field: t('shipments.fields.origin') })).max(80),
  originAddress:      z.string().max(256).default(''),
  destination:        z.string().min(1, t('validation.required', { field: t('shipments.fields.destination') })).max(80),
  destinationAddress: z.string().max(256).default(''),
})

export const step2Schema = z.object({
  carrierId: z.string().min(1, t('validation.required', { field: t('shipments.fields.carrierId') })),
})
