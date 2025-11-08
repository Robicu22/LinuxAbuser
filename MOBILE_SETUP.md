# Mobile App Setup Guide (Android with Capacitor)

## ✅ What's Been Done

Your React app is now configured to run as an Android mobile app using Capacitor!

### Changes Made:
1. **Installed Capacitor** - Added @capacitor/core, @capacitor/cli, and @capacitor/android
2. **Created API Config** - `frontend/src/config/api.js` handles different URLs for web vs mobile
3. **Updated Login/Signup** - Both pages now use the API config instead of hardcoded localhost
4. **Updated Backend CORS** - Backend now accepts requests from mobile apps (capacitor://, ionic://)
5. **Built Android Project** - Created the `frontend/android/` folder with your Android app

## 🚀 How to Run on Android

### Step 1: Find Your Computer's IP Address
Your phone needs to connect to your backend server, so it needs your computer's IP (not localhost).

```bash
# Find your IP address (look for something like 192.168.x.x or 10.0.x.x)
ip addr show
# OR
ifconfig
```

### Step 2: Update the API Config
Edit `frontend/src/config/api.js` and replace `192.168.1.100` with YOUR actual IP address:

```javascript
const YOUR_COMPUTER_IP = '192.168.1.100'; // <-- CHANGE THIS!
```

### Step 3: Make Sure Backend is Running
```bash
cd backend
npm run dev
```

The backend should show: "Server is running on port: 5000"

### Step 4: Rebuild and Sync
Every time you make changes to your React code, run:

```bash
cd frontend
npm run build
npx cap sync android
```

### Step 5: Open in Android Studio
```bash
cd frontend
npx cap open android
```

This opens Android Studio. Then:
1. Wait for Gradle to finish syncing (bottom status bar)
2. Connect your Android phone via USB (enable Developer Mode + USB Debugging)
   - OR use an Android emulator
3. Click the green "Run" button (▶️) at the top
4. Select your device and click OK

## 📱 Testing Tips

### Make Sure:
- ✅ Your phone and computer are on the SAME WiFi network
- ✅ Backend is running on port 5000
- ✅ You updated the IP address in `frontend/src/config/api.js`
- ✅ You rebuilt with `npm run build` and synced with `npx cap sync android`

### Common Issues:

**"Network Error" on mobile:**
- Check that your IP address is correct
- Verify phone and computer are on same WiFi
- Make sure backend is running
- Check firewall isn't blocking port 5000

**"Cannot connect to localhost":**
- You forgot to update the IP in `api.js`
- Mobile devices can't access "localhost" - they need your computer's actual IP

**App shows old content:**
- Run `npm run build && npx cap sync android` again
- Uninstall the app from your phone and reinstall

## 🔄 Development Workflow

1. Make changes to React code in `frontend/src/`
2. Test in web browser first: `npm run dev`
3. When ready for mobile:
   ```bash
   npm run build
   npx cap sync android
   npx cap open android
   ```
4. Run from Android Studio

## 📦 Key Files

- `frontend/capacitor.config.json` - Capacitor configuration
- `frontend/src/config/api.js` - API URL configuration (CHANGE YOUR IP HERE!)
- `frontend/android/` - Android project (managed by Capacitor)
- `backend/index.js` - CORS configured for mobile access

## 🌐 Backend CORS Setup

The backend now accepts requests from:
- `http://localhost:5173` (web dev)
- `capacitor://localhost` (mobile)
- `ionic://localhost` (mobile)
- Your network IP (for testing)

## 🎯 Next Steps

- Install Android Studio if you haven't: https://developer.android.com/studio
- Enable Developer Mode on your Android phone
- Consider adding environment variables for different API URLs (dev/staging/prod)
- Add error handling and loading states in your mobile app
- Test on different Android versions and screen sizes

## 🆘 Need Help?

- Capacitor Docs: https://capacitorjs.com/docs
- Android Studio Setup: https://capacitorjs.com/docs/android
- Debugging: Use Chrome DevTools with `chrome://inspect` when phone is connected
