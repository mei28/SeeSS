import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable'
import { CssEditor, HtmlEditor } from '@/components/editor'
import { PreviewPane } from '@/components/preview'
import { AnalysisPanel, type CssAnalysis } from '@/components/sidebar'

type MainLayoutProps = {
  css: string
  html: string
  debouncedCss: string
  debouncedHtml: string
  analysis: CssAnalysis | null
  analysisLoading?: boolean
  analysisError?: string | null
  theme?: 'light' | 'dark'
  onCssChange: (value: string) => void
  onHtmlChange: (value: string) => void
}

export function MainLayout({
  css,
  html,
  debouncedCss,
  debouncedHtml,
  analysis,
  analysisLoading,
  analysisError,
  theme = 'light',
  onCssChange,
  onHtmlChange,
}: MainLayoutProps) {
  return (
    <ResizablePanelGroup direction="horizontal" className="h-full">
      {/* Left: Editors */}
      <ResizablePanel defaultSize={40} minSize={20}>
        <ResizablePanelGroup direction="vertical">
          <ResizablePanel defaultSize={50} minSize={20}>
            <CssEditor value={css} onChange={onCssChange} theme={theme} />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={50} minSize={20}>
            <HtmlEditor value={html} onChange={onHtmlChange} theme={theme} />
          </ResizablePanel>
        </ResizablePanelGroup>
      </ResizablePanel>

      <ResizableHandle withHandle />

      {/* Right: Preview + Analysis */}
      <ResizablePanel defaultSize={60} minSize={30}>
        <ResizablePanelGroup direction="vertical">
          <ResizablePanel defaultSize={75} minSize={30}>
            <PreviewPane html={debouncedHtml} css={debouncedCss} />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={25} minSize={15}>
            <AnalysisPanel
              analysis={analysis}
              isLoading={analysisLoading}
              error={analysisError}
            />
          </ResizablePanel>
        </ResizablePanelGroup>
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}
