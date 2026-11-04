import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import {createBrowserRouter} from 'react-router'
import { RouterProvider } from 'react-router'
import { routes } from './routes'

import './styles/reset.css'
import './styles/global.css'
import './styles/tokens.css'

const router = createBrowserRouter(routes)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
