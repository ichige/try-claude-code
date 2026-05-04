# 取引一覧ページの作成

ここからは業務ロジックになる。  

- /shipments: 取引一覧 + 新規登録 + 編集
- /shipments/{consigner-id}: 特定の荷主でフィルタリングした取引一覧 + 新規登録 + 編集

取引一覧は月別に表示するので、ヘッダ層あたりに対象月を変更できるUIを設ける必要がある。  
管理者は常々どの月のデータを扱っているかを意識する必要があるので、目立つ方が良いだろう。

この画面では、新規登録 → 配送業者の選定 → 結果の入力 → 確定 といった流れになる。  
将来的に「結果の入力」は配送業者からの電子日報(LIFF)による自動入力を想定しているが、
全ての配送業者が電子日報を扱えるとも限らないので、まずは手入力による「確定」までの流れを作る。

取引の入力は、Stepper を使って上記のような流れを作る。  
一度に「確定」まで進んでも良し、「配送業の選定」前に保存しても良しといったイメージである。

`/shipments/{consignor-id}` はダッシュボードからもリンクをはる想定である。

`@packages/shared/src/types/shipments.ts` にデータ型を定義した。

## ルート設置とページの作成

まずはルート定義と、それに対応するページ、およびサイドメニューを調整する。

```markdown
取引データの一覧ページを追加する。
- /shipments: 取引一覧 + 新規登録 + 編集
- /shipments/{consignor-id}: 特定の荷主でフィルタリングした取引一覧 + 新規登録 + 編集
というルートになる予定。
左メニューには、dashboard の下にリンクを作成する。
とりあえず対応するページを pages 配下に作成し、「工事中」とする。
`/shipments/{consigner-id}` は単なるフィルタリングなので、とりあえず同一ページに着地して問題ない。
こんな条件でひな型を作成してほしい。
---
取引先一覧だけど、リンクの表示ラベルは「取引管理」としておいて。
```

## Step 1 ～ 4 までのモック生成

次は QDialog を使った Step1 ～ Step4 のフォームを作成する。  
まずは土台から生成させよう。

```markdown
ShipmentsPage.vue に QDialog を使った入力フォームを作りたい。
- 構成としては、TariffsPage.vue に近いものになる予定。
- components/shipments 配下に DialogFormを配置しておいてほしい。
- DialogForm では、QStepper を使って Step1 ～ Step4 構成になる予定。
- TariffsDialog.vue と近いけど、もう少し大規模になる予定。
    - とりあえずはステップするだけで中身の実装はなくて良い。
    - 取引登録 → 配送業者の選定 → 実績入力 → 確認 といった流れになる想定。
こんな感じでモックを作れるか？
```

デザインなども TariffsDialog を踏襲してくれて、バッチリであった。  

## 処理月の選定

まずはこのアプリの基本軸になる処理月の選定UIを作成する。  
これがないと始まらない。  

- ヘッダのアカウントの手前くらいに選択UIを取り付けたい。
- 選択月を Store に保存したい。

```markdown
このアプリでは、取引を月間で取り扱うことになる。
そのために、現在処理している月(YYYYMM)が重要になる。
この処理月を選択するUIと保存するStoreを作ってほしい。
- UIはQbtnDropdown + QDate が良いかな？
    - 日付選択はしないわけである。
- 場所は MainLayout.vue の AccountSetting の手前が良いだろう。
    - components/layouts 配下に切り出してほしい。
- Store はアプリ全体の設定になるので、useAppStore で良いかな。
    - デフォルトは今月(現在日時)に準拠させる。
    - pinia-plugin-persistedstate で、単純に保存してOKである。
こんなイメージで作れそう？
```

まぁまぁ悪くないものが出来た。
いくつか注文をしてみる。

```markdown
ちょっとUI操作が微妙なので修正してほしい。基本線は悪くない。
- QbtnDropdown ではなく、Qbtn + QPopupProxy にする。
- Qbtn のラベルは現在選択した処理月を表示する。
- 左右に小さな矢印系ボタンを配置して、左なら前月、右なら翌月に変わる。
- 処理月のラベルボタンを押した場合は、今作ってもらった簡易カレンダーから変更する。
こんなイメージに出来る？
```

うむ。動きはOKである。
もうちょい注文。

```markdown
選択月だけど、日付型で持つほうが扱いやすいか？
label の computed は他でも使いそうなので、useAppStore の機能に入れても良いのでは？
prevMonth の year と month も useAppStore の機能に入れても良さそうだな。
いや、year と month の参照だけだよ。
たぶん、このUI以外では処理月を変更させないと思われる。
そうしたいのだが、変更前にアラートを入れる予定があるんで、そこはそのままで良いかと思うんだ。
```

あとは自分でデザインを調整しておく。

## STEP1の入力フォーム

