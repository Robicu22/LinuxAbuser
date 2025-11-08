// API configuration for connecting to backend from web and mobile

// IMPORTANT: To test on your Android device, you need to:
// 1. Find your computer's local IP address:
//    - Linux: Run `ip addr` or `ifconfig` and look for your WiFi/Ethernet IP
//    - Example: 192.168.1.100, 192.168.0.50, 10.0.0.5, etc.
// 2. Replace the IP address below with YOUR computer's IP
// 3. Make sure your phone and computer are on the SAME WiFi network
// 4. Make sure your backend is running on port 5000

const YOUR_COMPUTER_IP = '127.0.0.1/8'; // <-- CHANGE THIS TO YOUR IP!

const DEV_API_URL = `http://${YOUR_COMPUTER_IP}:5000/api`;
const PROD_API_URL = 'https://your-production-api.com/api';

// Capacitor.isNativePlatform() checks if running on mobile
import { Capacitor } from '@capacitor/core';

export const API_URL = Capacitor.isNativePlatform() 
  ? DEV_API_URL  // Mobile uses your computer's IP
  : 'http://localhost:5000/api';  // Web uses localhost

export default API_URL;
