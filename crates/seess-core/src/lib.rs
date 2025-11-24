//! SeeSS Core - CSS Analysis Library
//!
//! This crate provides CSS parsing and analysis functionality.

use serde::{Deserialize, Serialize};

/// Result of CSS analysis
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
pub struct CssAnalysis {
    /// Number of CSS selectors found
    pub selector_count: u32,
    /// Number of CSS rules (selector blocks) found
    pub rule_count: u32,
    /// Number of CSS properties found
    pub property_count: u32,
}

/// Analyze CSS input and return statistics
///
/// # Arguments
/// * `input` - CSS string to analyze
///
/// # Returns
/// * `CssAnalysis` - Analysis result containing counts
///
/// # Example
/// ```
/// use seess_core::analyze_css;
///
/// let css = "body { color: red; } .container { margin: 0; padding: 10px; }";
/// let result = analyze_css(css);
/// assert_eq!(result.rule_count, 2);
/// ```
pub fn analyze_css(input: &str) -> CssAnalysis {
    let mut analysis = CssAnalysis::default();

    // Simple parsing: count rules by counting '{' that start a rule block
    let mut in_block = false;
    let mut brace_depth: u32 = 0;
    let mut current_selectors = String::new();

    for ch in input.chars() {
        match ch {
            '{' => {
                if brace_depth == 0 {
                    // Starting a new rule block
                    in_block = true;
                    analysis.rule_count += 1;

                    // Count selectors (split by comma)
                    let selectors: Vec<&str> = current_selectors
                        .split(',')
                        .map(|s| s.trim())
                        .filter(|s| !s.is_empty())
                        .collect();
                    analysis.selector_count += selectors.len() as u32;
                    current_selectors.clear();
                }
                brace_depth += 1;
            }
            '}' => {
                brace_depth = brace_depth.saturating_sub(1);
                if brace_depth == 0 {
                    in_block = false;
                }
            }
            ';' if in_block && brace_depth == 1 => {
                // Count property declarations
                analysis.property_count += 1;
            }
            _ if !in_block => {
                current_selectors.push(ch);
            }
            _ => {}
        }
    }

    analysis
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_empty_css() {
        let result = analyze_css("");
        assert_eq!(result.selector_count, 0);
        assert_eq!(result.rule_count, 0);
        assert_eq!(result.property_count, 0);
    }

    #[test]
    fn test_single_rule() {
        let css = "body { color: red; }";
        let result = analyze_css(css);
        assert_eq!(result.selector_count, 1);
        assert_eq!(result.rule_count, 1);
        assert_eq!(result.property_count, 1);
    }

    #[test]
    fn test_multiple_rules() {
        let css = "body { color: red; } .container { margin: 0; padding: 10px; }";
        let result = analyze_css(css);
        assert_eq!(result.selector_count, 2);
        assert_eq!(result.rule_count, 2);
        assert_eq!(result.property_count, 3);
    }

    #[test]
    fn test_multiple_selectors() {
        let css = "h1, h2, h3 { font-weight: bold; }";
        let result = analyze_css(css);
        assert_eq!(result.selector_count, 3);
        assert_eq!(result.rule_count, 1);
        assert_eq!(result.property_count, 1);
    }

    #[test]
    fn test_nested_at_rules() {
        let css = "@media (max-width: 600px) { .container { width: 100%; } }";
        let result = analyze_css(css);
        // This simple parser counts the outer @media and inner rule
        assert!(result.rule_count >= 1);
    }
}
