
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import { Board } from './features/board/Board';
import { Statistics } from './features/stats/Statistics';
import { Layout, BarChart3 } from 'lucide-react';

function App() {
  return (
    <BrowserRouter>
      <div className="container">
        <header className="header">
          <div className="logo">
            <h1>Todo Kanban</h1>
          </div>
          <nav className="nav">
            <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Layout size={18} />
                Board
              </span>
            </NavLink>
            <NavLink to="/stats" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <BarChart3 size={18} />
                Statistics
              </span>
            </NavLink>
          </nav>
        </header>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Board />} />
            <Route path="/stats" element={<Statistics />} />
          </Routes>
        </main>
      </div>
      <style>{`
        .logo h1 {
          font-size: 1.5rem;
          font-weight: 700;
          background: linear-gradient(to right, var(--accent-primary), var(--column-review));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .main-content {
          flex: 1;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }
      `}</style>
    </BrowserRouter>
  );
}

export default App;
