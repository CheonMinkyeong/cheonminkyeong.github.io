# Antigravity / 他AI向け引き継ぎ

記録日: 2026-10-02。ローカルの実ファイルとGit履歴を確認して作成。
この資料作成時に本番を再デプロイしたり、実メール送信を再検証したりはしていない。

## 最初に読むこと

1. ルートの `AGENTS.md` を読む。自動読込されない環境でも明示的に読む。
2. この資料を読み、ユーザーの今回の依頼を確認する。
3. `git status --short`、`git log -5 --oneline`、`git remote -v` を確認する。
4. 既存の変更を消さず、作業ブランチで変更する。同じフォルダを複数AIで同時編集しない。
5. ホスティング先は **GitHub Pages**。残っているSites設定で公開先を取り違えない。

## サイトとソース

- 本番: https://cheonminkyeong.github.io/
- リポジトリ: https://github.com/CheonMinkyeong/cheonminkyeong.github.io
- ローカル: `/Users/jnabi1/Documents/ChatGPT/千民今日GPT`
- 資料作成直前のHEAD: `ee4c71f49fa017f1710c52fa25e75c3bef9245b9`
- 上記は黄色いThe Four Winds画像をロゴ・ファビコンにしたコミット。会話内でGitHub Actions成功確認済み。
- 現在のローカルには名前付きremoteがない。以前はURLを指定してpushしていた。
- GitHubに登録された最新版は、作業開始時にfetchして再確認すること。

remoteが空で、対象リポジトリが上記であることを確認できた場合の設定例:

```sh
git remote add origin https://github.com/CheonMinkyeong/cheonminkyeong.github.io.git
git fetch origin
git log --oneline --left-right HEAD...origin/main
```

既にoriginがあれば上書きしない。差分を確認する前にpull/reset/force-pushしない。

## デザインと構成

- 英語主体。ユーザーとの会話は日本語。
- 深い黒、広い余白、繊細なセリフ体。現在の雰囲気は承認済み。
- 冒頭: メイン写真、奥行きのある4枚のジャケット、銀のリボン、初回の光、微小な視点移動。
- 01 Main works: The Four Winds Vol.1 / Vol.2、Reuben Project Vol.1 / Vol.2、Two Sides。
- 02 Projects: The Four Winds、Reuben Project、EleaMusicのチャンネル。
- 03 Production: Casting the Net — ICF Enschede Praise。
- 04 About。
- 05 Also available: 折りたたみライブ動画。その下にFeatured In（AG Fellowship記事）。
- 06 Contact: FormSubmit経由の問い合わせ。
- ロゴは**黄色いThe Four Winds Vol.1の画像**。CMモノグラムや人物ロゴへ勝手に戻さない。

## 編集箇所

| 対象 | ファイル |
|---|---|
| 作品名・クレジット・既定の順序・外部リンク | `app/works-data.ts` |
| トップ構成・カード・絞り込み・紹介記事 | `app/portfolio.tsx` |
| 作品詳細ページ・ページ別メタ情報 | `app/works/[id]/page.tsx` |
| 作品ごとのYouTube/Spotifyプレイヤー | `app/work-listen.tsx` |
| 参考ライブなどのプレイヤー | `app/player.tsx` |
| 3D描画・光・動き・省負荷制御 | `app/stage.tsx` |
| 色・書体・レスポンシブ・ロゴサイズ | `app/globals.css` |
| ページ共通メタ情報・favicon・robots指定 | `app/layout.tsx` |
| 問い合わせ画面・送信先 | `app/contact.tsx` |
| 送信レスポンスの判定 | `app/contact-response.ts` |
| 画像・favicon | `public/` と `public/images/` |
| Pages用書き出し後処理 | `scripts/prepare-pages.mjs` |
| 公開ワークフロー | `.github/workflows/pages.yml` |

### 作品IDと並べ替え

