# Romaco-sama Creative Showcase

罵尻ロマ子（Romaco-sama）Official Creative Showcaseです。罵尻ロマ子様の4コマ漫画、動く漫画、料理シネマ、PV、講座動画などを並べ、Romaco-samaコミュニティに「愛と罵倒が最新AIでどう動き出すか」を共有する画面として設計しています。

## Setup

```sh
npm install
npm run dev
```

検証は`npm run validate`で実行します。

## Content

作品は`src/content/works/*.md`へ1作品1ファイルで追加します。スキーマに違反するデータはビルドで停止します。

- `published: true`: 本番表示対象
- `seed: true`: 正式素材へ差し替えるまでの展示枠
- `priority`: 小さい数値から表示
- `featured`: 代表作候補

公開前に、作品の公開許諾、クレジット、外部素材・音声・キャラクターの権利を確認してください。

## Links

`.env`で共有導線を差し替えます。

- `PUBLIC_X_SHARE_URL`: Xのシェアリンク。未設定時は既定の投稿文を使います。
- `PUBLIC_ROMACO_LITLINK_URL`: 罵尻ロマ子様 Lit.Link。
- `PUBLIC_ROMACO_GAME_URL`: ロマ子様公式ゲーム。
- `PUBLIC_ROMACO_SUBSTACK_URL`: ロマ子様公式Substack。
- `PUBLIC_HAGEDANGO_X_URL`: 制作担当はげだんごのXプロフィールまたはDM導線。

## Deployment

静的出力です。NetlifyではBuild commandを`npm run build`、Publish directoryを`dist`に設定します。
