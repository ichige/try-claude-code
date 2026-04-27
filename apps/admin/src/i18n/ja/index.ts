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
    },
    'masters-tariffs': '運賃',
  },
  validation: {
    required: '{field}は必須です',
    numeric: '{field}は数値で入力してください',
  },
  tariffs: {
    step1: {
      title: '距離範囲の設定',
      description: '運賃の計算が変わる範囲を距離レンジとして作成します。加算単価が変わる範囲で分けるのがコツです。',
      example: '例) 1km ～ 20km までは一定額、21km ～ 100km までは 1km 毎に300円加算、それ以降は 200円加算。 → 計3行のレンジを作成する。'
    },
    step2: {
      title: '運賃の入力',
      description: '基本料金に加えて、範囲内の走行距離が加算単位(km)を超過する毎に、加算単価分だけ加算されます。',
      example: '例) 1km毎に200円を加算。 → 加算単位 = 1、加算単価 = 200 に設定する'
    },
    step3: { title: '確認' },
    simulator: {
      title: '計算シミュレータ',
      distance: '距離 (km)',
      outOfRange: '範囲外',
    },
    fields: {
      version: 'バージョン',
      name: '運賃表の名前',
      ranges: '距離レンジ',
      minKm: '下限 (km)',
      maxKm: '上限 (km)',
      baseFare: '基本料金',
      unitKm: '加算単位',
      unitFare: '加算単価',
    },
  },
  labels: {
    create: '登録',
    back: '戻る',
    next: '次へ',
    'dark-mode': 'ダークモード',
    logout: 'ログアウト',
    update: '編集',
    save: '保存',
    search: '検索',
    add: '追加',
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
