import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../utils/api';
import { isAuthenticated, logout } from '../utils/auth';

const AdminPanel = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        date: '',
        time: '',
        location: '',
        capacity: '',
        imageUrl: ''
    });
    const [editingEvent, setEditingEvent] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuth = async () => {
            if (!isAuthenticated()) {
                navigate('/login');
                return;
            }
            fetchEvents();
        };
        checkAuth();
    }, [navigate]);

    const fetchEvents = async () => {
        try {
            const response = await API.get('/events');
            setEvents(response.data);
            setError('');
        } catch (err) {
            setError('Failed to fetch events');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setSubmitting(true);

        try {
            if (editingEvent) {
                await API.put(`/events/${editingEvent._id}`, formData);
                setSuccess('Event updated successfully');
                fetchEvents();
            } else {
                await API.post('/events', formData, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                setSuccess('Event created successfully');
            }
            setFormData({
                title: '',
                description: '',
                date: '',
                time: '',
                location: '',
                capacity: '',
                imageUrl: ''
            });
            setEditingEvent(null);
            fetchEvents();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to save event');
        } finally {
            setSubmitting(false);
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
            setFormData(prev => ({
                ...prev,
              imageUrl: reader.result // base64 string
            }));
            };
            reader.readAsDataURL(file);
        }
        };

    const handleEdit = (event) => {
        setEditingEvent(event);
        setFormData({
            title: event.title,
            description: event.description,
            date: event.date.split('T')[0],
            time: event.time,
            location: event.location,
            capacity: event.capacity,
            imageUrl: event.imageUrl
        });
    };

    const handleDelete = async (eventId) => {
        if (window.confirm('Are you sure you want to delete this event?')) {
            try {
                await API.delete(`/events/${eventId}`);
                setSuccess('Event deleted successfully');
                fetchEvents();
            } catch (err) {
                setError('Failed to delete event');
            }
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100">
                <div className="text-center">Loading...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Header */}
            <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto py-6 px-4 flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                    <button
                        onClick={handleLogout}
                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                        Logout
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex flex-col lg:flex-row justify-center items-start py-8 px-4 min-h-[80vh] max-w-7xl mx-auto">
                {/* Centered Create New Event Card */}
                <div className="flex-1 flex justify-center mb-8 lg:mb-0">
                    <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
                        <h2 className="text-xl font-semibold mb-4 text-center">
                            {editingEvent ? 'Edit Event' : 'Create New Event'}
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Title</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    required
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Description</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    required
                                    rows="3"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Date</label>
                                    <input
                                        type="date"
                                        name="date"
                                        value={formData.date}
                                        onChange={handleInputChange}
                                        required
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Time</label>
                                    <input
                                        type="time"
                                        name="time"
                                        value={formData.time}
                                        onChange={handleInputChange}
                                        required
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Location</label>
                                <input
                                    type="text"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleInputChange}
                                    required
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Capacity</label>
                                <input
                                    type="number"
                                    name="capacity"
                                    value={formData.capacity}
                                    onChange={handleInputChange}
                                    required
                                    min="1"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Image URL</label>
                                <input
                                    type="url"
                                    name="imageUrl"
                                    value={formData.imageUrl}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Event Image</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="mt-1 block w-full"
                                />
                                {formData.imageUrl && (
                                    <img
                                    src={formData.imageUrl}
                                    alt="Preview"
                                    className="mt-2 h-32 w-full object-cover rounded"
                                    />
                                )}
                            </div>
                            <div className="flex justify-end space-x-4">
                                {editingEvent && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setEditingEvent(null);
                                            setFormData({
                                                title: '',
                                                description: '',
                                                date: '',
                                                time: '',
                                                location: '',
                                                capacity: '',
                                                imageUrl: ''
                                            });
                                        }}
                                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                                    >
                                        Cancel
                                    </button>
                                )}
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                                    disabled={submitting}>
                                    {submitting ? 'Saving...' : editingEvent ? 'Update Event' : 'Create Event'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
                {/* Manage Events Grid */}
                <div className="flex-[2]">
                    <h2 className="text-xl font-semibold mb-4">Manage Events</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {events.map(event => (
                            <div
                                key={event._id}
                                className="bg-gray-50 rounded-lg shadow-md flex flex-col overflow-hidden hover:shadow-lg transition-shadow border border-gray-200"
                            >
                                {event.imageUrl && (
                                    <img
                                        src={event.imageUrl}
                                        alt={event.title}
                                        className="h-40 w-full object-cover"
                                    />
                                )}
                                <div className="flex-1 p-4 flex flex-col justify-between">
                                    <div>
                                        <h3 className="text-lg font-bold mb-2">{event.title}</h3>
                                        <p className="text-gray-600 mb-1">{event.date} {event.time}</p>
                                        <p className="text-gray-600 mb-1">{event.location}</p>
                                        <p className="text-gray-600 mb-1">{event.description}</p>
                                        <p className="text-gray-600 mb-1">Capacity: {event.capacity}</p>
                                        <p className="text-gray-600 mb-1">Bookings: {event.attendees?.length || 0}</p>
                                    </div>
                                    <div className="flex gap-2 mt-4">
                                        <button
                                            onClick={() => handleEdit(event)}
                                            className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(event._id)}
                                            className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminPanel; 