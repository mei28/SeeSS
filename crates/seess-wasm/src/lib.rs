//! SeeSS WASM - WebAssembly bindings for SeeSS Core
//!
//! This crate provides WASM bindings to use seess-core from JavaScript/TypeScript.

use seess_core::{analyze_css, CssAnalysis};
use wasm_bindgen::prelude::*;

/// Analyze CSS and return the result as a JavaScript object
///
/// # Arguments
/// * `input` - CSS string to analyze
///
/// # Returns
/// * JavaScript object with selector_count, rule_count, and property_count
#[wasm_bindgen]
pub fn analyze_css_js(input: &str) -> Result<JsValue, JsValue> {
    let analysis: CssAnalysis = analyze_css(input);
    serde_wasm_bindgen::to_value(&analysis).map_err(|e| JsValue::from_str(&e.to_string()))
}

/// Get the version of the WASM module
#[wasm_bindgen]
pub fn get_version() -> String {
    env!("CARGO_PKG_VERSION").to_string()
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_analyze_css_js_basic() {
        // Basic smoke test - detailed testing is in seess-core
        let css = "body { color: red; }";
        let result = analyze_css(css);
        assert_eq!(result.rule_count, 1);
    }
}
