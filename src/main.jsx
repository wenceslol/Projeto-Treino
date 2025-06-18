import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Home from './Home.jsx'
import Estatisticas from './Estatisticas.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Profile from './Profile.jsx'

const router = createBrowserRouter([
  
  {path: "/", element: <Home />},
  {path: "/treino", element: <App />},
  {path: "/estatisticas", element: <Estatisticas />},
  {path: "/profile", element: <Profile />},
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
