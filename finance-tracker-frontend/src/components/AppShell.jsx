import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { logoutUser } from '../api';

const navItems = [
  { to: '/', label: 'Dashboard' },
  { to: '/add-expenses', label: 'Expenses' },
  { to: '/add-investments', label: 'Investments' },
  { to: '/track-expenses', label: 'Expense Chart' },
  { to: '/track-investments', label: 'Investment Chart' },
  { to: '/finance-insights', label: 'Insights' },
];

const AppShell = ({ title, subtitle, children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logoutUser();
    navigate('/login');
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div>
          <p className="sidebar-kicker">Finance Tracker</p>
          <h1 className="sidebar-title">Money, with receipts.</h1>
          <p className="sidebar-copy">
            Keep income, expenses, investments, and quick insight views in one place.
          </p>
        </div>

        <nav className="nav-list">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`nav-link${location.pathname === item.to ? ' is-active' : ''}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <button type="button" className="ghost-button" onClick={handleLogout}>
          Logout
        </button>
      </aside>

      <main className="content">
        <header className="page-header">
          <div>
            <h2>{title}</h2>
            {subtitle ? <p>{subtitle}</p> : null}
          </div>
        </header>
        {children}
      </main>
    </div>
  );
};

export default AppShell;
