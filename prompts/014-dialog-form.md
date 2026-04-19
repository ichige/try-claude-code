# Dialog Form

複数の入力フォームを QDialog を使って実装したい。  
特にマスタデータなどの管理は、共通化可能なはずである。

## prompt

まずは `composable` ディレクトリを追加する。  
これくらい最初から用意して欲しいものではあるが…。

```markdown
`apps/admin` で、`composable` ディレクトリを追加したい。
- `quasar.config.ts` にて、tsConfig の paths に追加する必要がある。
- `components` や `layouts` と同じデザインになるので、`@xxx` とはしないでください。
- `.quasar/tsconfig.json` を参考にしてください。
- `viteConf` には追加は不要なんでしたっけ？
```
