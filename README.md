# SeeSS

> HTML/CSS をリアルタイムにプレビューできるデスクトップアプリ

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Platform](https://img.shields.io/badge/platform-macOS%20%7C%20Linux%20%7C%20Windows-lightgrey)

## 概要

SeeSS（シース）は、HTML と CSS を入力するとリアルタイムでプレビューを確認できるアプリケーションです。CSS の学習やデザインの試行錯誤に最適です。

### 特徴

- リアルタイムプレビュー（200ms debounce）
- シンタックスハイライト（CodeMirror 6）
- ダーク/ライトテーマ
- プレビュー内テーマ切り替え（アプリとは独立）
- ビューポート切り替え（Mobile / Tablet / Desktop）
- Undo/Redo（Cmd/Ctrl+Z, Cmd/Ctrl+Shift+Z）
- 入力内容の自動保存（localStorage）
- CSS 解析（セレクタ数、ルール数、プロパティ数）

## インストール

### Nix（推奨）

```bash
# 直接実行
nix run github:mei28/SeeSS

# プロファイルにインストール
nix profile install github:mei28/SeeSS
```

### GitHub Releases

[Releases](https://github.com/mei28/SeeSS/releases) から各プラットフォーム向けのバイナリをダウンロード:

| Platform | File |
|----------|------|
| macOS (Apple Silicon) | `SeeSS_x.x.x_aarch64.dmg` |
| macOS (Intel) | `SeeSS_x.x.x_x64.dmg` |
| Linux | `seess_x.x.x_amd64.AppImage` |
| Windows | `SeeSS_x.x.x_x64-setup.exe` |

### ソースからビルド

```bash
# リポジトリをクローン
git clone https://github.com/mei28/SeeSS.git
cd SeeSS

# Nix 開発環境に入る
nix develop

# または手動で依存関係をインストール
# - Rust (1.77+)
# - Node.js (22+)
# - pnpm
# - wasm-pack

# WASM をビルド
just build-wasm

# Tauri アプリをビルド
just build-tauri

# macOS: アプリを開く
open src-tauri/target/release/bundle/macos/SeeSS.app
```

## 開発

### 必要なツール

- Rust 1.77+
- Node.js 22+
- pnpm
- wasm-pack
- Tauri CLI

### Nix を使う場合

```bash
nix develop
```

これで必要なツールがすべて揃った開発環境に入れます。

### コマンド

```bash
# Web 開発サーバー起動
just dev-web

# Tauri 開発モード（ホットリロード付き）
just dev-tauri

# WASM ビルド
just build-wasm

# Tauri アプリビルド
just build-tauri

# Rust テスト
just test-rust
```

### プロジェクト構成

```
SeeSS/
├── crates/
│   ├── seess-core/      # Rust コアロジック（CSS 解析）
│   └── seess-wasm/      # WASM ラッパー
├── src-tauri/           # Tauri デスクトップアプリ
├── web/                 # React フロントエンド
│   ├── src/
│   │   ├── components/  # UI コンポーネント
│   │   └── hooks/       # カスタムフック
│   └── package.json
├── flake.nix            # Nix Flake
└── justfile             # タスクランナー
```

## 技術スタック

| Layer | Technology |
|-------|------------|
| Frontend | React, TypeScript, Tailwind CSS v4, shadcn/ui |
| Editor | CodeMirror 6 |
| Core Logic | Rust (seess-core) |
| WASM | wasm-pack, wasm-bindgen |
| Desktop | Tauri v2 |
| Package Manager | pnpm |

## キーボードショートカット

| Action | Shortcut |
|--------|----------|
| Undo | `Cmd/Ctrl + Z` |
| Redo | `Cmd/Ctrl + Shift + Z` または `Cmd/Ctrl + Y` |

## リリース

タグをプッシュすると GitHub Actions が自動でビルド・リリースします:

```bash
git tag v0.1.0
git push origin v0.1.0
```

## ライセンス

MIT License - 詳細は [LICENSE](LICENSE) を参照してください。

## 貢献

Issue や Pull Request は歓迎です。

1. Fork する
2. Feature branch を作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'feat: add amazing feature'`)
4. Branch を push (`git push origin feature/amazing-feature`)
5. Pull Request を作成
