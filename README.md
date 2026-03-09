# SortedSupported - React Native App

A mobile wrapper app for the SortedSupported website (sortedsupported.org.uk), providing easy access to support services in Swansea and Neath Port Talbot.

## Features

- **Get Help Now** button for urgent access
- Quick navigation to 4 main categories:
  - What's in Swansea, Neath Port Talbot for me
  - Coping with Common Issues
  - Professionals
  - Easy Read version
- Integrated WebView for seamless browsing
- Favourites functionality
- Share features
- UTM tracking for analytics

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Run on your device:
   - For iOS: Press `i` or run `npm run ios`
   - For Android: Press `a` or run `npm run android`
   - Scan QR code with Expo Go app

## Project Structure

```
sortedsupported/
├── App.js                          # Main app component with navigation
├── app.json                        # Expo configuration
├── package.json                    # Dependencies
├── babel.config.js                 # Babel configuration
├── assets/                         # App icons and images
└── src/
    └── screens/
        ├── HomeScreen.js           # Landing page with categories
        ├── WebViewScreen.js        # WebView for displaying website
        ├── FavouritesScreen.js     # Saved pages
        └── ShareScreen.js          # Share functionality
```

## URLs

- Main site: https://www.sortedsupported.org.uk/
- Easy Read: https://www.easyread.sortedsupported.org.uk/
- All URLs include UTM tracking: `?utm_source=app&utm_medium=mobile&utm_campaign=app`

## Notes

- The Easy Read subdomain is linked directly and maintains its own styling
- WebView navigation includes back/forward/reload controls
- Favourites are stored locally using AsyncStorage

## Building for Production

For iOS:
```bash
expo build:ios
```

For Android:
```bash
expo build:android
```
