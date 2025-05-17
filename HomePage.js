import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../utils/api';
import { isAuthenticated } from '../utils/auth';

export default function HomePage() {
    const [events, setEvents] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Get user from localStorage
        const userData = localStorage.getItem('user');
        if (userData) {
            setUser(JSON.parse(userData));
        }
        fetchEvents();
    }, []);

    const fetchMyBookings = useCallback(async () => {
        try {
            const response = await API.get('/bookings/me');
            if (response.data) {
                setBookings(response.data.map(b => b.event));
            }
        } catch (err) {
            console.error('Error fetching bookings:', err);
        }
    }, []);

    const fetchEvents = useCallback(async () => {
        try {
            setLoading(true);
        const response = await API.get('/events');
            if (response.data) {
        setEvents(response.data);
                setError('');
            } else {
                setError('No events found');
            }
        } catch (err) {
            console.error('Error fetching events:', err);
            if (err.response) {
                setError(`Error: ${err.response.data?.message || 'Failed to fetch events'}`);
            } else if (err.request) {
                setError('Unable to connect to the server. Please try again later.');
            } else {
                setError('An unexpected error occurred. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (!isAuthenticated()) {
            navigate('/login');
            return;
        }
        fetchEvents();
        fetchMyBookings();
    }, [navigate, fetchEvents, fetchMyBookings]);

    if (loading) {
        return (
            <div style={styles.loading}>
                <div>Loading events...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div style={styles.errorContainer}>
                <div style={styles.error}>{error}</div>
                <button 
                    onClick={fetchEvents}
                    style={styles.retryButton}
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h1 style={styles.welcome}>Welcome, {user ? user.name : 'Guest'}</h1>
            </div>
            <h1 style={{
                fontSize: '2.5rem',
                fontWeight: 'bold',
                textAlign: 'center',
                margin: '2rem 0 1rem 0'
            }}>
                💥Upcoming Events!💥
            </h1>
            <>
                {events.length === 0 ? (
                    <div style={styles.noEvents}>No events available at the moment.</div>
                ) : (
                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                            gap: '2rem',
                            maxWidth: '1200px',
                            margin: '0 auto'
                        }}
                    >
                        {events.map(ev => (
                            <div
                                key={ev._id}
                                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)'}
                                onMouseLeave={e => e.currentTarget.style.transform = 'none'}
                                style={{
                                    background: 'white',
                                    borderRadius: '16px',
                                    boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
                                    overflow: 'hidden',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    transition: 'transform 0.2s, box-shadow 0.2s',
                                    cursor: 'pointer'
                                }}
                            >
                                <img
                                    src={ev.imageUrl || '/public/headway-F2KRf_QfCqw-unsplash.jpg'}
                                    alt={ev.title}
                                    style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                                />
                                <div style={{ padding: '1.5rem' }}>
                                    <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>{ev.title}</h2>
                                    <p style={{ color: '#888', marginBottom: '0.5rem' }}>{ev.date?.slice(0, 10)}</p>
                                    <p style={{ color: '#555', marginBottom: '1rem' }}>{ev.location}</p>
                                    {user && user.role !== 'admin' && (
                                        <Link to={`/events/${ev._id}`}>
                                            <button style={{
                                                width: '100%',
                                                background: '#43a047',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '8px',
                                                padding: '0.75rem',
                                                fontWeight: 'bold',
                                                cursor: 'pointer'
                                            }}>
                                                Book Now
                                            </button>
                                        </Link>
                                    )}
                                    {user && user.role === 'admin' && (
                                        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                                            <Link to={`/events/${ev._id}`}>
                                                <button style={{
                                                    flex: 1,
                                                    backgroundColor: '#1976d2',
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: '4px',
                                                    padding: '0.75rem 1.5rem',
                                                    cursor: 'pointer'
                                                }}>
                                                    Edit
                                                </button>
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </>
        </div>
    );
}

const styles = {
    container: {
        padding: '20px',
        maxWidth: '1200px',
        margin: '0 auto'
    },
    header: {
        marginBottom: '20px'
    },
    loading: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '200px',
        fontSize: '18px',
        color: '#666'
    },
    errorContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '200px',
        padding: '20px'
    },
    error: {
        color: '#dc3545',
        backgroundColor: '#f8d7da',
        padding: '15px',
        borderRadius: '4px',
        marginBottom: '20px',
        textAlign: 'center'
    },
    retryButton: {
        backgroundColor: '#007bff',
        color: 'white',
        padding: '10px 20px',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '16px'
    },
    welcome: {
        marginBottom: '10px',
        color: '#333'
    },
    title: {
        marginBottom: '20px',
        color: '#666'
    },
    noEvents: {
        textAlign: 'center',
        padding: '40px',
        color: '#666',
        fontSize: '18px'
    },
    eventsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '20px'
    },
    eventCard: {
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        overflow: 'hidden',
        transition: 'transform 0.2s'
    },
    eventImage: {
        width: '100%',
        height: '200px',
        objectFit: 'cover'
    },
    eventContent: {
        padding: '15px'
    },
    eventTitle: {
        margin: '0 0 10px 0',
        color: '#333',
        fontSize: '18px'
    },
    eventDate: {
        color: '#666',
        margin: '5px 0'
    },
    eventPrice: {
        color: '#28a745',
        fontWeight: 'bold',
        margin: '5px 0'
    },
    eventLocation: {
        color: '#666',
        margin: '5px 0'
    },
    bookedBadge: {
        display: 'inline-block',
        backgroundColor: '#007bff',
        color: 'white',
        padding: '5px 10px',
        borderRadius: '4px',
        marginTop: '10px'
    },
    bookButtonContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    bookButton: {
        display: 'inline-block',
        backgroundColor: '#28a745',
        color: 'white',
        padding: '8px 16px',
        borderRadius: '4px',
        textDecoration: 'none',
        marginTop: '10px',
        textAlign: 'center',
        border: 'none',
        cursor: 'pointer',
        width: '100%'
    },
    adminButtons: {
        display: 'flex',
        gap: '0.5rem',
    },
    adminButton: {
        flex: 1,
        backgroundColor: '#1976d2',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        padding: '0.75rem 1.5rem',
        cursor: 'pointer'
    }
};
