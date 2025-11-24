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
        darwinBuildInputs = with pkgs; pkgs.lib.optionals pkgs.stdenv.isDarwin [
          darwin.apple_sdk.frameworks.WebKit
          darwin.apple_sdk.frameworks.AppKit
          darwin.apple_sdk.frameworks.Security
          darwin.apple_sdk.frameworks.CoreServices
          darwin.apple_sdk.frameworks.CoreFoundation
        ];

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

        # Pre-built binary package (downloads from GitHub Releases)
        seess-bin = pkgs.stdenv.mkDerivation rec {
          pname = "seess";
          inherit version;

          # Adjust these URLs when you create GitHub releases
          src = if pkgs.stdenv.isDarwin then
            if pkgs.stdenv.isAarch64 then
              pkgs.fetchurl {
                url = "https://github.com/mei/SeeSS/releases/download/v${version}/SeeSS_${version}_aarch64.dmg";
                sha256 = pkgs.lib.fakeSha256; # Update after first release
              }
            else
              pkgs.fetchurl {
                url = "https://github.com/mei/SeeSS/releases/download/v${version}/SeeSS_${version}_x64.dmg";
                sha256 = pkgs.lib.fakeSha256;
              }
          else
            pkgs.fetchurl {
              url = "https://github.com/mei/SeeSS/releases/download/v${version}/seess_${version}_amd64.AppImage";
              sha256 = pkgs.lib.fakeSha256;
            };

          # macOS: Extract from DMG
          nativeBuildInputs = pkgs.lib.optionals pkgs.stdenv.isDarwin [ pkgs.undmg ];

          unpackPhase = if pkgs.stdenv.isDarwin then ''
            undmg $src
          '' else ''
            cp $src seess.AppImage
            chmod +x seess.AppImage
          '';

          installPhase = if pkgs.stdenv.isDarwin then ''
            mkdir -p $out/Applications
            cp -r *.app $out/Applications/

            mkdir -p $out/bin
            ln -s "$out/Applications/SeeSS.app/Contents/MacOS/SeeSS" $out/bin/seess
          '' else ''
            mkdir -p $out/bin
            cp seess.AppImage $out/bin/seess
          '';

          meta = with pkgs.lib; {
            description = "HTML/CSS real-time preview desktop app";
            homepage = "https://github.com/mei/SeeSS";
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

        # Install from GitHub releases: nix profile install github:mei/SeeSS
        packages.default = seess-bin;

        # Run directly: nix run github:mei/SeeSS
        apps.default = {
          type = "app";
          program = "${seess-bin}/bin/seess";
        };
      }
    );
}
