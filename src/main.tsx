import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App'
import { APP_NAME } from './config'
// Fonts ship with the app, so the pixel look works offline too.
import '@fontsource/press-start-2p/latin-400.css'
import '@fontsource/vt323/latin-400.css'
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
