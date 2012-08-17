if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

/******
 *
 * SCENE
 *
 *******/



// set the scene size
var WIDTH = window.innerWidth,
    HEIGHT = window.innerHeight;

// set some camera attributes
var VIEW_ANGLE = 45,
    ASPECT = WIDTH / HEIGHT,
    NEAR = 0.1,
    FAR = 10000;

var scene = new THREE.Scene();


/******
 *
 * RENDERER
 *
 *******/

// create a WebGL renderer, camera
// and a scene
var renderer = new THREE.WebGLRenderer({ antialias: true } );
// start the renderer
// start the renderer - set the clear colour
// to a full black
renderer.setClearColor(new THREE.Color(0, 1));
renderer.setSize(WIDTH, HEIGHT);

// get the DOM element to attach to
// - assume we've got jQuery to hand
var $container = $('#container');
// attach the render-supplied DOM element
$container.append(renderer.domElement);

stats = new Stats();
stats.domElement.style.position = 'absolute';
stats.domElement.style.top = '0px';
$container.append( stats.domElement );

/******
 *
 * CAMERA
 *
 *******/


var camera = new THREE.PerspectiveCamera(  VIEW_ANGLE,
    ASPECT,
    NEAR,
    FAR  );
// the camera starts at 0,0,0 so pull it back
camera.position.z = 2000;
// and the camera
scene.add(camera);

// create a camera contol
controls = new THREE.TrackballControls(camera);
controls.target.set( 0, 0, 0 );

controls.rotateSpeed = 1.0;
controls.zoomSpeed = 1.2;
controls.panSpeed = 0.8;

controls.noZoom = false;
controls.noPan = true;

controls.staticMoving = false;
controls.dynamicDampingFactor = 0.15;

controls.keys = [ 65, 83, 68 ];

/******
 *
 * CENTRAL AXIS MARKER
 *
 *******/

var lineGeo = new THREE.Geometry();
lineGeo.vertices.push(
    new THREE.Vector3(-100, 0, 0), new THREE.Vector3(100, 0, 0),
    new THREE.Vector3(0, -100, 0), new THREE.Vector3(0, 100, 0),
    new THREE.Vector3(0, 0, -100), new THREE.Vector3(0, 0, 100)
);
var lineMat = new THREE.LineBasicMaterial({
    color: 0xFFFFFF, lineWidth: 1});
var line = new THREE.Line(lineGeo, lineMat);
line.type = THREE.Lines;
scene.add(line);



/******
 *
 * Lights
 *
 *******/

var wireMat = new THREE.MeshBasicMaterial({color: 0xFFFFFF, wireframe: true});
var meshCube = new THREE.Mesh(
    new THREE.CubeGeometry(1000,1000,1000, 1,1,1), // 10 segments
    wireMat
);
scene.add(meshCube);

/******
 *
 * Particles
 *
 *******/
 var Enviroment = function(){
	this.particleCount = 1800;
	this.particleVelocity = 0.5;
 };
 var env = new Enviroment();
 
// create the particle variables
var particles = new THREE.Geometry(),
    material,
    colors = [],
    sprite = THREE.ImageUtils.loadTexture( "images/particle.png" );

// now create the individual particles
for(var p = 0; p < env.particleCount; p++) {

    var vertex = new THREE.Vector3();
    vertex.x = 1000 * Math.random() - 500;
    vertex.y = 1000 * Math.random() - 500;
    vertex.z = 1000 * Math.random() - 500;

    vertex.velocity = new THREE.Vector3(
        randomFromTo(-Math.random(), Math.random()),				// x
        randomFromTo(-Math.random(), Math.random()),	// y
        randomFromTo(-Math.random(), Math.random()));

    particles.vertices.push( vertex );

    colors[ p ] = new THREE.Color( 0xffffff );
    colors[ p ].setRGB( vertex.x / 255 , vertex.y / 255, vertex.z / 255 );
}
particles.colors = colors;

material = new THREE.ParticleBasicMaterial( { size: 85, map: sprite, vertexColors: true, blending: THREE.AdditiveBlending,
    transparent: true } );
material.color.setHSV( 1.0, 0.2, 0.8 );

// create the particle system
var particleSystem =
    new THREE.ParticleSystem(
        particles,
        material);

// add it to the scene
scene.add(particleSystem);

// also update the particle system to
// sort the particles which enables
// the behaviour we want
particleSystem.sortParticles = true;

/******
 *
 * FUNCTIONS
 *
 *******/
function randomFromTo(from, to) {
	return Math.floor(Math.random() * (to - from + 1) + from);
}

function animate(){
    var time = Date.now() * 0.00005;
    h = ( 360 * ( 1.0 + time ) % 360 ) / 360;
    //material.color.setRGB(h, 1, 1 );

   var rndmValue = Math.random() * .5;
   for(var i=0;i<env.particleCount;i++) {
        // get the particle
        var particle = particles.vertices[i];

        // check if we need to reset
        if(particle.y <= -500) {
            particle.y = 500;
        }else if(particle.y >= 500){
            particle.y = -500;
        }

       if(particle.x <= -500) {
           particle.x = 500;
       }
       else if(particle.x >= 500){
           particle.x = -500;
       }

       if(particle.z <= -500) {
           particle.z = 500;
       }else if(particle.z >= 500){
           particle.z = -500;
       }


       // and the position
       particle.addSelf(particle.velocity);

       // Update colours
       colors[i].setRGB( particle.x / 255 , particle.y / 255, particle.z / 255 );
       particle.colors = colors;

    }

    controls.update();
    renderer.render(scene, camera);
    stats.update();
    requestAnimationFrame(animate);
}

animate();
