# Silly Billy - 3D Rag Doll Physics Game

A fun, interactive 3D rag doll physics game built as a Progressive Web App (PWA). Play with a rag doll character using touch controls, device motion sensors, and various physics interactions.

## 🎮 Features

- **3D Rag Doll Physics**: Realistic human body physics with joints and constraints
- **Touch Controls**: Drag, throw, punch, kick, and squeeze the rag doll
- **Device Motion**: Tilt your device to rotate the world and affect physics
- **Cross-Platform**: Works on iOS, Android, and desktop browsers
- **PWA Support**: Install to home screen for app-like experience
- **Offline Play**: Works without internet connection
- **Physics Presets**: Normal, bouncy, and heavy physics modes

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd silly-billy
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   - Navigate to `http://localhost:3000`
   - The game will load automatically

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## 🎯 How to Play

### Touch Controls
- **Drag**: Touch and drag to move rag doll parts
- **Tap**: Tap on body parts to apply random forces
- **Pinch**: Pinch to zoom camera in/out
- **Pan**: Swipe to rotate camera around the scene

### Device Motion (Mobile)
- **Tilt**: Tilt your device to rotate the entire world
- **Shake**: Device motion affects rag doll physics
- **Gyroscope**: Scene stays level while device rotates

### Action Buttons
- **Reset**: Return rag doll to starting position
- **Throw**: Launch rag doll into the air
- **Punch**: Apply force to the head
- **Kick**: Apply force to the legs
- **Squeeze**: Apply random forces to all body parts

### Physics Presets
- **Normal**: Standard physics simulation
- **Bouncy**: Reduced gravity, more bouncy behavior
- **Heavy**: Increased gravity, more weighty feel

## 📱 PWA Features

### Installation
- **iOS**: Tap the share button and select "Add to Home Screen"
- **Android**: Tap the install prompt or use browser menu
- **Desktop**: Click the install button in the address bar

### Offline Support
- Game works without internet connection
- Resources are cached for offline play
- Automatic updates when online

## 🛠️ Technical Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **3D Engine**: Three.js
- **Physics**: Cannon.js
- **Touch Controls**: Hammer.js
- **Build Tool**: Vite
- **PWA**: Service Workers, Web App Manifest

## 📁 Project Structure

```
silly-billy/
├── src/
│   ├── js/
│   │   └── main.js          # Main game logic
│   ├── css/
│   │   └── styles.css       # Game styles
│   └── assets/              # 3D models, textures, sounds
├── public/
│   ├── manifest.json        # PWA manifest
│   ├── service-worker.js    # Offline functionality
│   └── icons/              # App icons
├── index.html              # Main HTML file
├── package.json            # Dependencies
├── vite.config.js          # Build configuration
└── README.md              # This file
```

## 🎨 Customization

### Adding 3D Models
1. Place your GLB model in `src/assets/models/`
2. Update the `loadRagDoll()` method in `main.js`
3. Ensure the model has proper rigging for physics

### Modifying Physics
- Edit physics parameters in `setupPhysics()`
- Adjust rag doll constraints in `addRagDollConstraints()`
- Modify physics presets in `setupPhysicsPresets()`

### Styling
- Customize colors and layout in `src/css/styles.css`
- Modify UI elements in `index.html`

## 🌐 Browser Support

### Mobile
- **iOS**: Safari 14+, Chrome 90+, Firefox 88+
- **Android**: Chrome 90+, Firefox 88+, Samsung Internet 14+

### Desktop
- **Chrome**: 90+
- **Firefox**: 88+
- **Safari**: 14+
- **Edge**: 90+

## 🔧 Development

### Adding New Features
1. Create feature branch
2. Implement changes
3. Test on multiple devices
4. Submit pull request

### Testing
- Test on physical devices for best results
- Use browser dev tools for mobile simulation
- Test offline functionality
- Verify PWA installation

### Performance Optimization
- Monitor frame rate (target: 60 FPS)
- Optimize 3D models (< 10k triangles)
- Minimize physics calculations
- Use efficient lighting and shadows

## 🐛 Troubleshooting

### Common Issues

**Game doesn't load**
- Check browser console for errors
- Ensure all dependencies are installed
- Verify Node.js version

**Touch controls not working**
- Check device orientation permissions
- Ensure HTTPS is used (required for device motion)
- Test on physical device

**Poor performance**
- Reduce physics iterations
- Simplify 3D models
- Disable shadows on low-end devices

**PWA not installing**
- Check manifest.json syntax
- Ensure service worker is registered
- Verify HTTPS connection

## 📄 License

MIT License - see LICENSE file for details

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Make changes
4. Test thoroughly
5. Submit pull request

## 📞 Support

For issues and questions:
- Create GitHub issue
- Check browser console for errors
- Test on different devices/browsers

## 🎉 Credits

- **Three.js**: 3D graphics library
- **Cannon.js**: Physics engine
- **Hammer.js**: Touch gesture library
- **Vite**: Build tool

---

**Have fun playing with Silly Billy! 🎮**