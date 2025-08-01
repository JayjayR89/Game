# Silly Billy - 3D Rag Doll Physics Game PWA

## Project Overview
"Silly Billy" is a 3D rag doll physics game built as a Progressive Web App (PWA) that allows users to interact with a rag doll character through touch, gyroscope, and device motion sensors.

## Technical Stack
- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **3D Engine**: Three.js with Cannon.js for physics
- **PWA Framework**: Service Workers, Web App Manifest
- **Touch/Gesture**: Hammer.js or native touch events
- **Device Motion**: DeviceOrientationEvent, DeviceMotionEvent APIs
- **Build Tool**: Vite or Parcel for bundling
- **3D Model Format**: GLB (recommended) or FBX

## Core Features

### Phase 1: Foundation (MVP)
1. **3D Scene Setup**
   - Three.js scene with proper lighting
   - Camera controls (touch/mouse)
   - Ground plane with physics
   - Skybox or environment

2. **Rag Doll Physics**
   - Import and rig 3D model
   - Implement rag doll physics with Cannon.js
   - Joint constraints and body parts
   - Gravity simulation
   - Collision detection

3. **Basic Interactions**
   - Touch drag to move rag doll parts
   - Throw rag doll functionality
   - Reset rag doll position
   - Camera orbit controls

### Phase 2: Device Integration
4. **Gyroscope & Motion Sensors**
   - Device orientation detection
   - Scene rotation based on device tilt
   - Rag doll physics affected by device motion
   - Smooth motion interpolation

5. **Enhanced Touch Controls**
   - Multi-touch gestures
   - Pinch to zoom camera
   - Swipe to throw
   - Long press for special actions

### Phase 3: PWA & Polish
6. **Progressive Web App**
   - Service Worker for offline functionality
   - Web App Manifest for home screen installation
   - App icons and splash screens
   - Offline-first design

7. **Cross-Platform Compatibility**
   - iOS Safari/Chrome optimization
   - Android Chrome/Firefox support
   - Desktop browser compatibility
   - Fallback for non-touch devices

### Phase 4: Advanced Features
8. **Enhanced Physics**
   - Realistic human body physics
   - Muscle simulation
   - Joint limits and constraints
   - Impact effects and sound

9. **Visual Effects**
   - Particle effects for impacts
   - Motion blur
   - Dynamic lighting
   - Post-processing effects

10. **Game Modes & Features**
    - Multiple rag doll characters
    - Different environments/scenes
    - Physics presets (bouncy, heavy, etc.)
    - Recording and replay functionality

## Technical Requirements

### 3D Model Specifications
- **Format**: GLB (preferred) or FBX
- **Polygon count**: < 10,000 triangles for mobile performance
- **Rigging**: Humanoid skeleton with proper joint hierarchy
- **Textures**: PBR materials (albedo, normal, roughness, metallic)
- **Animation**: T-pose or A-pose for rag doll setup

### Performance Targets
- **Frame Rate**: 60 FPS on mid-range devices
- **Load Time**: < 3 seconds on 3G connection
- **Memory Usage**: < 200MB RAM
- **Battery Impact**: Optimized for extended play sessions

### Browser Support
- **iOS**: Safari 14+, Chrome 90+, Firefox 88+
- **Android**: Chrome 90+, Firefox 88+, Samsung Internet 14+
- **Desktop**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+

## Development Phases

### Phase 1: Core Setup (Week 1-2)
- [ ] Project structure and build setup
- [ ] Three.js scene with basic lighting
- [ ] Camera controls implementation
- [ ] 3D model import and basic display
- [ ] Physics engine integration

### Phase 2: Physics & Interactions (Week 3-4)
- [ ] Rag doll physics implementation
- [ ] Touch controls for dragging
- [ ] Throw mechanics
- [ ] Collision detection
- [ ] Gravity and environment physics

### Phase 3: Device Sensors (Week 5-6)
- [ ] Gyroscope integration
- [ ] Device motion sensors
- [ ] Scene rotation based on device orientation
- [ ] Motion interpolation and smoothing

### Phase 4: PWA Features (Week 7-8)
- [ ] Service Worker implementation
- [ ] Web App Manifest
- [ ] Offline functionality
- [ ] Home screen installation
- [ ] Cross-browser testing

### Phase 5: Polish & Optimization (Week 9-10)
- [ ] Performance optimization
- [ ] Visual effects and polish
- [ ] Sound effects and audio
- [ ] Final testing and bug fixes
- [ ] Deployment preparation

## File Structure
```
silly-billy/
├── src/
│   ├── js/
│   │   ├── main.js
│   │   ├── scene.js
│   │   ├── physics.js
│   │   ├── controls.js
│   │   ├── device-sensors.js
│   │   └── pwa.js
│   ├── css/
│   │   └── styles.css
│   ├── assets/
│   │   ├── models/
│   │   ├── textures/
│   │   └── sounds/
│   └── index.html
├── public/
│   ├── manifest.json
│   ├── service-worker.js
│   └── icons/
├── package.json
└── vite.config.js
```

## Project Specifications (Confirmed)

### 3D Model & Art Style
- **Format**: GLB (optimized for web)
- **Style**: Cartoon human character
- **Character**: Single human rag doll
- **Environment**: Outdoor environment with interactive objects

### Gameplay & Interactions
- **Core Actions**: Drag rag doll, throw, punch, kick, squeeze
- **Physics**: Realistic human physics
- **Device Motion**: Rotate entire world based on gyroscope
- **Audio**: Impact sounds and haptic feedback
- **Target**: Fun for everyone (all ages)

### Recommended Additional Features
- **Recording & Replay**: Save and replay funny rag doll moments
- **Screenshot Sharing**: Share funny poses/actions
- **Physics Presets**: Different rag doll personalities (bouncy, heavy, floppy)
- **Interactive Objects**: Bouncy balls, trampolines, obstacles
- **Weather Effects**: Wind affecting rag doll movement
- **Character Customization**: Different outfits/colors
- **Achievement System**: Unlock funny achievements
- **Slow Motion Mode**: For dramatic effect
- **Reset & Undo**: Quick reset and undo last action
- **Offline Play**: Works without internet connection

## Next Steps
1. Provide the 3D model file
2. Answer clarification questions
3. Set up development environment
4. Begin Phase 1 development
5. Regular testing and iteration

## Success Metrics
- Smooth 60 FPS performance on target devices
- Responsive touch controls with < 100ms latency
- Accurate gyroscope integration
- Successful PWA installation on all target platforms
- Positive user feedback on physics feel and interactions
