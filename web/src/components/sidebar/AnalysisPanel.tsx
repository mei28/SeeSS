import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export type CssAnalysis = {
  selectorCount: number
  ruleCount: number
  propertyCount: number
}

type AnalysisPanelProps = {
  analysis: CssAnalysis | null
  isLoading?: boolean
  error?: string | null
}

export function AnalysisPanel({ analysis, isLoading, error }: AnalysisPanelProps) {
  return (
    <Card className="border-0 rounded-none h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">CSS Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading && (
          <p className="text-sm text-muted-foreground">Analyzing...</p>
        )}
        {error && (
          <p className="text-sm text-destructive">{error}</p>
        )}
        {!isLoading && !error && analysis && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Selectors</span>
              <span className="font-mono">{analysis.selectorCount}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Rules</span>
              <span className="font-mono">{analysis.ruleCount}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Properties</span>
              <span className="font-mono">{analysis.propertyCount}</span>
            </div>
          </div>
        )}
        {!isLoading && !error && !analysis && (
          <p className="text-sm text-muted-foreground">
            Enter CSS to see analysis
          </p>
        )}
      </CardContent>
    </Card>
  )
}
