<template>
  <q-dialog v-model="dialogFormStore.isOpen" persistent>
    <q-card style="min-width: 720px">

      <q-card-section class="bg-primary text-white">
        <div class="row items-center no-wrap">
          <q-avatar icon="sym_o_domain_add" class="q-mr-sm" rounded color="white" text-color="primary" size="md" />
          <div class="text-h6">会社情報登録</div>
        </div>
      </q-card-section>

      <q-card-section>
        <q-form @submit="onSubmit">
          <!-- 基本情報 -->
          <div class="row items-center q-mb-md">
            <q-icon name="sym_o_domain" size="xs" class="q-mr-xs" color="primary" />
            <div class="text-caption q-mr-xs text-primary">基本情報</div>
            <div class="col bg-grey-5" style="height: 1px;"></div>
          </div>

          <div class="row q-col-gutter-md">
            <div class="col-6">
              <q-input v-model="form.companyName" label="会社名" outlined dense :rules="[rules.companyName]">
                <template v-slot:prepend>
                  <q-icon name="sym_o_domain" size="xs" />
                </template>
              </q-input>
            </div>
            <div class="col-6">
              <q-input v-model="form.companyCode" label="管理コード" outlined dense>
                <template v-slot:prepend>
                  <q-icon name="sym_o_settings_ethernet" size="xs" />
                </template>
              </q-input>
            </div>
            <div class="col-6">
              <q-input v-model="form.invoiceNumber" label="インボイス番号" outlined dense>
                <template v-slot:prepend>
                  <q-icon name="sym_o_tag" size="xs" />
                </template>
              </q-input>
            </div>
            <div class="col-6">
              <q-input v-model="form.paymentRate" label="支払比率" type="number" input-class="text-right" outlined dense :rules="[rules.paymentRate]">
                <template v-slot:prepend>
                  <q-icon name="sym_o_percent" size="xs" />
                </template>
              </q-input>
            </div>
          </div>

          <!-- 所在 -->
          <div class="row items-center q-my-md">
            <q-icon name="sym_o_location_on" size="xs" class="q-mr-xs" color="primary" />
            <div class="text-caption q-mr-xs text-primary">所在地</div>
            <div class="col bg-grey-5" style="height: 1px;"></div>
          </div>

          <div class="row q-col-gutter-md">
            <div class="col-6">
              <q-input v-model="form.postalCode" label="郵便番号" outlined dense>
                <template v-slot:prepend>
                  <q-icon name="sym_o_local_post_office" size="xs" />
                </template>
              </q-input>
            </div>
            <div class="col-6">
              <q-input v-model="form.prefecture" label="都道府県" outlined dense>
                <template v-slot:prepend>
                  <q-icon name="sym_o_map" size="xs" />
                </template>
              </q-input>
            </div>
            <div class="col-12">
              <q-input v-model="form.cityStreet" label="市区町村・番地" outlined dense>
                <template v-slot:prepend>
                  <q-icon name="sym_o_location_home" size="xs" />
                </template>
              </q-input>
            </div>
            <div class="col-6">
              <q-input v-model="form.building" label="建物名・部屋番号" outlined dense>
                <template v-slot:prepend>
                  <q-icon name="sym_o_apartment" size="xs" />
                </template>
              </q-input>
            </div>
          </div>

          <!-- 連絡先 -->
          <div class="row items-center q-my-md">
            <q-icon name="sym_o_id_card" size="xs" class="q-mr-xs" color="primary" />
            <div class="text-caption q-mr-xs text-primary">連絡先</div>
            <div class="col bg-grey-5" style="height: 1px;"></div>
          </div>

          <div class="row q-col-gutter-md">
            <div class="col-6">
              <q-input v-model="form.phone" label="電話番号" outlined dense>
                <template v-slot:prepend>
                  <q-icon name="sym_o_phone" size="xs" />
                </template>
              </q-input>
            </div>
            <div class="col-6">
              <q-input v-model="form.email" label="メールアドレス" outlined dense>
                <template v-slot:prepend>
                  <q-icon name="sym_o_email" size="xs" />
                </template>
              </q-input>
            </div>
            <div class="col-12">
              <q-input v-model="form.website" label="Webサイト" outlined dense>
                <template v-slot:prepend>
                  <q-icon name="sym_o_language" size="xs" />
                </template>
              </q-input>
            </div>
          </div>

          <!-- その他 -->
          <div class="row items-center q-my-md">
            <q-icon name="sym_o_notes" size="xs" class="q-mr-xs" color="primary" />
            <div class="text-caption q-mr-xs text-primary">その他</div>
            <div class="col bg-grey-5" style="height: 1px;"></div>
          </div>

          <div class="row q-col-gutter-md">
            <div class="col-12">
              <q-input v-model="form.notes" label="備考" type="textarea" outlined dense rows="3" />
            </div>
          </div>
          <q-separator class="q-mt-md" />
          <q-card-actions align="right" class="q-mt-md">
            <q-btn label="キャンセル" color="grey" size="md" dense unelevated v-close-popup />
            <q-btn type="submit" label="登録" color="positive" size="md" unelevated dense/>
          </q-card-actions>

        </q-form>
      </q-card-section>

    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { z } from 'zod'
import { useDialogFormStore } from 'stores/dialog-form'
import { useMastersStore } from 'stores/masters'

const dialogFormStore = useDialogFormStore()
const mastersStore = useMastersStore()

const consignorSchema = z.object({
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

function zodRule(schema: z.ZodType) {
  return (v: unknown) => {
    const result = schema.safeParse(v)
    return result.success || result.error.issues[0]?.message || true
  }
}

const rules = {
  companyName: zodRule(consignorSchema.shape.companyName),
  paymentRate: zodRule(consignorSchema.shape.paymentRate),
}

const form = reactive({
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
})

async function onSubmit(): Promise<void> {
  const parsed = consignorSchema.safeParse(form)
  if (!parsed.success) return
  await mastersStore.create('Consignors', parsed.data)
  dialogFormStore.close()
}
</script>