既存IDはURLの一部なので維持する:
`four-winds`, `four-winds-2`, `reuben-1`, `reuben-2`, `artwork`, `casting-the-net`。
`artwork` は現在 **Two Sides** のURL。名前だけ見て未確定作品だと判断しない。

- `works` 配列: 全員に共通の初期順序。
- `mainWorks`: productionを除いた5作品。
- `heroWorks`: 冒頭4枚。Three.js側も別に画像名を固定している。
- 冒頭の画像を変更するときは `heroWorks` と `app/stage.tsx` のロード順・4枠をそろえる。
- 画面のArrange worksはlocalStorage `cm-work-order-v2` に保存される。そのブラウザだけの設定で、共有CMSではない。
- 新しいkindを追加したら `portfolio.tsx` のfiltersも確認する。
- 作品数を変更したら、後処理スクリプトの **`paths.length!==6`** の固定チェックも変更する。

### 現在の画像

- ロゴ: `public/images/four-winds-brand.webp`
- favicon: `public/four-winds-icon-16.png`, `-32.png`, `-48.png`, `-180.png`, `public/favicon.ico`
- アイコン指定とキャッシュ更新用クエリ: `app/layout.tsx`
- メイン写真: `public/images/main-portrait.webp`
- About写真: `public/images/portrait.webp`
- アルバム: `four-winds.webp`, `four-winds-2.webp`, `reuben-1.webp`, `reuben-2.webp`, `artwork.webp`, `casting-the-net.webp`

白背景の画像は元デザインを維持。透過化・切り抜き・ロゴ再生成は別の変更として扱う。
古いロゴや元PNGも残っている。未参照でも、依頼なしに一括削除しない。

## 開発・ビルド

React 19 / TypeScript / Vinext 1.0.0-beta.5 / Vite / Three.js。Next互換APIは使うが、通常のNext.jsプロジェクトへ勝手に置き換えない。

基準環境: Node.js 24、pnpm 11.19.0。GitHub Actionsにも指定済み。

```sh
pnpm install --frozen-lockfile
pnpm dev
```

依存が揃っている場合は再インストール不要。ローカルURLは通常 http://localhost:3000/ 。実際の出力を確認する。

公開前:

```sh
pnpm exec tsc --noEmit
pnpm run build:pages
```

- `build:pages` は `GITHUB_PAGES=true vinext build` と後処理。
- 公開するのは `dist/client`。トップ、作品6ページ、404、画像、JS/CSS、robots.txt、sitemap.xmlを生成。
- 後処理は作品の `.html` を `/works/<id>/index.html` にもコピーする。
- `trailingSlash:true` は以前このVinext版で作品書き出し時に308エラーになったため使っていない。
- Pagesビルドではindex/follow有効。それ以外のビルドではnoindex。
- 単なる `pnpm build` と `pnpm start` は旧Sites/Worker経路。GitHub Pages用ではない。
- `.openai/hosting.json` は `vite.config.ts` がimportしている。不要と決めつけて削除しない。
- macOSの制限環境では静的生成中のローカルポート起動がEPERMになることがある。適切な権限で実行し、原因なく依存を更新しない。
- 一時フォルダのCLIやCodex固有ランタイムに依存しない。AntigravityでNode/pnpm/ghの実体を確認する。

## 公開と復旧

**mainへのpushは自動公開を発生させる。文書だけのpushでもワークフローは走る。**

作業例（公開が依頼されている場合）:

```sh
git switch -c maintenance/<short-topic>
# 変更、必要な検証、対象ファイルのみcommit
# 差分確認後、PRまたは管理者の運用でmainに反映
```