```markdown
@packages/shared/src/types/shipments.ts
に取引データの型を定義してある。
STEP1では、以下のフィールドが入力対象となる。
- consignorId: string
- deliveryDate: string
- origin: string
- originAddress: string
- destination: string
- destinationAddress: string 
consignorId は useConsignorsStore を選択させる。
deliveryDate は useAppStore の processingMonth にしたがって、その月からカレンダーで日付を選択させる。 
origin、originAddress、destination、destinationAddress は単純なテキスト入力でOK。
これを components/shipments 配下に別コンポーネントとして作成する。
このイメージで作成できそうか？
```

どうやら TariffsDialog.vue を意識しすぎてしまったらしい。

```markdown
TariffsDialog.vue は TariffsForm 1コンポーネントで対応したので、QStepper の使い方が特殊だが、
この ShipmentsDialog.vue では、一般的な使い方にしてほしい。
つまり Transition などは不要である。
修正できるか？
```

つづいて追加注文。

```markdown
発送地である origin は、自由にテキスト編集できる仕様ではあるが、useForwardersStore から選択も可能にしたい。  
- 発送地入力の左側にボタンアイコンなどを配置して、ドロップダウンリストから選択させるイメージ。
- 選択のラベルは 都道府県 + 市区町村で良いが、設定する値は市区町村だけでOK。
- 納品先である destination も同様になるので、再利用可能とするのが好ましい。
実装できそうか？
```

動きは問題ないが、デザインが微妙なので、修正する。

```markdown
prepend スロットではなく before の方が良い。
またアイコンも選択できる感が出る方が良い。
アイコンはリスト系が良さそうだと思う。
---
LocationInput.vue という形でコンポーネントにするのは悪くないけど、QInputは要件によってカスタマイズが入るので、スロット部分だけ共通化した方が良くないか？
```

## Store の準備

このダイアログフォームでは、「次へ」でDBを更新するという動作にする。  
STEP1 ～ STEP4 は言ってみればステートの変化であり、STEP4まで到達することで請求対象になるといったイメージになる。

```markdown
続いて Shipment の Store を作成してくれ。
基本的には useConsignorsStore と同じようなものではあるが、マスタデータではないので別途用意する。
useMastersStore の create update patch の固定版みたいなもので、list はまだ作成しなくてOK。
```

とりあえず出来た。

```markdown
STEP1で「次へ」ボタンを押したタイミングで、作成した useShipmentsStore の create を実行して、レコードを作成したい。  
STEP2以降はステップごとに update するイメージであるので、ShipmentsDialog.vue でも引き継ぐ必要がある。
実装できそうか？
---
ごめん言い忘れたけど、initialDraft で pk の初期値を appStore.processingMonth の値(YYYYMM)にしてくれ。
月間単位でフェッチするためやな。
```

動きは出来ているが、ロジックが微妙である。

```markdown
draft と createdItem と分けないと実装できないものかね？
```

## Schema + Validation

小手先のバリデートを zod スキーマへ修正する。

```markdown
ShipmentsDialog.vue の initialDraft や、ShipmentsStep1.vue の requiredStr などは composable に移動させよう。
STEP1のバリデートは configs/dialog-form/consignors.ts を参考にして、zod スキーマとして定義しつつ、
ShipmentsStep1.vue で参照できると思うのだが、どうだろうか？
```

## STEP2 の入力フォーム

```markdown
STEP2は配送業者の選定になる。
入力項目は以下になる。
- carrierId
これは useCarriersStore の list から選択するUIとなり、STEP1での consignorId とほぼ同じである。
「次へ」ボタンではそのまま update を行う。
zod スキーマが configs/shipments/step1.ts に設定されているが、ファイルを分けることで返って理解しづらくなるので、
統合して良いかと思われる。
実装できそうか？
```

見た目はまぁまぁだけど、createdAt なんかが消えてる。

```markdown
STEP1で create したら、基本的に戻り値となるレコードは保持する必要がある。
createdAtなど、そのまま保持しつつ update を行うようにしてくれ。
むしろ何かを削除する必要はない。
```

とりあえずはこんなもので良いだろう。  
のちほどUIなどは微調整する予定。

## STEP3 の入力フォーム

```markdown
STEP3は実績 breakdown の入力になる。
packages/shared/src/types/shipments.ts にある ShipmentBreakdown である。
ユーザの入力は quantity となり、code は固定値である。
入力項目は全部で10種になる。
- 走行距離(km)
    - ShipmentBreakdownCode の distance を指す。
- configs/masters/charges.ts の ChargeItem 9種
    - packages/shared/src/types/charges.ts の ChargeCode
入力フォームは 2column構成で、まずは愚直に10項目を並べてほしい。
```

少々情報が古かったようなので、微調整する。

```markdown
breakdown: ShipmentBreakdown では、label フィールドが不要になったんで、削除しておいてくれ。
```
