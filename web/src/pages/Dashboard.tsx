import { Link } from 'react-router-dom';

export function Dashboard() {
  return (
    <div className="page">
      <h2 className="heading">Dashboard</h2>
      
      <div className="stats-grid">
        <div className="stat-card">
          <h3 className="stat-card__title">Total Plans</h3>
          <p className="stat-card__value stat-card__value--primary">0</p>
        </div>
        
        <div className="stat-card">
          <h3 className="stat-card__title">Active Users</h3>
          <p className="stat-card__value stat-card__value--success">0</p>
        </div>
        
        <div className="stat-card">
          <h3 className="stat-card__title">Invitations Sent</h3>
          <p className="stat-card__value stat-card__value--info">0</p>
        </div>
      </div>

      <div style={{ marginTop: 'var(--space-6)' }}>
        <Link to="/plans" className="btn-primary">
          View All Plans
        </Link>
      </div>
    </div>
  );
}