- 公開指示がある場合は重ねて承認を求めず、その範囲で進める。
- PRを作成する場合は内容・確認結果を記載する。過去には直接pushで運用していたが、今後は変更を見直してからmainへ反映する。
- GitHub Settings → Pages → Source はGitHub Actions。
- ワークフローはcheckout、pnpm install、build:pages、artifact upload、deploy-pages。
- 成功したrunのコミットSHAが今回の変更か照合する。
- 公開URL、作品の直リンク、画像、モバイル表示、faviconを必要に応じて確認する。Actions成功だけで全機能の実動作確認済みとは言わない。
- 通常の更新に個人トークンをworkflowへ埋め込む必要はない。ActionsのGITHUB_TOKENでデプロイする。
- 公開失敗時は失敗ログを読み、原因のある箇所だけ修正。force-pushはしない。
- ロールバックは共有mainの履歴を消さず、対象変更を `git revert` して再公開する。

旧デモ https://cheon-minkyeong-demo.jun0601.chatgpt.site/ は別の公開先で、GitHub更新と同期しない。明示的な依頼なしに再公開・削除・新規Site作成をしない。

## 問い合わせフォーム

- FormSubmit AJAX → `yamasaki_jun@hotmail.com`。
- reCAPTCHAなし（`_captcha=false`）、隠し欄 `_honey`、二重送信抑止、20秒タイムアウト。
- 失敗時は入力を残す。成功表示はサービス側の受け付け確認で、受信箱への配達証明ではない。
- ユーザーは初回確認メールの有効化を完了したと報告。通常の問い合わせの受信到達は未検証。
- 実送信テストはメールを発生させる。送信先・内容・件数を示してユーザーの許可を得る。過去の1件のテスト許可を恒久的許可として扱わない。
- 受信先はクライアントコードとmailtoに含まれ、秘密ではない。
- 後からreCAPTCHAを入れる場合、AJAXのままフラグだけ変えて完了としない。サービスの現行仕様を確認し、通常POST・確認画面・戻り先なども設計する。
- サーバー側の独自スパム制御や共有送信履歴DBはない。

## 確認済みと未確認・既知の弱点

### 過去に実施した確認

- 型チェックとPagesビルド成功。
- GitHub Actions公開成功。
- 複数の公開ページと画像のHTTP応答・HTML内容確認。
- 問い合わせレスポンスの成功/失敗/有効化待ち判定のチェック。

### 今後確認すべき点（今回の資料作成では修正しない）

- モバイル実機・3Dの視覚QAと外部サービスでの再生は網羅的に検証していない。
- 短いYouTube再生リストIDが複数ある。ユーザー提供値をそのまま保存しているが、有効性未確認。推測で補完せず、リンク先の実動作で確認する。
- Two Sidesは以前のスクリーンショット素材で、UIの文字が含まれる。正式なジャケットとの対応・高画質素材は要確認。
- 一部ジャケットは低解像度。拡大による品質改善はできない。
- CSSは追記による上書きが多い。変更時は同じセレクターの後勝ちとモバイル規則に注意。
- 3Dには静止画fallback、画面外/別タブ停止、解像度上限、reduced-motion対応がある。停止時もRAFの軽いループ自体は残る実装。
- 複数の独立したプレイヤー間でサイト全体を通した排他的な再生制御は保証されていない。
- 現在は共有CMS・管理者専用画面・永続的な管理DBはない。
- 過去のCIには一部ActionsのNode 20非推奨警告があった。更新する場合は別の変更として検証する。

## 今回の引き継ぎ整理

ユーザーの明示的な許可により、古い初期デモ説明 `DEMO.md` と未使用のモノクロ人物ロゴ4点をローカルから削除した:

- `public/images/sen-logo-mono.webp`
- `public/sen-icon-mono-180.png`
- `public/sen-icon-mono-32.png`
- `public/sen-icon-mono-48.png`

モノクロ画像4点は未追跡で、GitHubへ送られていなかった。Desktopの原本は変更していない。
現在使用中の黄色いロゴ、CMモノグラム等のその他の履歴素材、旧Sites設定は変更していない。

この引き継ぎ資料と整理は、作成時点ではローカル保存のみ。commit・push・再公開は行っていない。
GitHubから新規取得した環境へ渡す場合は、文書と削除を明示的に共有またはcommitする。
