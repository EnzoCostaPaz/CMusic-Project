import { BrowserRouter , Routes, Route } from 'react-router-dom';
import { Home } from './pages/home';
import { Formulario } from './pages/formulario';
import { Resultado } from './pages/resultado';
import './App.css'

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/formulario" element={<Formulario />} />
          <Route path="/resultado" element={<Resultado />} />

          {/* Pagina de não encontrado */}
          <Route path="*" element={<h1>404 - Página Não Encontrada</h1>} />
        </Routes>

    
      </BrowserRouter>
    </>
  )
}

export { App }
