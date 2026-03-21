import { Routes, Route } from 'react-router-dom';
import { Dashboard } from './pages/Dashboard';
import { Plans } from './pages/Plans';

export function App() {
  return (
    <div style={{ minHeight: '100vh' }}>
      <nav className="nav">
        <div className="nav__container">
          <h1 className="nav__title">Anong Ganap? Admin</h1>
        </div>
      </nav>
      
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/plans" element={<Plans />} />
      </Routes>
    </div>
  );
}
