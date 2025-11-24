import { Button } from '@/components/ui/button'
import { Moon, Sun } from 'lucide-react'

type HeaderProps = {
  theme: 'light' | 'dark'
  onThemeToggle: () => void
}

export function Header({ theme, onThemeToggle }: HeaderProps) {
  return (
    <header className="flex h-12 items-center justify-between border-b border-border px-4">
      <h1 className="text-lg font-semibold">SeeSS</h1>
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
    </header>
  )
}
