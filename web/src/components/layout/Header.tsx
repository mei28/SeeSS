import { Button } from '@/components/ui/button'
import { Moon, Sun, Undo2, Redo2, RotateCcw } from 'lucide-react'

type HeaderProps = {
  theme: 'light' | 'dark'
  onThemeToggle: () => void
  canUndo: boolean
  canRedo: boolean
  onUndo: () => void
  onRedo: () => void
  onReset: () => void
}

export function Header({
  theme,
  onThemeToggle,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onReset,
}: HeaderProps) {
  return (
    <header className="flex h-12 items-center justify-between border-b border-border px-4">
      <h1 className="text-lg font-semibold">SeeSS</h1>
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          onClick={onUndo}
          disabled={!canUndo}
          aria-label="Undo (Ctrl+Z)"
          title="Undo (Ctrl+Z)"
        >
          <Undo2 className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={onRedo}
          disabled={!canRedo}
          aria-label="Redo (Ctrl+Shift+Z)"
          title="Redo (Ctrl+Shift+Z)"
        >
          <Redo2 className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={onReset}
          aria-label="Reset"
          title="Reset to default"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
        <div className="mx-2 h-6 w-px bg-border" />
        <Button
          variant="ghost"
          size="icon"
          onClick={onThemeToggle}
          aria-label="Toggle theme"
        >
          {theme === 'light' ? (
            <Moon className="h-5 w-5" />
          ) : (
            <Sun className="h-5 w-5" />
          )}
        </Button>
      </div>
    </header>
  )
}
