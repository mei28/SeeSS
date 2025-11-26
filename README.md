# SeeSS

> Real-time HTML/CSS preview desktop application

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Platform](https://img.shields.io/badge/platform-macOS%20%7C%20Linux%20%7C%20Windows-lightgrey)

## Overview

SeeSS is a desktop application that provides real-time preview of HTML and CSS as you type. Perfect for learning CSS and experimenting with designs.

### Features

- Real-time preview (200ms debounce)
- Syntax highlighting (CodeMirror 6)
- Dark/Light theme support
- Independent preview theme switching
- Viewport switching (Mobile / Tablet / Desktop)
- Undo/Redo (Cmd/Ctrl+Z, Cmd/Ctrl+Shift+Z)
- Auto-save (localStorage)
- CSS analysis (selector count, rule count, property count)

## Installation

### Nix (Recommended)

```bash
# Run directly
nix run github:mei28/SeeSS

# Install to profile
nix profile install github:mei28/SeeSS
```

### GitHub Releases

Download binaries for your platform from [Releases](https://github.com/mei28/SeeSS/releases):

| Platform | File |
|----------|------|
| macOS (Apple Silicon) | `SeeSS_x.x.x_aarch64.dmg` |
| macOS (Intel) | `SeeSS_x.x.x_x64.dmg` |
| Linux | `seess_x.x.x_amd64.AppImage` |
| Windows | `SeeSS_x.x.x_x64-setup.exe` |

### Build from Source

```bash
# Clone repository
git clone https://github.com/mei28/SeeSS.git
cd SeeSS

# Enter Nix development environment
nix develop

# Or manually install dependencies:
# - Rust (1.77+)
# - Node.js (22+)
# - pnpm
# - wasm-pack

# Build WASM
just build-wasm

# Build Tauri app
just build-tauri

# macOS: Open the app
open src-tauri/target/release/bundle/macos/SeeSS.app
```

## Development

### Requirements

- Rust 1.77+
- Node.js 22+
- pnpm
- wasm-pack
- Tauri CLI

### Using Nix

```bash
nix develop
```

This provides a complete development environment with all required tools.

### Commands

```bash
# Start web development server
just dev-web

# Start Tauri development mode (with hot reload)
just dev-tauri

# Build WASM
just build-wasm

# Build Tauri app
just build-tauri

# Run Rust tests
just test-rust
```

### Project Structure

```
SeeSS/
├── crates/
│   ├── seess-core/      # Rust core logic (CSS analysis)
│   └── seess-wasm/      # WASM wrapper
├── src-tauri/           # Tauri desktop app
├── web/                 # React frontend
│   ├── src/
│   │   ├── components/  # UI components
│   │   └── hooks/       # Custom hooks
│   └── package.json
├── flake.nix            # Nix Flake
└── justfile             # Task runner
```

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React, TypeScript, Tailwind CSS v4, shadcn/ui |
| Editor | CodeMirror 6 |
| Core Logic | Rust (seess-core) |
| WASM | wasm-pack, wasm-bindgen |
| Desktop | Tauri v2 |
| Package Manager | pnpm |

## Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| Undo | `Cmd/Ctrl + Z` |
| Redo | `Cmd/Ctrl + Shift + Z` or `Cmd/Ctrl + Y` |

## Release

GitHub Actions automatically builds and releases when you push a tag:

```bash
git tag v0.1.0
git push origin v0.1.0
```

## License

MIT License - see [LICENSE](LICENSE) for details.

## Contributing

Issues and Pull Requests are welcome!

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Create a Pull Request
