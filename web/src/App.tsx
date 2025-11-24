import { useState, useEffect, useCallback } from 'react'
import { Header, MainLayout } from '@/components/layout'
import { useDebounce } from '@/hooks'
import type { CssAnalysis } from '@/components/sidebar'

const DEFAULT_CSS = `/* Try editing this CSS! */
body {
  font-family: system-ui, sans-serif;
  padding: 20px;
  background: #f5f5f5;
}

.container {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

h1 {
  color: #333;
  margin-top: 0;
}

p {
  color: #666;
  line-height: 1.6;
}`

const DEFAULT_HTML = `<!-- Try editing this HTML! -->
<div class="container">
  <h1>Hello, SeeSS!</h1>
  <p>
    Edit the CSS and HTML on the left to see
    your changes in real-time.
  </p>
</div>`

function App() {
  const [css, setCss] = useState(DEFAULT_CSS)
  const [html, setHtml] = useState(DEFAULT_HTML)
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [analysis, setAnalysis] = useState<CssAnalysis | null>(null)

  const debouncedCss = useDebounce(css, 200)
  const debouncedHtml = useDebounce(html, 200)

  const handleThemeToggle = useCallback(() => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))
  }, [])

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [theme])

  // Simple CSS analysis (will be replaced by WASM in Phase 2)
  useEffect(() => {
    const analyzeCss = (input: string): CssAnalysis => {
      let selectorCount = 0
      let ruleCount = 0
      let propertyCount = 0
      let inBlock = false
      let braceDepth = 0
      let currentSelectors = ''

      for (const ch of input) {
        if (ch === '{') {
          if (braceDepth === 0) {
            inBlock = true
            ruleCount++
            const selectors = currentSelectors
              .split(',')
              .map((s) => s.trim())
              .filter((s) => s.length > 0)
            selectorCount += selectors.length
            currentSelectors = ''
          }
          braceDepth++
        } else if (ch === '}') {
          braceDepth = Math.max(0, braceDepth - 1)
          if (braceDepth === 0) {
            inBlock = false
          }
        } else if (ch === ';' && inBlock && braceDepth === 1) {
          propertyCount++
        } else if (!inBlock) {
          currentSelectors += ch
        }
      }

      return { selectorCount, ruleCount, propertyCount }
    }

    setAnalysis(analyzeCss(debouncedCss))
  }, [debouncedCss])

  return (
    <div className="flex h-screen flex-col bg-background">
      <Header theme={theme} onThemeToggle={handleThemeToggle} />
      <main className="flex-1 overflow-hidden">
        <MainLayout
          css={css}
          html={html}
          debouncedCss={debouncedCss}
          debouncedHtml={debouncedHtml}
          analysis={analysis}
          onCssChange={setCss}
          onHtmlChange={setHtml}
        />
      </main>
    </div>
  )
}

export default App
