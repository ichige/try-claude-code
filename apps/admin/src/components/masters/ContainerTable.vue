<template>
  <q-table :rows="rows" :columns="columns" row-key="id" />
</template>

<script setup lang="ts">
import type { QTableProps } from 'quasar'
import type { ConsignorsItem } from '@shisamo/shared'

const rows: ConsignorsItem[] = [
  {
    id: '1',
    pk: 'sample',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    deletedAt: null,
    isDeleted: false,
    _etag: '"etag-1"',
    companyName: 'サンプル株式会社',
    companyCode: 'S001',
    invoiceNumber: 'T1234567890123',
    paymentRate: 85,
    postalCode: '100-0001',
    prefecture: '東京都',
    cityStreet: '千代田区千代田1-1',
    building: '',
    phone: '03-1234-5678',
    email: 'sample@example.com',
    website: 'https://example.com',
    notes: '',
  },
  {
    id: '2',
    pk: 'sample',
    createdAt: '2026-02-01T00:00:00.000Z',
    updatedAt: '2026-02-01T00:00:00.000Z',
    deletedAt: null,
    isDeleted: false,
    _etag: '"etag-2"',
    companyName: 'テスト商事株式会社',
    companyCode: 'T002',
    invoiceNumber: '',
    paymentRate: 90,
    postalCode: '530-0001',
    prefecture: '大阪府',
    cityStreet: '大阪市北区梅田2-2',
    building: 'テストビル3F',
    phone: '06-9876-5432',
    email: 'test@example.com',
    website: '',
    notes: 'テスト用データ',
  },
]

const columns: QTableProps['columns'] = [
  { name: 'companyName', label: '会社名', field: 'companyName', align: 'left' },
  { name: 'companyCode', label: '管理コード', field: 'companyCode', align: 'left' },
  { name: 'invoiceNumber', label: 'インボイス番号', field: 'invoiceNumber', align: 'left' },
  { name: 'paymentRate', label: '支払比率', field: 'paymentRate', align: 'right' },
  { name: 'postalCode', label: '郵便番号', field: 'postalCode', align: 'left' },
  { name: 'prefecture', label: '都道府県', field: 'prefecture', align: 'left' },
  { name: 'cityStreet', label: '市区町村・番地', field: 'cityStreet', align: 'left' },
  { name: 'building', label: '建物名・部屋番号', field: 'building', align: 'left' },
  { name: 'phone', label: '電話番号', field: 'phone', align: 'left' },
  { name: 'email', label: 'メールアドレス', field: 'email', align: 'left' },
  { name: 'website', label: 'Webサイト', field: 'website', align: 'left' },
  { name: 'notes', label: '備考', field: 'notes', align: 'left' },
]
</script>
