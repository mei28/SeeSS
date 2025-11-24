import { useCallback, type KeyboardEvent } from 'react'

type CssEditorProps = {
  value: string
  onChange: (value: string) => void
}

export function CssEditor({ value, onChange }: CssEditorProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Tab') {
        e.preventDefault()
        const target = e.currentTarget
        const start = target.selectionStart
        const end = target.selectionEnd

        const newValue = value.substring(0, start) + '  ' + value.substring(end)
        onChange(newValue)

        requestAnimationFrame(() => {
          target.selectionStart = target.selectionEnd = start + 2
        })
      }
    },
    [value, onChange]
  )

  return (
    <div className="flex h-full flex-col">
      <div className="flex shrink-0 items-center justify-between border-b border-border px-3 py-2">
        <span className="text-sm font-medium text-muted-foreground">CSS</span>
      </div>
      <textarea
        className="flex-1 resize-none bg-background p-3 font-mono text-sm focus:outline-none"
        placeholder="/* Write your CSS here */"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        spellCheck={false}
      />
    </div>
  )
}
