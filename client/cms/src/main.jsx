import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import "toastify-js/src/toastify.css"
import ThemeProvider from './context/ThemeMode.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
    <App />
    </ThemeProvider>
  </StrictMode>,
)
