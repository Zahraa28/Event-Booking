import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import API from '../utils/api';
import { login } from '../utils/auth';

export default function LoginPage() {
    const [form, setForm] = useState({ email: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async(e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        
        try {
            console.log('Attempting login with:', { email: form.email });
            const response = await API.post("/auth/login", form);
            console.log('Login response:', response.data);
            
            // Store token and user data
            login(response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            
            // Check if user is admin and redirect accordingly
            if (response.data.user.role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/');
            }
        } catch (err) {
            console.error('Login error details:', {
                message: err.message,
                response: err.response?.data,
                status: err.response?.status,
                code: err.code
            });

            if (err.response) {
                // Server responded with an error status
                if (err.response.status === 401) {
                    setError('Invalid email or password');
                } else if (err.response.status === 404) {
                    setError('Login endpoint not found. Please check server configuration.');
                } else {
                    setError(err.response.data?.message || `Server error (${err.response.status})`);
                }
            } else if (err.request) {
                // Request was made but no response received
                if (err.code === 'ECONNABORTED') {
                    setError('Request timed out. Please try again.');
                } else {
                    setError('Unable to connect to the server. Please check if the server is running at ' + 
                        (process.env.REACT_APP_API_URL || 'http://localhost:5000/api'));
                }
            } else {
                // Error in request setup
                setError(`Error: ${err.message}`);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <form onSubmit={handleSubmit} style={styles.form}>
                <h2 style={styles.title}>Login</h2>
                {error && (
                    <div style={styles.error}>
                        {error}
                        <button 
                            onClick={() => setError('')} 
                            style={styles.errorClose}
                        >
                            ×
                        </button>
                    </div>
                )}
                <input 
                    style={styles.input}
                    type="email" 
                    placeholder="Email" 
                    value={form.email} 
                    onChange={(e) => setForm({...form, email: e.target.value})} 
                    required
                    disabled={loading}
                />
                <input 
                    style={styles.input}
                    type="password" 
                    placeholder="Password" 
                    value={form.password} 
                    onChange={(e) => setForm({...form, password: e.target.value})} 
                    required
                    disabled={loading}
                />
                <button 
                    type="submit" 
                    style={styles.button}
                    disabled={loading}
                >
                    {loading ? 'Logging in...' : 'Login'}
                </button>
                <p style={styles.text}>
                    Don't have an account? <Link to="/register" style={styles.link}>Register here</Link>
                </p>
            </form>
        </div>
    );
}

const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 'calc(100vh - 64px)',
        backgroundColor: '#f5f5f5'
    },
    form: {
        width: '100%',
        maxWidth: '400px',
        padding: '2rem',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
    },
    title: {
        textAlign: 'center',
        marginBottom: '2rem',
        color: '#333'
    },
    error: {
        backgroundColor: '#fee',
        color: '#c00',
        padding: '10px',
        borderRadius: '4px',
        marginBottom: '1rem',
        textAlign: 'center',
        position: 'relative',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    errorClose: {
        background: 'none',
        border: 'none',
        color: '#c00',
        fontSize: '20px',
        cursor: 'pointer',
        padding: '0 5px'
    },
    input: {
        width: '100%',
        padding: '0.75rem',
        marginBottom: '1rem',
        border: '1px solid #ddd',
        borderRadius: '4px',
        fontSize: '1rem'
    },
    button: {
        width: '100%',
        padding: '0.75rem',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        fontSize: '1rem',
        cursor: 'pointer',
        transition: 'background-color 0.3s',
        ':disabled': {
            backgroundColor: '#ccc',
            cursor: 'not-allowed'
        }
    },
    text: {
        textAlign: 'center',
        marginTop: '1rem',
        color: '#666'
    },
    link: {
        color: '#007bff',
        textDecoration: 'none'
    }
};