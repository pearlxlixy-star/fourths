import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App'
import { APP_NAME } from './config'
import './index.css'
import { StoreProvider } from './state/store'

document.title = APP_NAME

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <StoreProvider>
      <App />
    </StoreProvider>
  </StrictMode>,
)
