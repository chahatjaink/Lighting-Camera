import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

// Loaders

const cubeTextureLoader = new THREE.CubeTextureLoader();

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Update 
const updateAllMaterials = () => {
    scene.traverse((child) => {
        console.log(child);
    })
}

/**
 * Enviorment Map
 */
const enviormentMap = cubeTextureLoader.load([
    '/textures/environmentMaps/0/px.jpg',
    '/textures/environmentMaps/0/nx.jpg',
    '/textures/environmentMaps/0/py.jpg',
    '/textures/environmentMaps/0/ny.jpg',
    '/textures/environmentMaps/0/pz.jpg',
    '/textures/environmentMaps/0/nz.jpg'
])

scene.background = enviormentMap;
scene.environment = enviormentMap;
/**
 * MODELS
 */
new GLTFLoader().load(
    '/models/FlightHelmet/glTF/Camera.gltf',
    (gltf) => {
        console.log('camera');
        gltf.scene.scale.set(4, 4, 4)
        gltf.scene.position.set(0, -3, 1)
        gltf.scene.rotation.y = Math.PI * 0.5
        scene.add(gltf.scene)
        // updateAllMaterials()
    }
)


/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 3)
ambientLight.position.set(0, 0, 0)
scene.add(ambientLight)

// const fog=new THREE.Fog(0xff00ff,2,18)
// scene.fog=fog

const directionalLight = new THREE.DirectionalLight(0xff0000, 4)
directionalLight.position.set(0, -0.5, 0)
scene.add(directionalLight)

// LightHelper
const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 0.2)
scene.add(directionalLightHelper)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(4, 0, - 4)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const tick = () => {
    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()