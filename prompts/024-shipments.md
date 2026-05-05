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

### 実装ミスを修正

```markdown
ShipmentsStep1.vue で、納品先(draft.destination)の選定をしてる箇所がある。
そこの向き先を forwardersStore ではなく、useConsigneesStore に変更できるか？
```

うむ一発で修正できた。

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

## STEP4 の入力フォームを作成

ここでは備考欄のみ変更できる。
「承認」して初めて請求書発行対象になるというイメージではあるが、現時点ではまだステート管理はしない。

```markdown
STEP4 では STEP1 ～ STEP3 までに入力した内容を表示し、
ShipmentsItem の notes 欄だけの入力フォームを表示する。
- 入力内容の表示は QCard を使う。
    - たぶんこのコンポーネントを再利用するので、ShipmentsItem を受けとり、表示するようなイメージで。
    - QList + QItem あたりの組み合わせかな？
- 入力内容の下部に notes 入力欄(textarea)を設ける。
- 保存で更新して完了。
こんなイメージで作成できそうか？
```

## UI微修正

まずはセレクターに簡易フィルタ機能を追加する。

```markdown
ForwarderSelect.vue で、件数が多い場合に絞り込み用の簡易フィルタを追加したい。
実装できるか？
あと、このセレクターの機能は Forwarder に限らず利用するので、抽象的な名前にしておいた方が良さそう。
```

取引先選択も同じUIを使用する。

```markdown
ShipmentsStep1.vue の取引先(consignorId)選択でも、ListSelectBtn.vue が利用できるかな？
```

clearable を設定すると、null になるので調整。

```markdown
ShipmentsDialog.vue で Qinput に clearable を指定すると、model 値が null になるようだ。  
強制的に空文字に変換できるものか？
---
onClear を使うのでは？
```

バリデーションメッセージがおかしいので修正。

```markdown
draft.destination で zodRule を利用しているが、`{field}は必須です` ← `は必須です` と表示される。
第２引数が悪いのか？
なぜ `{field}` が消える？
legacy false とはなんだ？
ということで、zod に渡す前に t 変換せずに、キーだけ返ってきたものを t 変換するという修正をしたかったわけだだ？
しかし、その変換方法って、zodRuleに渡す時点で、t に引数渡せばよいのでは？

t('validation.required', { field: t('xxxxx')) 
となるのでは？

スキーマがフィールド名に依存するとは？

いや、私が言ってるのは、zodRule の第２引数が不要なのではなないか？という事だけど。

zodRule の第2引数は不要になったんで、削除してもらってOKす。
テストコードも微妙なのかも。

```

STEP2のUIもSTEP1を踏襲させる。

```markdown
ShipmentsStep2.vue の 配送業者選択(draft.carrierId) だけど、STEP1 と同様に ListSelectBtn を利用するように修正してほしい。
```

STEP3の数値入力も調整。

```markdown
ShipmentsStep3.vue の数値入力だけど、utils/clamp.ts の toNonNegative でマイナス値を制御できるか？
普通にマイナス値が入力できるぜ？フォーカスが外れると、0に更新されるようだけど。
そういう事ではなく、値がマイナスになっても、フォー数が外れないと更新されないって言っているのだけど？

ChargesPage.vue の計算シミュレータ(金額) simulatorYen は、マイナス値がそもそも入らない。
これと同じ動作にならないのは理由があるはずだ？
```

## 取引先名や配送業者名などを取得するメソッドをStoreに追加

```markdown
ShipmentCard.vue にある、consignorName や、carrierName は、各ストアのメソッドとして定義できないものかな？
```

```markdown
ShipmentsStep1.vue の consignorName の input は readonly だけど、クリックイベントは拾えないのかね？
要するに、input 要素とアイコンとどっちでも反応してほしいわけだ。
面倒そうやな。
単に子のクリックイベントを伝播できないものか？
試しに入れてみてくれ。
input ではなくprepend の icon のクリックイベントにすることもできるか？
やっぱ慣れの問題だな。元にもどしておいてくれ。
明日は一覧表示の開発へ進む予定だ。
```

## 取引一覧作成

いくつかマスタ系のテーブルがあるので、それを踏襲するだけであっさり作成できるはずである。

```markdown
ShipmentsPage.vue に Shipments コンテナのレコードを一覧表示する QTable を作成したい。
まずは Store の調整から始める。
stores/masters 配下の各マスタStoreでは、factory.ts の共通利用で items に全件保持している。
useShipmentsStore では、月単位で一覧を管理するため、動作が異なることに注意する。
- fetchAll に相当するメソッドでは、pk 指定による useAppStore.processingMonth による絞り込みが必要。
- items の管理も processingMonth というキーが必要になり、processingMonth の変更で、中身を入れ替える。
    - マスタデータと違って、都度最新化するため、processingMonth が変わるごとに毎回フェッチする。
    - 管理対象は processingMonth だけになり、processingMonth が変わったタイミングで、以前まで保持していたデータは完全に入れ替える。
- マスタデータ同様に、prefetch メソッドを追加して、prefetch-guard.ts ルータガードで実行する。
このような仕様となるが、実装できそうか？
```

頼んでもいなかったけど、prefetch を Promise.all で実装してくれた。

