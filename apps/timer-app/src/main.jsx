import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import CssBaseline from '@mui/material/CssBaseline'; // Import CssBaseline for consistent styling
import App from './App.jsx'
import Layout from './components/Layout.jsx'; // Import the Layout component
import { BrowserRouter } from 'react-router-dom';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <CssBaseline /> {/* Apply global CSS reset */}
      <Layout>
        <App />
      </Layout>
    </BrowserRouter>
  </StrictMode>,
)
