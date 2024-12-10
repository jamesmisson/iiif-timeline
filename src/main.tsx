import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import AppThree from './AppThree.tsx'
import './index.css'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"

const queryClient = new QueryClient()

createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AppThree />
      <ReactQueryDevtools />
    </QueryClientProvider>
  </StrictMode>,
)
