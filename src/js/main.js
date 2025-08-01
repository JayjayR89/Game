import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as CANNON from 'cannon-es';
import Hammer from 'hammerjs';

class SillyBillyGame {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.physicsWorld = null;
        this.ragDoll = null;
        this.controls = null;
        this.hammer = null;
        this.isLoaded = false;
        this.deviceMotion = { x: 0, y: 0, z: 0 };
        this.isDeviceMotionEnabled = false;
        
        this.init();
    }
    
    async init() {
        try {
            await this.setupThreeJS();
            await this.setupPhysics();
            await this.setupControls();
            await this.setupDeviceMotion();
            await this.loadRagDoll();
            await this.setupEnvironment();
            await this.setupUI();
            
            this.isLoaded = true;
            this.hideLoadingScreen();
            this.animate();
            
            console.log('Silly Billy initialized successfully!');
        } catch (error) {
            console.error('Failed to initialize Silly Billy:', error);
            this.showError('Failed to load game. Please refresh and try again.');
        }
    }
    
    async setupThreeJS() {
        // Create scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x87CEEB); // Sky blue
        
        // Create camera
        this.camera = new THREE.PerspectiveCamera(
            75, 
            window.innerWidth / window.innerHeight, 
            0.1, 
            1000
        );
        this.camera.position.set(0, 5, 10);
        
        // Create renderer
        this.renderer = new THREE.WebGLRenderer({ 
            canvas: document.getElementById('game-canvas'),
            antialias: true,
            alpha: true
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        
        // Add lighting
        this.setupLighting();
        
        // Handle window resize
        window.addEventListener('resize', () => this.onWindowResize());
    }
    
    setupLighting() {
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
        this.scene.add(ambientLight);
        
        // Directional light (sun)
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(10, 10, 5);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        directionalLight.shadow.camera.near = 0.5;
        directionalLight.shadow.camera.far = 50;
        directionalLight.shadow.camera.left = -10;
        directionalLight.shadow.camera.right = 10;
        directionalLight.shadow.camera.top = 10;
        directionalLight.shadow.camera.bottom = -10;
        this.scene.add(directionalLight);
        
        // Point light for additional illumination
        const pointLight = new THREE.PointLight(0xffffff, 0.5, 100);
        pointLight.position.set(0, 10, 0);
        this.scene.add(pointLight);
    }
    
    async setupPhysics() {
        this.physicsWorld = new CANNON.World({
            gravity: new CANNON.Vec3(0, -9.82, 0)
        });
        
        // Set solver iterations for better stability
        this.physicsWorld.solver.iterations = 10;
        this.physicsWorld.broadphase = new CANNON.SAPBroadphase(this.physicsWorld);
    }
    
    async setupControls() {
        // Orbit controls for camera
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.screenSpacePanning = false;
        this.controls.minDistance = 3;
        this.controls.maxDistance = 20;
        this.controls.maxPolarAngle = Math.PI / 2;
        
        // Touch controls
        this.setupTouchControls();
    }
    
    setupTouchControls() {
        const canvas = this.renderer.domElement;
        this.hammer = new Hammer(canvas);
        
        // Pan gesture for camera
        this.hammer.get('pan').set({ direction: Hammer.DIRECTION_ALL });
        this.hammer.on('pan', (e) => {
            if (this.controls) {
                this.controls.rotateLeft(-e.deltaX * 0.01);
                this.controls.rotateUp(-e.deltaY * 0.01);
            }
        });
        
        // Pinch gesture for zoom
        this.hammer.get('pinch').set({ enable: true });
        this.hammer.on('pinch', (e) => {
            if (this.controls) {
                const scale = e.scale;
                this.camera.position.multiplyScalar(scale);
            }
        });
        
        // Tap gesture for interactions
        this.hammer.on('tap', (e) => {
            this.handleTap(e.center.x, e.center.y);
        });
    }
    
    async setupDeviceMotion() {
        if (window.DeviceOrientationEvent) {
            window.addEventListener('deviceorientation', (event) => {
                this.handleDeviceOrientation(event);
            });
            
            // Request permission on iOS
            if (typeof DeviceOrientationEvent.requestPermission === 'function') {
                document.addEventListener('click', () => {
                    DeviceOrientationEvent.requestPermission()
                        .then(permission => {
                            if (permission === 'granted') {
                                this.isDeviceMotionEnabled = true;
                                this.updateMotionStatus('Gyroscope: Enabled');
                            }
                        })
                        .catch(console.error);
                }, { once: true });
            } else {
                this.isDeviceMotionEnabled = true;
                this.updateMotionStatus('Gyroscope: Enabled');
            }
        }
        
        if (window.DeviceMotionEvent) {
            window.addEventListener('devicemotion', (event) => {
                this.handleDeviceMotion(event);
            });
        }
    }
    
    handleDeviceOrientation(event) {
        if (!this.isDeviceMotionEnabled) return;
        
        const alpha = event.alpha || 0;
        const beta = event.beta || 0;
        const gamma = event.gamma || 0;
        
        // Convert to radians and apply to scene rotation
        const rotationX = THREE.MathUtils.degToRad(beta);
        const rotationZ = THREE.MathUtils.degToRad(gamma);
        
        // Apply rotation to the entire scene
        this.scene.rotation.x = rotationX * 0.5;
        this.scene.rotation.z = rotationZ * 0.5;
        
        // Add force to rag doll based on device tilt
        if (this.ragDoll && this.ragDoll.bodies) {
            const force = new CANNON.Vec3(
                gamma * 0.1,
                0,
                -beta * 0.1
            );
            
            this.ragDoll.bodies.forEach(body => {
                body.applyForce(force, body.position);
            });
        }
    }
    
    handleDeviceMotion(event) {
        if (!this.isDeviceMotionEnabled) return;
        
        const acceleration = event.accelerationIncludingGravity;
        if (acceleration) {
            this.deviceMotion.x = acceleration.x || 0;
            this.deviceMotion.y = acceleration.y || 0;
            this.deviceMotion.z = acceleration.z || 0;
        }
    }
    
    updateMotionStatus(status) {
        const statusElement = document.getElementById('motion-status');
        if (statusElement) {
            statusElement.textContent = status;
        }
    }
    
    async loadRagDoll() {
        // For now, create a simple rag doll with basic shapes
        // This will be replaced with the actual 3D model
        this.ragDoll = this.createSimpleRagDoll();
        this.scene.add(this.ragDoll.group);
    }
    
    createSimpleRagDoll() {
        const group = new THREE.Group();
        const bodies = [];
        const meshes = [];
        
        // Create body parts
        const bodyParts = [
            { name: 'head', size: [0.5, 0.5, 0.5], position: [0, 2.5, 0], color: 0xFFB6C1 },
            { name: 'torso', size: [1, 1.5, 0.3], position: [0, 1, 0], color: 0x87CEEB },
            { name: 'leftArm', size: [0.2, 0.8, 0.2], position: [-1.2, 1.5, 0], color: 0xFFB6C1 },
            { name: 'rightArm', size: [0.2, 0.8, 0.2], position: [1.2, 1.5, 0], color: 0xFFB6C1 },
            { name: 'leftLeg', size: [0.3, 0.8, 0.3], position: [-0.3, -0.5, 0], color: 0x4169E1 },
            { name: 'rightLeg', size: [0.3, 0.8, 0.3], position: [0.3, -0.5, 0], color: 0x4169E1 }
        ];
        
        bodyParts.forEach(part => {
            // Create physics body
            const shape = new CANNON.Box(new CANNON.Vec3(...part.size.map(s => s / 2)));
            const body = new CANNON.Body({
                mass: 1,
                shape: shape,
                position: new CANNON.Vec3(...part.position)
            });
            
            // Create visual mesh
            const geometry = new THREE.BoxGeometry(...part.size);
            const material = new THREE.MeshLambertMaterial({ color: part.color });
            const mesh = new THREE.Mesh(geometry, material);
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            
            // Add to scene and physics world
            group.add(mesh);
            this.physicsWorld.addBody(body);
            
            bodies.push(body);
            meshes.push(mesh);
        });
        
        // Add constraints between body parts
        this.addRagDollConstraints(bodies);
        
        return { group, bodies, meshes };
    }
    
    addRagDollConstraints(bodies) {
        // Head to torso
        const headTorsoConstraint = new CANNON.ConeTwistConstraint(bodies[0], bodies[1], {
            pivotA: new CANNON.Vec3(0, -0.25, 0),
            pivotB: new CANNON.Vec3(0, 0.75, 0),
            axisA: new CANNON.Vec3(0, 1, 0),
            axisB: new CANNON.Vec3(0, 1, 0),
            angle: Math.PI / 4,
            twistAngle: Math.PI / 4
        });
        this.physicsWorld.addConstraint(headTorsoConstraint);
        
        // Arms to torso
        const leftArmConstraint = new CANNON.ConeTwistConstraint(bodies[2], bodies[1], {
            pivotA: new CANNON.Vec3(0, 0.4, 0),
            pivotB: new CANNON.Vec3(-0.5, 0.5, 0),
            axisA: new CANNON.Vec3(1, 0, 0),
            axisB: new CANNON.Vec3(1, 0, 0),
            angle: Math.PI / 2,
            twistAngle: Math.PI / 2
        });
        this.physicsWorld.addConstraint(leftArmConstraint);
        
        const rightArmConstraint = new CANNON.ConeTwistConstraint(bodies[3], bodies[1], {
            pivotA: new CANNON.Vec3(0, 0.4, 0),
            pivotB: new CANNON.Vec3(0.5, 0.5, 0),
            axisA: new CANNON.Vec3(-1, 0, 0),
            axisB: new CANNON.Vec3(-1, 0, 0),
            angle: Math.PI / 2,
            twistAngle: Math.PI / 2
        });
        this.physicsWorld.addConstraint(rightArmConstraint);
        
        // Legs to torso
        const leftLegConstraint = new CANNON.ConeTwistConstraint(bodies[4], bodies[1], {
            pivotA: new CANNON.Vec3(0, 0.4, 0),
            pivotB: new CANNON.Vec3(-0.3, -0.75, 0),
            axisA: new CANNON.Vec3(0, 1, 0),
            axisB: new CANNON.Vec3(0, 1, 0),
            angle: Math.PI / 4,
            twistAngle: Math.PI / 4
        });
        this.physicsWorld.addConstraint(leftLegConstraint);
        
        const rightLegConstraint = new CANNON.ConeTwistConstraint(bodies[5], bodies[1], {
            pivotA: new CANNON.Vec3(0, 0.4, 0),
            pivotB: new CANNON.Vec3(0.3, -0.75, 0),
            axisA: new CANNON.Vec3(0, 1, 0),
            axisB: new CANNON.Vec3(0, 1, 0),
            angle: Math.PI / 4,
            twistAngle: Math.PI / 4
        });
        this.physicsWorld.addConstraint(rightLegConstraint);
    }
    
    async setupEnvironment() {
        // Create ground
        const groundGeometry = new THREE.PlaneGeometry(20, 20);
        const groundMaterial = new THREE.MeshLambertMaterial({ 
            color: 0x90EE90,
            side: THREE.DoubleSide
        });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        ground.receiveShadow = true;
        this.scene.add(ground);
        
        // Create physics ground
        const groundShape = new CANNON.Plane();
        const groundBody = new CANNON.Body({
            mass: 0,
            shape: groundShape
        });
        groundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
        this.physicsWorld.addBody(groundBody);
        
        // Add some interactive objects
        this.addInteractiveObjects();
    }
    
    addInteractiveObjects() {
        // Add a few bouncy balls
        for (let i = 0; i < 3; i++) {
            const ballGeometry = new THREE.SphereGeometry(0.5, 16, 16);
            const ballMaterial = new THREE.MeshLambertMaterial({ 
                color: Math.random() * 0xffffff 
            });
            const ball = new THREE.Mesh(ballGeometry, ballMaterial);
            ball.position.set(
                (Math.random() - 0.5) * 10,
                5,
                (Math.random() - 0.5) * 10
            );
            ball.castShadow = true;
            this.scene.add(ball);
            
            // Physics body for ball
            const ballShape = new CANNON.Sphere(0.5);
            const ballBody = new CANNON.Body({
                mass: 1,
                shape: ballShape,
                position: new CANNON.Vec3(ball.position.x, ball.position.y, ball.position.z)
            });
            this.physicsWorld.addBody(ballBody);
            
            // Store reference for animation
            ball.userData = { body: ballBody };
        }
    }
    
    async setupUI() {
        // Setup control buttons
        this.setupControlButtons();
        this.setupPhysicsPresets();
    }
    
    setupControlButtons() {
        const buttons = {
            'reset-btn': () => this.resetRagDoll(),
            'throw-btn': () => this.throwRagDoll(),
            'punch-btn': () => this.punchRagDoll(),
            'kick-btn': () => this.kickRagDoll(),
            'squeeze-btn': () => this.squeezeRagDoll()
        };
        
        Object.entries(buttons).forEach(([id, action]) => {
            const button = document.getElementById(id);
            if (button) {
                button.addEventListener('click', action);
            }
        });
    }
    
    setupPhysicsPresets() {
        const presets = {
            'normal-physics': { gravity: -9.82, damping: 0.01 },
            'bouncy-physics': { gravity: -5, damping: 0.005 },
            'heavy-physics': { gravity: -15, damping: 0.02 }
        };
        
        Object.entries(presets).forEach(([id, settings]) => {
            const button = document.getElementById(id);
            if (button) {
                button.addEventListener('click', () => {
                    this.applyPhysicsPreset(settings);
                    this.updatePresetButtons(id);
                });
            }
        });
    }
    
    updatePresetButtons(activeId) {
        document.querySelectorAll('.preset-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.getElementById(activeId).classList.add('active');
    }
    
    applyPhysicsPreset(settings) {
        this.physicsWorld.gravity.set(0, settings.gravity, 0);
        
        if (this.ragDoll && this.ragDoll.bodies) {
            this.ragDoll.bodies.forEach(body => {
                body.linearDamping = settings.damping;
                body.angularDamping = settings.damping;
            });
        }
    }
    
    // Action methods
    resetRagDoll() {
        if (this.ragDoll && this.ragDoll.bodies) {
            this.ragDoll.bodies.forEach((body, index) => {
                body.position.set(0, 2 + index * 0.5, 0);
                body.velocity.set(0, 0, 0);
                body.angularVelocity.set(0, 0, 0);
            });
        }
    }
    
    throwRagDoll() {
        if (this.ragDoll && this.ragDoll.bodies) {
            const force = new CANNON.Vec3(
                (Math.random() - 0.5) * 20,
                15,
                (Math.random() - 0.5) * 20
            );
            
            this.ragDoll.bodies.forEach(body => {
                body.applyImpulse(force, body.position);
            });
        }
    }
    
    punchRagDoll() {
        if (this.ragDoll && this.ragDoll.bodies) {
            const head = this.ragDoll.bodies[0];
            const force = new CANNON.Vec3(10, 5, 0);
            head.applyImpulse(force, head.position);
        }
    }
    
    kickRagDoll() {
        if (this.ragDoll && this.ragDoll.bodies) {
            const legs = [this.ragDoll.bodies[4], this.ragDoll.bodies[5]];
            legs.forEach(leg => {
                const force = new CANNON.Vec3(
                    (Math.random() - 0.5) * 15,
                    8,
                    (Math.random() - 0.5) * 15
                );
                leg.applyImpulse(force, leg.position);
            });
        }
    }
    
    squeezeRagDoll() {
        if (this.ragDoll && this.ragDoll.bodies) {
            this.ragDoll.bodies.forEach(body => {
                const force = new CANNON.Vec3(
                    (Math.random() - 0.5) * 5,
                    -2,
                    (Math.random() - 0.5) * 5
                );
                body.applyImpulse(force, body.position);
            });
        }
    }
    
    handleTap(x, y) {
        // Raycast to detect if user tapped on rag doll
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();
        
        mouse.x = (x / window.innerWidth) * 2 - 1;
        mouse.y = -(y / window.innerHeight) * 2 + 1;
        
        raycaster.setFromCamera(mouse, this.camera);
        
        if (this.ragDoll && this.ragDoll.meshes) {
            const intersects = raycaster.intersectObjects(this.ragDoll.meshes);
            if (intersects.length > 0) {
                // Apply random force to the tapped body part
                const index = this.ragDoll.meshes.indexOf(intersects[0].object);
                if (index !== -1 && this.ragDoll.bodies[index]) {
                    const force = new CANNON.Vec3(
                        (Math.random() - 0.5) * 10,
                        5,
                        (Math.random() - 0.5) * 10
                    );
                    this.ragDoll.bodies[index].applyImpulse(force, this.ragDoll.bodies[index].position);
                }
            }
        }
    }
    
    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
    
    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.classList.add('hidden');
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        }
    }
    
    showError(message) {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.innerHTML = `
                <div class="loading-content">
                    <h1>Oops!</h1>
                    <p>${message}</p>
                    <button onclick="location.reload()">Try Again</button>
                </div>
            `;
        }
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        
        if (!this.isLoaded) return;
        
        // Update physics
        this.physicsWorld.step(1/60);
        
        // Update rag doll meshes
        if (this.ragDoll && this.ragDoll.bodies && this.ragDoll.meshes) {
            this.ragDoll.bodies.forEach((body, index) => {
                if (this.ragDoll.meshes[index]) {
                    this.ragDoll.meshes[index].position.copy(body.position);
                    this.ragDoll.meshes[index].quaternion.copy(body.quaternion);
                }
            });
        }
        
        // Update interactive objects
        this.scene.children.forEach(child => {
            if (child.userData && child.userData.body) {
                child.position.copy(child.userData.body.position);
                child.quaternion.copy(child.userData.body.quaternion);
            }
        });
        
        // Update controls
        if (this.controls) {
            this.controls.update();
        }
        
        // Render
        this.renderer.render(this.scene, this.camera);
    }
}

// Initialize the game when the page loads
window.addEventListener('load', () => {
    new SillyBillyGame();
});