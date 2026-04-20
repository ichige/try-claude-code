<template>
  <q-dialog v-model="dialogFormStore.isOpen">
    <q-card style="min-width: 640px">

      <q-card-section class="bg-primary text-white">
        <div class="text-h6">会社情報登録</div>
      </q-card-section>

      <q-card-section>
        <q-form @submit="onSubmit">

          <!-- 会社名 -->
          <div class="row q-col-gutter-md">
            <div class="col-12">
              <q-input v-model="form.companyName" label="会社名" outlined dense />
            </div>
          </div>

          <!-- 住所 -->
          <div class="row q-col-gutter-md q-mt-sm">
            <div class="col-6">
              <q-input v-model="form.postalCode" label="郵便番号" outlined dense />
            </div>
            <div class="col-6">
              <q-input v-model="form.prefecture" label="都道府県" outlined dense />
            </div>
            <div class="col-6">
              <q-input v-model="form.cityStreet" label="市区町村・番地" outlined dense />
            </div>
            <div class="col-6">
              <q-input v-model="form.building" label="建物名・部屋番号" outlined dense />
            </div>
          </div>

          <!-- 連絡先 -->
          <div class="row q-col-gutter-md q-mt-sm">
            <div class="col-6">
              <q-input v-model="form.phone" label="電話番号" outlined dense />
            </div>
            <div class="col-6">
              <q-input v-model="form.email" label="メールアドレス" outlined dense />
            </div>
            <div class="col-6">
              <q-input v-model="form.website" label="Webサイト" outlined dense />
            </div>
          </div>

          <!-- 備考 -->
          <div class="row q-col-gutter-md q-mt-sm">
            <div class="col-12">
              <q-input v-model="form.notes" label="備考" type="textarea" outlined dense rows="3" />
            </div>
          </div>

          <q-card-actions align="right" class="q-mt-sm">
            <q-btn flat label="キャンセル" color="grey" v-close-popup />
            <q-btn type="submit" label="登録" color="primary" />
          </q-card-actions>

        </q-form>
      </q-card-section>

    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { useDialogFormStore } from 'stores/dialog-form'

const dialogFormStore = useDialogFormStore()

const form = reactive({
  companyName: '',
  postalCode: '',
  prefecture: '',
  cityStreet: '',
  building: '',
  phone: '',
  email: '',
  website: '',
  notes: '',
})

function onSubmit(): void {
  console.log('submit:', form)
  dialogFormStore.close()
}
</script>
