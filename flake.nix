{
  description = "SeeSS - HTML/CSS real-time preview desktop app";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = import nixpkgs {
          inherit system;
        };

        version = "0.1.0";

        # Common build inputs for development
        commonBuildInputs = with pkgs; [
          cargo
          rustc
          rust-analyzer
          rustfmt
          clippy
          wasm-pack
          nodejs_22
          pnpm
          just
          pkg-config
        ];

        # Platform-specific dependencies (Linux only)
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


      in
      {
        # Development shell
        devShells.default = pkgs.mkShell {
          buildInputs = commonBuildInputs ++ linuxBuildInputs;

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

      }
    );
}
