import React from 'react';
import { Link } from 'react-router-dom';

const CongratePage = () => {
    return (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
            <h1>Congratulations!</h1>
            <p>Your booking has been confirmed successfully.</p>
            <Link to="/" style={{ 
                display: 'inline-block',
                padding: '10px 20px',
                backgroundColor: '#007bff',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '5px',
                marginTop: '20px'
            }}>
                Return to Home
            </Link>
        </div>
    );
};

export default CongratePage;
