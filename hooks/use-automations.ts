// Custom hook for fetching automation actions

import useSWR from "swr"
import { getAutomations } from "@/lib/api/workflow-api"
import type { AutomationAction } from "@/types/workflow"

export function useAutomations() {
  const { data, error, isLoading } = useSWR<AutomationAction[]>("automations", getAutomations, {
    revalidateOnFocus: false,
    dedupingInterval: 60000,
  })

  return {
    automations: data || [],
    isLoading,
    error,
  }
}
