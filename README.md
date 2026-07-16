# SortedSupported - React Native App

A mobile wrapper app for the SortedSupported website (sortedsupported.org.uk), providing easy access to support services in Swansea and Neath Port Talbot.

## Features

- Quick navigation to 3 main categories:
  - What's in Swansea, Neath Port Talbot for me
  - Coping with Common Issues
  - Professionals
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
- All URLs include UTM tracking: `?utm_source=app&utm_medium=mobile&utm_campaign=app`

## Notes

- The native header includes the favourite (heart) action on web pages
- Favourites are stored locally using AsyncStorage

## Building for Production

1. Install EAS CLI (if needed):

```bash
npm install -g eas-cli
```

2. Login and configure credentials:

```bash
eas login
eas build:configure
```

3. Create production builds:

```bash
npm run eas:build:ios
npm run eas:build:android
```

4. Submit builds:

```bash
npm run eas:submit:ios
npm run eas:submit:android
```
