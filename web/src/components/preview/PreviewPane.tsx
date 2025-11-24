import { useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Moon, Sun, Smartphone, Tablet, Monitor } from 'lucide-react'

type PreviewPaneProps = {
  html: string
  css: string
}

type ViewportPreset = 'mobile' | 'tablet' | 'desktop'

const viewportWidths: Record<ViewportPreset, string> = {
  mobile: '375px',
  tablet: '768px',
  desktop: '100%',
}

export function PreviewPane({ html, css }: PreviewPaneProps) {
  const [previewTheme, setPreviewTheme] = useState<'light' | 'dark'>('light')
  const [viewport, setViewport] = useState<ViewportPreset>('desktop')

  const srcdoc = useMemo(() => {
    const themeStyles =
      previewTheme === 'dark'
        ? `
      html {
        color-scheme: dark;
      }
      body {
        background-color: #1a1a1a;
        color: #e5e5e5;
      }
    `
        : ''

    return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      ${themeStyles}
      ${css}
    </style>
  </head>
  <body>
    ${html}
  </body>
</html>`
  }, [html, css, previewTheme])

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-border px-3 py-2">
        <span className="text-sm font-medium text-muted-foreground">
          Preview
        </span>
        <div className="flex items-center gap-1">
          <div className="flex items-center rounded-md border border-border">
            <Button
              variant={viewport === 'mobile' ? 'secondary' : 'ghost'}
              size="icon"
              className="h-7 w-7 rounded-r-none"
              onClick={() => setViewport('mobile')}
              title="Mobile (375px)"
            >
              <Smartphone className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant={viewport === 'tablet' ? 'secondary' : 'ghost'}
              size="icon"
              className="h-7 w-7 rounded-none border-x border-border"
              onClick={() => setViewport('tablet')}
              title="Tablet (768px)"
            >
              <Tablet className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant={viewport === 'desktop' ? 'secondary' : 'ghost'}
              size="icon"
              className="h-7 w-7 rounded-l-none"
              onClick={() => setViewport('desktop')}
              title="Desktop (100%)"
            >
              <Monitor className="h-3.5 w-3.5" />
            </Button>
          </div>
          <div className="mx-1 h-5 w-px bg-border" />
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() =>
              setPreviewTheme((prev) => (prev === 'light' ? 'dark' : 'light'))
            }
            title={`Preview: ${previewTheme === 'light' ? 'Light' : 'Dark'} mode`}
          >
            {previewTheme === 'light' ? (
              <Sun className="h-3.5 w-3.5" />
            ) : (
              <Moon className="h-3.5 w-3.5" />
            )}
          </Button>
        </div>
      </div>
      <div className="flex flex-1 items-start justify-center overflow-auto bg-slate-100 p-4 dark:bg-slate-800">
        <div
          className="h-full transition-all duration-200"
          style={{ width: viewportWidths[viewport] }}
        >
          <iframe
            srcDoc={srcdoc}
            sandbox="allow-scripts"
            title="Preview"
            className="h-full w-full border border-border bg-white shadow-sm"
          />
        </div>
      </div>
    </div>
  )
}
