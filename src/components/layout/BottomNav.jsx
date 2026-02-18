import { Link, useLocation } from 'react-router-dom';
import { Home, Calendar, Radio, Trophy } from 'lucide-react';

const BottomNav = () => {
  const location = useLocation();
  
  const isActive = (path) => location.pathname === path ? 'text-blue-600' : 'text-gray-500';

  return (
    <nav style={{
      position: 'fixed', bottom: 0, width: '100%', maxWidth: '500px',
      display: 'flex', justifyContent: 'space-around', padding: '10px 0',
      background: '#fff', borderTop: '1px solid #ddd'
    }}>
      <Link to="/" className={isActive('/')}><Home size={24} /></Link>
      <Link to="/calendar" className={isActive('/calendar')}><Calendar size={24} /></Link>
      <Link to="/live" className={isActive('/live')}><Radio size={24} /></Link>
      <Link to="/standings" className={isActive('/standings')}><Trophy size={24} /></Link>
    </nav>
  );
};

export default BottomNav;