import {Provider} from 'react-redux'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {store} from './redux/Store.ts'
import { Toaster } from 'sonner'

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <App />
    <Toaster richColors  position="top-right" />
  </Provider>
)
