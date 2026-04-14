# エラーハンドリング

boot で catch されなかったエラーをハンドリングする。  
ログを出力する必要があるので、Logger の boot より後に実行させる必要がある。

## prompt

```markdown
`apps/admin/src/boot` でキャッチされなかった例外をハンドリングしたい。
- `apps/admin/src/boot/logger.ts` の Logger を利用して、エラーをログに記録する。
- エラーは console にも出力しておく。
- error ページへ遷移させる。
```

これはあっさり完成した。  
