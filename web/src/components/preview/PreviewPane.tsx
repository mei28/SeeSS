import { useMemo } from 'react'

type PreviewPaneProps = {
  html: string
  css: string
}

export function PreviewPane({ html, css }: PreviewPaneProps) {
  const srcdoc = useMemo(() => {
    return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      ${css}
    </style>
  </head>
  <body>
    ${html}
  </body>
</html>`
  }, [html, css])

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-border px-3 py-2">
        <span className="text-sm font-medium text-muted-foreground">
          Preview
        </span>
      </div>
      <div className="flex-1 bg-white">
        <iframe
          srcDoc={srcdoc}
          sandbox="allow-scripts"
          title="Preview"
          className="h-full w-full border-none"
        />
      </div>
    </div>
  )
}
