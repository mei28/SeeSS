use seess_core::{analyze_css, CssAnalysis};

#[tauri::command]
fn analyze_css_command(input: &str) -> CssAnalysis {
    analyze_css(input)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .setup(|app| {
            if cfg!(debug_assertions) {
                app.handle().plugin(
                    tauri_plugin_log::Builder::default()
                        .level(log::LevelFilter::Info)
                        .build(),
                )?;
            }
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![analyze_css_command])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
