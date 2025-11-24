import { useState, useEffect, useCallback } from 'react'
import type { CssAnalysis } from '@/components/sidebar'

type WasmModule = {
  analyze_css_js: (input: string) => {
    selector_count: number
    rule_count: number
    property_count: number
  }
  get_version: () => string
}

type UseWasmResult = {
  isLoading: boolean
  error: string | null
  analyzeCss: (input: string) => CssAnalysis | null
  version: string | null
}

export function useWasm(): UseWasmResult {
  const [wasm, setWasm] = useState<WasmModule | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [version, setVersion] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true

    async function loadWasm() {
      try {
        const wasmModule = await import('@/wasm/seess_wasm.js')
        await wasmModule.default()

        if (mounted) {
          setWasm(wasmModule as unknown as WasmModule)
          setVersion(wasmModule.get_version())
          setIsLoading(false)
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Failed to load WASM')
          setIsLoading(false)
        }
      }
    }

    loadWasm()

    return () => {
      mounted = false
    }
  }, [])

  const analyzeCss = useCallback(
    (input: string): CssAnalysis | null => {
      if (!wasm) return null

      try {
        const result = wasm.analyze_css_js(input)
        return {
          selectorCount: result.selector_count,
          ruleCount: result.rule_count,
          propertyCount: result.property_count,
        }
      } catch {
        return null
      }
    },
    [wasm]
  )

  return { isLoading, error, analyzeCss, version }
}
