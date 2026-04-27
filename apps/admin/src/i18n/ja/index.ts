export default {
  app: {
    name: 'shisamo',
    caption: '請求・支払い管理'
  },
  navi: {
    dashboard: 'ダッシュボード',
    'masters': 'マスタ管理',
    'masters-caption': '各種マスタの管理',
    'masters-container': {
      carriers: '配送業者',
      consignees: '配送先',
      consignors: '取引先',
      forwarders: '地点',
      tariffs: '運賃',
    },
  },
  validation: {
    required: '{field}は必須です',
    numeric: '{field}は数値で入力してください',
  },
  labels: {
    create: '登録',
    'dark-mode': 'ダークモード',
    logout: 'ログアウト',
    update: '編集',
    save: '保存',
    search: '検索',
    basic: '基本情報',
    address: '所在地',
    contact: '連絡先',
    other: 'その他',
  },
  containers: {
    fields: {
      companyName: '会社名',
      companyCode: '管理コード',
      invoiceNumber: 'インボイス番号',
      paymentRate: '支払比率',
      lineId: 'LINE ID',
      postalCode: '郵便番号',
      prefecture: '都道府県',
      cityStreet: '市区町村・番地',
      building: '建物名・部屋番号',
      phone: '電話番号',
      email: 'メールアドレス',
      website: 'Webサイト',
      city: '市区町村',
      notes: '備考',
    }
  }
}
