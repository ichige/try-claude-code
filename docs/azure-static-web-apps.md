# Azure Static Web Apps

ポータル上でアプリを作成すると、だいたい自動的に 設定してくれる。  
あくまでたいだいなので、基本的にはいきなり動くものではないが、yaml のひな型が出来るだけでも便利と言えるだろう。

## 修正点

今回 pnpm を利用してビルドするため、デフォのテンプレートではビルド不可能になる。  
以下のように pnpm の整備をするステップを追記している。

```yaml
      - name: Install pnpm
        uses: pnpm/action-setup@v4
        with:
          version: 10.33.0

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '24' # ログにある v24.13.0 に合わせる
          cache: 'pnpm'
```

さらに Quasar CLI がないとビルドできないので、これも追記しておく。

```yaml
      - name: Install Quasar CLI
        run: pnpm add -g @quasar/cli
```

また `.env` がないと環境変数を埋め込めないため、ビルド直前で `.env.production` を作成している。  
規模が大きくなるようであれば、script 化するべきかも。

```yaml

      - name: Install dependencies and Build
        run: |
          cat << EOF > ./apps/admin/.env.production
          VITE_MSAL_CLIENT_ID=${{ vars.VITE_MSAL_CLIENT_ID }}
          VITE_MSAL_AUTHORITY=${{ vars.VITE_MSAL_AUTHORITY }}
          VITE_MSAL_REDIRECT_URI=${{ vars.VITE_MSAL_REDIRECT_URI }}
          VITE_APPLICATIONINSIGHTS_CONNECTION_STRING=${{ vars.VITE_APPLICATIONINSIGHTS_CONNECTION_STRING }}
          EOF
          pnpm install
          pnpm run build:admin
        working-directory: ./
```

結局のところ、7回ほど修正してやっと動作した。  
Github Actions は便利ではあるものの、デバッグが難しすぎて、毎回のことだけど面倒くさい。
