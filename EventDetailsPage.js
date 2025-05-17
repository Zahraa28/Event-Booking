import React, {useState, useEffect} from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import API from '../api';

const EventDetailsPage = () => {
    const {id} = useParams();
    const [event, setEvent] = useState(null);
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const [user, setUser] = useState(null);

    useEffect(() => {
        API.get(`/events/${id}`).then((res) => setEvent(res.data));
        const userData = localStorage.getItem('user');
        if (userData) {
            setUser(JSON.parse(userData));
        }
    }, [id]);

    const handleBook = async () => {
        try {
            await API.post('/bookings', {eventId: id}, {
                headers: {Authorization: `Bearer ${token}`},
            });
            navigate('/bookings');
        } catch (error) {
            alert(error.response?.data?.message || 'Booking failed');
        }
    };

    const handleEdit = () => {
        navigate('/admin');
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this event?')) {
            try {
                await API.delete(`/events/${id}`);
                navigate('/admin');
            } catch (error) {
                alert(error.response?.data?.message || 'Delete failed');
            }
        }
    };

    if (!event) return <div>Loading...</div>;
    
    return (
        <div>
            <h2>{event.title}</h2>
            <p>{event.description}</p>
            <p>Date: {event.date?.slice(0, 10)}</p>
            <p>Location: {event.location}</p>
            {user && user.role !== 'admin' && (
                <div>
                    <button onClick={handleBook}>Book Now</button>
                </div>
            )}
            {user && user.role === 'admin' && (
                <div style={{marginTop: '1rem', display: 'flex', gap: '1rem'}}>
                    <button onClick={handleEdit} style={{background: '#1976d2', color: 'white', padding: '0.5rem 1rem', border: 'none', borderRadius: '4px', cursor: 'pointer'}}>Edit</button>
                    <button onClick={handleDelete} style={{background: '#d32f2f', color: 'white', padding: '0.5rem 1rem', border: 'none', borderRadius: '4px', cursor: 'pointer'}}>Delete</button>
                </div>
            )}
        </div>        
    );
}

export default EventDetailsPage;
