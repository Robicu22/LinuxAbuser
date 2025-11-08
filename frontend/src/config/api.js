// API configuration
// In production, this will use the VITE_API_URL environment variable
// In development, it defaults to localhost:5000
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default API_URL;
