type HtmlEditorProps = {
  value: string
  onChange: (value: string) => void
}

export function HtmlEditor({ value, onChange }: HtmlEditorProps) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex shrink-0 items-center justify-between border-b border-border px-3 py-2">
        <span className="text-sm font-medium text-muted-foreground">HTML</span>
      </div>
      <textarea
        className="flex-1 resize-none bg-background p-3 font-mono text-sm focus:outline-none"
        placeholder="<!-- Write your HTML here -->"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        spellCheck={false}
      />
    </div>
  )
}
