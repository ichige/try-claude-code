export default {
  app: {
    name: 'shisamo',
    caption: '請求・支払い管理'
  },
  navi: {
    dashboard: 'ダッシュボード',
    shipments: '取引管理',
    'masters': 'マスタ管理',
    'masters-caption': '各種マスタの管理',
    'masters-container': {
      carriers: '配送業者',
      consignees: '配送先',
      consignors: '取引先',
      forwarders: '地点',
    },
    'masters-tariffs': '運賃',
    'masters-charges': '付帯料金',
  },
  shipments: {
    step1: { title: '取引登録' },
    step2: { title: '配送業者の選定' },
    step3: { title: '実績入力' },
    step4: { title: '確認' },
    fields: {
      consignorId: '取引先',
      deliveryDate: '配送日',
      origin: '発送地',
      originAddress: '積地住所',
      destination: '納品先',
      destinationAddress: '納品先住所',
      carrierId: '配送業者',
    },
  },
  validation: {
    required: '{field}は必須です',
    numeric: '{field}は数値で入力してください',
    maxLength: '{field}は{max}文字以内で入力してください',
    minValue: '{min}以上の値を入力してください',
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
      description: '作成した設定が正しいか、シミュレータを使って確認しましょう。',
      distance: '距離 (km)',
      outOfRange: '範囲外',
    },
    labels: {
      selection: '運賃表の選択',
      enabled: '運用済',
      disabled: '運用前',
      active: '利用中',
      inactive: '停止中',
    },
    enabled: {
      title: '運用開始',
      message: '運用を開始すると運賃表の利用が可能になりますが、一部の項目をのぞいて編集が不可になります。運用開始しますか？'
    },
    active: {
      titles: {
        active: '利用開始',
        inactive: '利用停止'
      },
      messages: {
        active: '利用を開始しますか？',
        inactive: '利用を停止しますか？',
      }
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
  charges: {
    preset: {
      title: 'プリセット作成',
      message: 'プリセットを作成しますか？',
    },
    description: '付帯料金マスタはプリセットから作成したものをカスタマイズして利用します。' +
      '運賃マスタ同様に世代管理が必要ですが、各レコードの値は表のセルを直接クリックして編集可能です。' +
      '一度運用開始したバージョンは編集不可能になることに注意してください。',
    descriptions: {
      'delivery-count': '配送件数の割増設定',
      'highway-fee': '高速道路利用料金(税込)',
      'waiting-time': '待機時間料金',
      'working-time': '作業時間料金',
      'parking-fee': '駐車料金(税込)',
      'cancel-fee': 'キャンセル料金',
      'flat-rate-fee': '定額料金',
      'other-fee1': 'その他(税抜)',
      'other-fee2': 'その他(税込)',
    },
    taxable: {
      true: '税抜',
      false: '税込'
    },
    simulator: {
      yen: '金額',
      count: '件数',
      minutes: '分',
    },
    unit: {
      yen: '円',
      count: '件',
      minutes: '分',
    },
    labels: {
      selection: '付帯料金マスタの選択',
      notesPlaceholder: '備考を入力...',
      enabled: '運用済',
      disabled: '運用前',
      active: '利用中',
      inactive: '停止中',
    },
    enabled: {
      title: '運用開始',
      message: '運用を開始すると付帯料金マスタの利用が可能になりますが、一部の項目をのぞいて編集が不可になります。運用開始しますか？',
    },
    active: {
      titles: {
        active: '利用開始',
        inactive: '利用停止',
      },
      messages: {
        active: '利用を開始しますか？',
        inactive: '利用を停止しますか？',
      },
    },
    fields: {
      code: '種別コード',
      label: '帳票ラベル',
      unit: '単位',
      taxable: '課税',
      baseUnit: '基本単位',
      minUnit: '最低単位',
      unitFare: '加算料金',
      notes: '備考',
      calc: '計算結果',
    },
  },
  labels: {
    createdAt: '作成日時',
    updatedAt: '更新日時',
    create: '登録',
    back: '戻る',
    next: '次へ',
    'dark-mode': 'ダークモード',
    loading: '更新中...',
    logout: 'ログアウト',
    update: '編集',
    save: '保存',
    search: '検索',
    add: '追加',
    basic: '基本情報',
    address: '所在地',
    contact: '連絡先',
    other: 'その他',
    'two-columns': '2カラム表示',
    use: '利用開始',
    off: '停止'
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
