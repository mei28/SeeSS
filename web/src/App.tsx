import { useState, useEffect, useCallback } from 'react'
import { Header, MainLayout } from '@/components/layout'
import { useDebounce, useHistory, useLocalStorage, useWasm } from '@/hooks'
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

const STORAGE_KEYS = {
  css: 'seess-css',
  html: 'seess-html',
  theme: 'seess-theme',
} as const

type EditorState = {
  css: string
  html: string
}

function App() {
  const [storedState, setStoredState] = useLocalStorage<EditorState>(
    'seess-editor-state',
    { css: DEFAULT_CSS, html: DEFAULT_HTML }
  )

  const [theme, setTheme] = useLocalStorage<'light' | 'dark'>(
    STORAGE_KEYS.theme,
    'light'
  )

  const cssHistory = useHistory(
    storedState.css,
    storedState.css,
    useCallback(
      (css: string) => setStoredState((prev) => ({ ...prev, css })),
      [setStoredState]
    )
  )

  const htmlHistory = useHistory(
    storedState.html,
    storedState.html,
    useCallback(
      (html: string) => setStoredState((prev) => ({ ...prev, html })),
      [setStoredState]
    )
  )

  const [analysis, setAnalysis] = useState<CssAnalysis | null>(null)

  const debouncedCss = useDebounce(cssHistory.value, 200)
  const debouncedHtml = useDebounce(htmlHistory.value, 200)

  const { isLoading: wasmLoading, error: wasmError, analyzeCss } = useWasm()

  const handleThemeToggle = useCallback(() => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))
  }, [setTheme])

  const handleUndo = useCallback(() => {
    cssHistory.undo()
    htmlHistory.undo()
  }, [cssHistory, htmlHistory])

  const handleRedo = useCallback(() => {
    cssHistory.redo()
    htmlHistory.redo()
  }, [cssHistory, htmlHistory])

  const handleReset = useCallback(() => {
    cssHistory.reset(DEFAULT_CSS)
    htmlHistory.reset(DEFAULT_HTML)
  }, [cssHistory, htmlHistory])

  // Keyboard shortcuts for undo/redo
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMod = e.metaKey || e.ctrlKey
      if (isMod && e.key === 'z' && !e.shiftKey) {
        e.preventDefault()
        handleUndo()
      } else if (isMod && e.key === 'z' && e.shiftKey) {
        e.preventDefault()
        handleRedo()
      } else if (isMod && e.key === 'y') {
        e.preventDefault()
        handleRedo()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleUndo, handleRedo])

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [theme])

  useEffect(() => {
    if (!wasmLoading && !wasmError) {
      const result = analyzeCss(debouncedCss)
      setAnalysis(result)
    }
  }, [debouncedCss, wasmLoading, wasmError, analyzeCss])

  return (
    <div className="flex h-screen flex-col bg-background">
      <Header
        theme={theme}
        onThemeToggle={handleThemeToggle}
        canUndo={cssHistory.canUndo || htmlHistory.canUndo}
        canRedo={cssHistory.canRedo || htmlHistory.canRedo}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onReset={handleReset}
      />
      <main className="flex-1 overflow-hidden">
        <MainLayout
          css={cssHistory.value}
          html={htmlHistory.value}
          debouncedCss={debouncedCss}
          debouncedHtml={debouncedHtml}
          analysis={analysis}
          analysisLoading={wasmLoading}
          analysisError={wasmError}
          theme={theme}
          onCssChange={cssHistory.setValue}
          onHtmlChange={htmlHistory.setValue}
        />
      </main>
    </div>
  )
}

export default App
