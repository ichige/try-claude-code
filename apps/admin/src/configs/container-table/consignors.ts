import type { QTableProps } from 'quasar'

export const columns: QTableProps['columns'] = [
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
  { name: 'actions', label: '', field: 'actions', align: 'center', sortable: false },
]
