import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';

// Importación de las páginas principales
import Home from './pages/home';
import Calendar from './pages/calendar';
import LiveMatch from './pages/LiveMatch';
import Standings from './pages/Standings';
import ClubProfile from './pages/ClubProfile';

function App() {
  return (
    <Router>
      {/* CAMBIO CLAVE: "overflow-x-hidden" 
         Esto corta cualquier elemento que sea más ancho que la pantalla del celular 
         (como tablas grandes) evitando que toda la web se vea pequeña o "aplastada".
      */}
      <div className="min-h-screen bg-gray-50 flex flex-col w-full overflow-x-hidden">
        <Navbar />
        
        {/* Agregado w-full para asegurar que tome el ancho disponible */}
        <main className="flex-grow container mx-auto px-4 py-6 w-full">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/calendario" element={<Calendar />} />
            <Route path="/en-vivo" element={<LiveMatch />} />
            <Route path="/posiciones" element={<Standings />} />
            <Route path="/club/:id" element={<ClubProfile />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;