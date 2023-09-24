import './style.css'
import * as THREE from "three"
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader"
import {FBXLoader} from "three/examples/jsm/loaders/FBXLoader"
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls"

const canvas = document.querySelector("canvas.webgl")
const renderer = new THREE.WebGL1Renderer({canvas,alpha:true})
const sizes = {
    width : window.innerWidth,
    height : window.innerHeight
}
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, sizes.width/sizes.height,0.1,100)
const gltfLoader = new GLTFLoader()
const controls = new OrbitControls(camera, canvas)

camera.position.set(0,2,2)
renderer.setSize(sizes.width, sizes.height)
renderer.shadowMap.enabled = true
controls.enableDamping = true
controls.autoRotate = true
controls.autoRotateSpeed = 0.1
controls.enabled = false

// Time
const now = new Date()
let hours = now.getHours()
const meridiem = hours >= 12 ? 'PM' : 'AM';
hours = hours % 12;
hours = hours ? hours : 12;
// Clock
const updateClock = ()=>
{
    // Time
    const current = new Date()
    let minutes = current.getMinutes()
    let seconds= current.getSeconds()
    minutes = (minutes < 10 ? "0" : "") + minutes;
    seconds = (seconds < 10 ? "0" : "") + seconds;
    const time = hours+":"+minutes+":"+seconds+" "+meridiem
    const clock = document.getElementById("clock")
    clock.textContent = time

    const title = document.getElementById("title");
    title.innerHTML = `Freddy Minn <br> is Coding...`
}
setInterval(updateClock, 1000)

let model,mixer;
const animate = (path)=>
{
    var fbxLoader = new FBXLoader()
    fbxLoader.load(path,(animation)=>
    {
        mixer = new THREE.AnimationMixer(model)
        var action = mixer.clipAction(animation.animations[0])
        action.play()
    })
}

gltfLoader.load("./freddyminn.glb",(gltf)=>
{
    model = gltf.scene
    model.rotation.x = -Math.PI * 0.5
    model.rotation.z = -0.1
    scene.add(model)
    model.traverse(function (node) {
        if (node.isMesh) {
          node.castShadow = true;
          node.receiveShadow = true;
        }
      });
    animate("./Animation/Typing.fbx")
})

const ambient = new THREE.AmbientLight(0xffffff)
scene.add(ambient)

const sunlight = new THREE.DirectionalLight(0xffffff)
sunlight.castShadow = true
sunlight.rotation.y = -Math.PI
sunlight.position.set(5,100,0)
scene.add(sunlight)


// Plane
const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(2,3),
    new THREE.MeshStandardMaterial({
        color:0xffffff,
        roughness:0.3,
        metalness:0.4
    })
)
plane.rotation.x = -Math.PI * 0.5
plane.receiveShadow = true
scene.add(plane)

gltfLoader.load("./models/gaming_chair.glb",(gltf)=>
{
    const model = gltf.scene
    scene.add(model)
    model.traverse(function (node) {
        if (node.isMesh) {
          node.castShadow = true;
          node.receiveShadow = true;
        }
      });
})

gltfLoader.load("./models/cyberpunk_desk.glb",(gltf)=>
{
    const model = gltf.scene
    model.scale.set(0.26,0.26,0.26)
    model.rotation.y = -Math.PI
    model.position.set(-1.8,-0.17,-0.7)
    scene.add(model)
    model.traverse(function (node) {
        if (node.isMesh) {
          node.castShadow = true;
          node.receiveShadow = true;
        }
      });
})

// EventListener
window.addEventListener("resize",()=>
{
	sizes.width = window.innerWidth
	sizes.height = window.innerHeight
	// Camera aspect
	camera.aspect = sizes.width/sizes.height
	// Camera Projection Matrix
	camera.updateProjectionMatrix()
	// Renderer Size
	renderer.setSize(sizes.width, sizes.height)
	// Pixel Ratio
	renderer.setPixelRatio(Math.min(window.devicePixelRatio,2))
})

// Fullscreen
window.addEventListener("dblclick",()=>
{
	if(!document.fullscreenElement)
	{
		canvas.requestFullscreen()
        scene.background = new THREE.Color(0xffffff)

	}else{
		document.exitFullscreen()
	}
})

const clock = new THREE.Clock()
const tick = ()=>
{
    var delta = clock.getDelta()
    if(mixer)
    {
        mixer.update(delta)

    }
    window.requestAnimationFrame(tick)
    renderer.render(scene, camera)
    controls.update()
}
tick()
