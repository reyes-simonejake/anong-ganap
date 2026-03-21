import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { Dashboard } from './pages/Dashboard';
import { Plans } from './pages/Plans';

export function App() {
  const location = useLocation();

  return (
    <div style={{ minHeight: '100vh' }}>
      <nav className="nav">
        <div className="nav__container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 className="nav__title">Anong Ganap? Admin</h1>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <Link 
              to="/" 
              style={{ 
                color: location.pathname === '/' ? 'var(--color-primary)' : 'var(--color-text-secondary)', 
                textDecoration: 'none', 
                fontWeight: 500 
              }}
            >
              Dashboard
            </Link>
            <Link 
              to="/plans" 
              style={{ 
                color: location.pathname === '/plans' ? 'var(--color-primary)' : 'var(--color-text-secondary)', 
                textDecoration: 'none', 
                fontWeight: 500 
              }}
            >
              Plans
            </Link>
          </div>
        </div>
      </nav>
      
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/plans" element={<Plans />} />
      </Routes>
    </div>
  );
}
