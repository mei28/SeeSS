{
  description = "SeeSS - HTML/CSS real-time preview desktop app";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
    rust-overlay = {
      url = "github:oxalica/rust-overlay";
      inputs.nixpkgs.follows = "nixpkgs";
    };
  };

  outputs = { self, nixpkgs, flake-utils, rust-overlay }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        overlays = [ (import rust-overlay) ];
        pkgs = import nixpkgs {
          inherit system overlays;
        };

        version = "0.1.0";

        rustToolchain = pkgs.rust-bin.stable.latest.default.override {
          extensions = [ "rust-src" "rust-analyzer" ];
          targets = [ "wasm32-unknown-unknown" ];
        };

        # Common build inputs for development
        commonBuildInputs = with pkgs; [
          rustToolchain
          wasm-pack
          nodejs_22
          pnpm
          just
          pkg-config
          cargo-tauri
        ];

        # Platform-specific dependencies
        darwinBuildInputs = with pkgs; pkgs.lib.optionals pkgs.stdenv.isDarwin (
          with pkgs.darwin.apple_sdk.frameworks; [
            WebKit
            AppKit
            Security
            CoreServices
            CoreFoundation
          ]
        );

        linuxBuildInputs = with pkgs; pkgs.lib.optionals pkgs.stdenv.isLinux [
          webkitgtk_4_1
          gtk3
          glib
          glib-networking
          libsoup_3
          openssl
          librsvg
          gsettings-desktop-schemas
        ];

        # Build from source
        seess = pkgs.stdenv.mkDerivation rec {
          pname = "seess";
          inherit version;

          src = self;

          nativeBuildInputs = commonBuildInputs ++ darwinBuildInputs ++ linuxBuildInputs;

          buildPhase = ''
            export HOME=$TMPDIR
            export PNPM_HOME="$HOME/.local/share/pnpm"
            export PATH="$PNPM_HOME:$PATH"

            # Build WASM
            cd crates/seess-wasm
            wasm-pack build --target web --out-dir ../../web/src/wasm
            cd ../..

            # Install and build web
            cd web
            pnpm install --frozen-lockfile
            pnpm build
            cd ..

            # Build Tauri app
            cargo tauri build --bundles app
          '';

          installPhase = if pkgs.stdenv.isDarwin then ''
            mkdir -p $out/Applications
            cp -r src-tauri/target/release/bundle/macos/*.app $out/Applications/

            mkdir -p $out/bin
            ln -s "$out/Applications/SeeSS.app/Contents/MacOS/SeeSS" $out/bin/seess
          '' else ''
            mkdir -p $out/bin
            cp src-tauri/target/release/seess-desktop $out/bin/seess
          '';

          meta = with pkgs.lib; {
            description = "HTML/CSS real-time preview desktop app";
            homepage = "https://github.com/mei28/SeeSS";
            license = licenses.mit;
            platforms = [ "x86_64-linux" "aarch64-linux" "x86_64-darwin" "aarch64-darwin" ];
            mainProgram = "seess";
          };
        };

      in
      {
        # Development shell
        devShells.default = pkgs.mkShell {
          buildInputs = commonBuildInputs ++ darwinBuildInputs ++ linuxBuildInputs;

          shellHook = ''
            echo "╔════════════════════════════════════════╗"
            echo "║     SeeSS Development Environment      ║"
            echo "╚════════════════════════════════════════╝"
            echo ""
            echo "Commands:"
            echo "  just dev-web      Start web dev server"
            echo "  just dev-tauri    Start Tauri dev mode"
            echo "  just build-tauri  Build Tauri app for release"
            echo ""
          '';

          LD_LIBRARY_PATH = pkgs.lib.optionalString pkgs.stdenv.isLinux
            (pkgs.lib.makeLibraryPath linuxBuildInputs);
        };

        # Install from source: nix profile install github:mei28/SeeSS
        packages.default = seess;

        # Run directly: nix run github:mei28/SeeSS
        apps.default = {
          type = "app";
          program = "${seess}/bin/seess";
        };
      }
    );
}
