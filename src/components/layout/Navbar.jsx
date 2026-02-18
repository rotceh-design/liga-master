import { Link } from 'react-router-dom';
import logoLocal from '../../assets/logo.png'; // Importación desde tus assets locales

export default function Navbar() {
  return (
    <nav className="bg-blue-900 text-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo y Nombre */}
          <Link to="/" className="flex items-center space-x-3">
            <img 
              src={logoLocal} 
              alt="Logo de la Liga" 
              className="h-10 w-10 rounded-full object-cover bg-white"
              // Fallback por si la imagen no está aún en la carpeta
              onError={(e) => { e.target.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2NjYyIvPjwvc3ZnPg=='; }}
            />
            <span className="font-bold text-xl tracking-wider">Liga Máster</span>
          </Link>

          {/* Enlaces de Navegación */}
          <div className="hidden md:flex space-x-6">
            <Link to="/" className="hover:text-blue-300 transition-colors">Inicio</Link>
            <Link to="/calendario" className="hover:text-blue-300 transition-colors">Calendario</Link>
            <Link to="/en-vivo" className="hover:text-blue-300 transition-colors flex items-center">
              <span className="w-2 h-2 rounded-full bg-red-500 mr-2 animate-pulse"></span>
              En Vivo
            </Link>
            <Link to="/posiciones" className="hover:text-blue-300 transition-colors">Posiciones</Link>
          </div>

        </div>
      </div>
    </nav>
  );
}