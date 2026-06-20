import { useState, useCallback } from 'react';
import { NavLink, Outlet } from 'react-router-dom';

export function Layout() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = useCallback(() => {
    setMenuOpen((prev) => !prev);
  }, []);

  const closeMenu = useCallback(() => {
    setMenuOpen(false);
  }, []);

  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <header className="app-header">
        <div className="header-inner">
          <span className="app-logo">CarbonTrack</span>
          <button
            className="menu-toggle"
            aria-label="Toggle navigation menu"
            aria-expanded={menuOpen}
            aria-controls="nav-menu"
            onClick={toggleMenu}
          >
            <span className="hamburger-line" />
            <span className="hamburger-line" />
            <span className="hamburger-line" />
          </button>
          <nav id="nav-menu" className={`nav-menu ${menuOpen ? 'nav-open' : ''}`}>
            <NavLink to="/" end onClick={closeMenu}>Dashboard</NavLink>
            <NavLink to="/track" onClick={closeMenu}>Track</NavLink>
            <NavLink to="/insights" onClick={closeMenu}>Insights</NavLink>
            <NavLink to="/progress" onClick={closeMenu}>Progress</NavLink>
          </nav>
        </div>
      </header>
      <main id="main-content">
        <Outlet />
      </main>
      <footer className="app-footer">
        <p>CarbonTrack &mdash; Track your carbon footprint</p>
      </footer>
    </>
  );
}