```markdown
QTable の実装は、TariffsPage.vue や ChargesPage.vue が参考になるはず。
両ページ共にバージョン管理の概念があるが、Shipments においては、processingMonth がその代わりを担っていると考えて良い。
テーブルに表示する内容は以下になる。

- consignorName: 取引先名
    - consignorId を元に useConsignorsStore から名前を参照する。
- deliveryDate: 配送日
    - YYYY-MM-DD フォーマットのままでOK
- origin: 発送地名
    - そのままでOK
- destination: 納品先名
    - そのままでOK
- carrierName: 配送業者名
    - carrierId を元に useCarriersStore から名前を参照
- distance: 走行距離
    - breakdown の distance を参照
- notes: 備考
    - 10文字以下を省略(Quasarにスタイルがあるかと)
こんなイメージで作成できそうか？
```

だいたいイイ感じに作成してくれた。
余計な実装だけ削除しておく。

```markdown
watch で appStore.processingMonth を参照してるけど、このページではその実装は不要なので削除しておいて。
columns は composables/shipments あたりに切り出しておいて。
changeMonth の機能は、layouts のヘッダでの一元管理になるので、ここでは不要なので削除して。
```

あとはデザイン調整や機能追加。

## ステート管理を追加

| ステート | 更新タイミング | 説明 |
| --- | --- | --- |
| new | STEP1データ作成時 | このタイミングでは物理削除可能である。 |
| assigned | STEP2で配送業者を選定し更新 | 物理削除・編集は可能。 |
| submitted | STEP3で実績入力が完了 | 物理削除・編集は可能。 |
| completed | STEP4で確認完了 | 物理削除・編集共に不可となる。 |
| reverted | STEP4で強制的に戻す | 物理削除・編集は可能。 |

強制的に completed から巻き戻す(編集可)事は可能とする。

ステートが `created` | `assigned` | `submitted` | `reverted`  の状態であれば、 編集画面もSTEP1から開始する。
`completed` の場合はSTEP4のみ再表示する。

- STEP1 ～ STEP3 では「保存」→ ダイアログクローズボタンを用意。
- 作成モードでは「保存」を押すまではDB登録しない。
- 編集モードでは「保存」を押すまでDB更新しない。
- STEP4で `completed` の場合は `reverted` へ変更できるボタンを用意する。

```markdown
Shipments でステート管理をしたいので、status 的なフィールドを追加したい。
```

勝手に更新処理まで追加した。
まぁ、どーせ必要だから良しとする。

```markdown
ShipmentsPage.vue に 汎用マスタ ContainerTable.vue を参考にして、actions スロットに、編集ボタンと削除ボタンを追加した。
- 削除ボタンはまだ実装しないで表示だけでOK。
- 編集ボタンでは、選択した取引データを ShipmentsDialog.vue で開きたい。
    - status が `completed` の場合はSTEP4表示。
    - それ以外の status であれば、STEP1から表示でOK。
実装できそうか？
```

まずはレールに沿った感じで編集機能を追加してくれた。

```markdown
現状では ShipmentsDialog.vue の STEP1 → STEP3では「次へ」ボタンでDB更新しているが、これを変更したい。
- 「次へ」ボタンは status の変更だけを行い、DB更新はしない。
    - STEP1の場合は現状維持。
    - STEP2の場合、new であれば assigned へ変更。それ以外は現状維持。
    - STEP3の場合、assigned であれば submitted へ変更。それ以外は現状維持。
- STEP1 ~ STEP4に「保存」ボタンを設ける。保存ボタンは処理後にダイアログを閉じる。
    - 各ステップではバリデートエラーが出なければ、create or update を行い、status は変更または維持する。
    - STEP2の場合、status が new であれば、assigned へ変更する。
    - STEP3の場合、status が　assigned であれば submitted へ変更。それ以外は現状維持。
    - STEP4の場合、status は現状維持。
- STEP4には「承認」ボタンを追加する。
    - status が submitted であれば completed に変更して create or update を行う。
    - フロー的にはあり得ないが、submitted or reverted でない場合はボタンを非活性にしておく。
こんなイメージで修正できるか？
```

実装がいまいちっぽい。

```markdown
「次へ」ボタンは status の変更だけを行い、DB更新はしない。
と指示をしたけど、そうはなってないぞ？
---
ShipmentsDialog の 編集モードで、useShipmentsStore 管理の item をそのまま参照してないか？
編集対象とするなら、オブジェクトを複製するべきだと思うが？
```

## UIとロジックの最終調整

### テーブルにステータスを表示

```markdown
ShipmentsPage.vue で追加した status を表示したい。
- new : 未配車
- assigned : 配車済
- submitted : 報告済
- completed : 承認済
- reverted : 差し戻し
といったラベルで良いかと思う。
実装できるか？
```

### QDate の日付解除で null になる

```markdown
@apps/admin/src/components/shipments/ShipmentsStep1.vue
配送日 draft.deliveryDate の入力で、q-popup-proxy を使って q-date で日付を選択させている。
一度選択した日付を再クリックすると、選択が解除されるようではあるが、その際に model 値が null になる。
これが zod.string のエラーを誘発するようである。
null 値にならないように対応するか、q-date の再選択で解除にならないようにするか、どちらか実装できそうか？
```

### STEP1の重複処理を削除

```markdown
@apps/admin/src/components/shipments/ShipmentsStep1.vue
consignorName 関数は、useConsignorsStore に対応するメソッドがあるのでは？
---
consignorOptions なども、再利用性を考慮して Store の getters に移行した方が良いのでは？
であれば、冗長的なので、composables/shipments に切り出しておくか？
```

### STEP1のバリデートを強化

```markdown
@apps/admin/src/configs/shipments/schemas.ts
step1Schema だが、最大文字数を設定しておきたい。
origin: max 80
originAddress: max 256
destination: max 80
destinationAddress: max 256
に調整してほしい。
ShipmentsStep1.vue にも maxlength を設定したい。
```
