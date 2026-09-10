import { CalendarDays, LayoutDashboard, ListChecks } from 'lucide-react';
import { NavLink } from 'react-router-dom';

function getNavClass(isActive: boolean): string {
  return isActive ? 'site-nav__link--active' : 'site-nav__link';
}

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="site-header__inner">
        <NavLink className="site-header__brand" to="/">
          <span className="site-header__brand-mark">AG</span>
          <span>Anong Ganap?</span>
        </NavLink>
        <nav aria-label="Main navigation" className="site-nav">
          <NavLink aria-label="Home" className={({ isActive }) => getNavClass(isActive)} end to="/">
            <CalendarDays aria-hidden="true" />
            <span>Home</span>
          </NavLink>
          <NavLink aria-label="Dashboard" className={({ isActive }) => getNavClass(isActive)} to="/dashboard">
            <LayoutDashboard aria-hidden="true" />
            <span>Dashboard</span>
          </NavLink>
          <NavLink aria-label="Plans" className={({ isActive }) => getNavClass(isActive)} to="/plans">
            <ListChecks aria-hidden="true" />
            <span>Plans</span>
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
