# 各マスタ登録のバリデートを強化

## carriers

```markdown
@apps/admin/src/configs/dialog-form/carriers.ts
バリデートに以下の条件と追加して強化したい。
- companyName: max 80
- companyCode: max 80 | 半角英数＋記号(-_)
- invoiceNumber: 先頭 T + 数値13桁 例) T0000000000000
- lineId: 現状維持
- postalCode: いわゆるハイフン付きのフォーマット xxx-xxxx 
- prefecture: max 16
- cityStreet: max 256
- building: max 128
- phone: max 16 で数字とハイフンを許可
- email: email 型
- notes: max 1024
変更できるか？
```

## consignees

```markdown
apps/admin/src/configs/dialog-form/consignees.ts
バリデートに以下の条件と追加して強化したい。
- companyName: max 80
- companyCode: max 80 | 半角英数＋記号(-_)
- invoiceNumber: 先頭 T + 数値13桁 例) T0000000000000
- postalCode: いわゆるハイフン付きのフォーマット xxx-xxxx 
- prefecture: max 16
- cityStreet: max 256
- building: max 128
- phone: max 16 で数字とハイフンを許可
- email: email 型
- website: URL型
- notes: max 1024
変更できるか？
```
