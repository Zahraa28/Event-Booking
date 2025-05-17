import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import API from '../utils/api';

export default function RegisterPage() {
    const [form, setForm] = useState({ name:"", email:"", password:""});
    const navigate = useNavigate();

    const handleSubmit = async(e) => {
        e.preventDefault();
        try{
            await API.post("/auth/register", form);
            alert("Registered! Now login.");
            navigate("/login");
        }catch(err){
            alert(err.response?.data?.message || "Registration error");
        }
    };

    return (
        <div style={styles.container}>
            <form onSubmit={handleSubmit} style={styles.form}>
                <h2 style={styles.title}>Register</h2>
                <input 
                    style={styles.input}
                    type="text" 
                    placeholder="Name" 
                    value={form.name} 
                    onChange={(e) => setForm({...form, name: e.target.value})} 
                    required 
                />
                <input 
                    style={styles.input}
                    type="email" 
                    placeholder="Email" 
                    value={form.email} 
                    onChange={(e) => setForm({...form, email: e.target.value})} 
                    required
                />
                <input 
                    style={styles.input}
                    type="password" 
                    placeholder="Password" 
                    value={form.password} 
                    onChange={(e) => setForm({...form, password: e.target.value})} 
                    required
                />
                <button type="submit" style={styles.button}>Register</button>
                <p style={styles.text}>
                    Already have an account? <Link to="/login" style={styles.link}>Login here</Link>
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
        transition: 'background-color 0.3s'
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