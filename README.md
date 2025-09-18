# ORA Fluid Chat

iOS 16 風の流体ガラス表現を採用したチャットアプリのデモです。Google 認証でサインインすると、Web 検索の有無や画像・ファイル添付を切り替えながらアシスタントと会話できます。UI は Tailwind CSS をベースにカスタムグラスモーフィズムで仕上げています。

## 主な機能

- Google OAuth (One Tap 対応) によるサインイン
- ガラス調のチャット画面に自動遷移
- Web 検索トグル、画像入力、ファイル添付、添付プレビュー
- メッセージ送信時のアシスタント自動レスポンス（デモ用）
- ローカルストレージによるログイン状態とチャット履歴の保持

## 環境構築

1. 依存関係をインストールします。

   ```bash
   npm install
   ```

2. Google Cloud Console で OAuth クライアント ID を作成し、`.env` ファイルに設定します。

   ```bash
   echo "VITE_GOOGLE_CLIENT_ID=xxxxxxxxxxxxxxxx.apps.googleusercontent.com" > .env
   ```

3. 開発サーバーを起動します。

   ```bash
   npm run dev
   ```

   ブラウザで `http://localhost:5173` を開くとアプリを確認できます。

## ビルド

```bash
npm run build
```

ビルド成果物は `dist/` に出力されます。`npm run preview` でローカル確認ができます。

## 注意事項

- このリポジトリにはバックエンドは含まれていません。Google の ID トークン検証はクライアント内のみで行っているため、実運用ではサーバー側検証を追加してください。
- 添付ファイルはブラウザ内のデータ URL としてのみ保持されます。サイズの大きいファイルは避けてください。
