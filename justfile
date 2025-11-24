# SeeSS Development Commands
# Usage: just <command>

# Default command - show help
default:
    @just --list

# ===== Rust Commands =====

# Build all Rust crates
build-rust:
    cargo build

# Run Rust tests
test-rust:
    cargo test

# Build WASM package
build-wasm:
    cd crates/seess-wasm && wasm-pack build --target web --out-dir ../../web/src/wasm

# ===== Web Frontend Commands =====

# Install web dependencies
install-web:
    cd web && pnpm install

# Start web development server
dev-web:
    cd web && pnpm dev

# Build web for production
build-web:
    cd web && pnpm build

# Run web linting
lint-web:
    cd web && pnpm lint

# ===== Combined Commands =====

# Install all dependencies
install: install-web

# Build everything (Rust + WASM + Web)
build-all: build-rust build-wasm build-web

# Run all tests
test: test-rust

# Development mode (web only for now)
dev: dev-web

# Clean all build artifacts
clean:
    cargo clean
    rm -rf web/dist
    rm -rf web/node_modules

# ===== Tauri Commands (for future use) =====

# Start Tauri development
dev-tauri:
    cd desktop-tauri && cargo tauri dev

# Build Tauri application
build-tauri:
    cd desktop-tauri && cargo tauri build
