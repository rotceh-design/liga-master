import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';

import Home from './pages/home';
import Calendar from './pages/calendar';
import LiveMatch from './pages/LiveMatch';
import Standings from './pages/Standings';
import ClubProfile from './pages/ClubProfile';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col w-full overflow-x-hidden">
        <Navbar />

        <main className="flex-grow w-full">
          <Routes>
            <Route path="/" element={
              <div className="container mx-auto px-4 py-6">
                <Home />
              </div>
            } />
            <Route path="/calendario" element={
              <div className="container mx-auto px-4 py-6">
                <Calendar />
              </div>
            } />
            {/* LiveMatch fuera del container para que use h-screen completo */}
            <Route path="/en-vivo" element={<LiveMatch />} />
            <Route path="/posiciones" element={
              <div className="container mx-auto px-4 py-6">
                <Standings />
              </div>
            } />
            <Route path="/club/:id" element={
              <div className="container mx-auto px-4 py-6">
                <ClubProfile />
              </div>
            } />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;