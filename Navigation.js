import { Link } from 'react-router-dom';

function Navigation() {
  return (
    <nav style={{
      padding: '1rem',
      backgroundColor: '#f8f9fa',
      marginBottom: '1rem'
    }}>
      <ul style={{
        listStyle: 'none',
        display: 'flex',
        gap: '1rem',
        margin: 0,
        padding: 0
      }}>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/login">Login</Link></li>
        <li><Link to="/register">Register</Link></li>
        <li><Link to="/admin">Admin</Link></li>
      </ul>
    </nav>
  );
}

export default Navigation; 