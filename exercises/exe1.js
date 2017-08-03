var scene, camera, renderer, cubeMesh, cloud;

function init() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
  camera.position.z = 150;
  
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);

  document.body.appendChild(renderer.domElement);
}

function addCube() {
  var cubeGeometry = new THREE.BoxGeometry(200,200,200);
  var cubeMaterial = new THREE.MeshBasicMaterial({color: 0xff0000, wireframe: true });
  cubeMesh = new THREE.Mesh(cubeGeometry, cubeMaterial);
  scene.add(cubeMesh);
} 

function animate() {
  requestAnimationFrame(animate);
  animateRain();
  render();
}

function render() {
  renderer.render(scene,camera);
}


function createParticals() {
  var material = new THREE.SpriteMaterial({color:0xff0000});
  for(var x=-5;x<5;x++) {
    for(var y=-5;y<5;y++) {
      var particle = new THREE.Sprite(new THREE.SpriteMaterial({color:Math.random() * 0x00ffff}));
      particle.position.set(x*10,y*10,0);
      particle.x = 110;
      scene.add(particle);
    }
  }
}

function getTexture() {
  var canvas = document.createElement('canvas');
  canvas.width = 32;
  canvas.height = 32;

  var ctx = canvas.getContext('2d');
  ctx.translate(-81, -84);

  ctx.fillStyle = "orange";
  ctx.beginPath();
  ctx.moveTo(83, 116);
  ctx.lineTo(83, 102);
  ctx.bezierCurveTo(83, 94, 89, 88, 97, 88);
  ctx.bezierCurveTo(105, 88, 111, 94, 111, 102);
  ctx.lineTo(111, 116);
  ctx.lineTo(106.333, 111.333);
  ctx.lineTo(101.666, 116);
  ctx.lineTo(97, 111.333);
  ctx.lineTo(92.333, 116);
  ctx.lineTo(87.666, 111.333);
  ctx.lineTo(83, 116);
  ctx.fill();

  // the eyes
  ctx.fillStyle = "white";
  ctx.beginPath();
  ctx.moveTo(91, 96);
  ctx.bezierCurveTo(88, 96, 87, 99, 87, 101);
  ctx.bezierCurveTo(87, 103, 88, 106, 91, 106);
  ctx.bezierCurveTo(94, 106, 95, 103, 95, 101);
  ctx.bezierCurveTo(95, 99, 94, 96, 91, 96);
  ctx.moveTo(103, 96);
  ctx.bezierCurveTo(100, 96, 99, 99, 99, 101);
  ctx.bezierCurveTo(99, 103, 100, 106, 103, 106);
  ctx.bezierCurveTo(106, 106, 107, 103, 107, 101);
  ctx.bezierCurveTo(107, 99, 106, 96, 103, 96);
  ctx.fill();

  // the pupils
  ctx.fillStyle = "blue";
  ctx.beginPath();
  ctx.arc(101, 102, 2, 0, Math.PI * 2, true);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(89, 102, 2, 0, Math.PI * 2, true);
  ctx.fill();

  var texture = new THREE.Texture(canvas);
  texture.needsUpdate = true;
  return texture;
}

//粒子系统canvas
function createPointCloudCanvas() {
  var geom = new THREE.Geometry();
  var range = 500;
  var material = new THREE.PointCloudMaterial({size:6,map:getTexture(),opacity:0.8,transparent:false});
  for(var i=0 ;i < 10000; i++) {
    var particle = new THREE.Vector3(Math.random()*range - range/2,Math.random()*range -range/2,Math.random()*range -range/2);
    geom.vertices.push(particle);
  }
  cloud = new THREE.PointCloud(geom,material);
  scene.add(cloud);
}

//粒子系统
function createPointCloud() {
  var geom = new THREE.Geometry();
  var range = 500;
  var material = new THREE.PointCloudMaterial({size:6,vertexColors:true,opacity:0.8,transparent:true});
  for(var i=0 ;i < 10000; i++) {
    var particle = new THREE.Vector3(Math.random()*range - range/2,Math.random()*range -range/2,Math.random()*range -range/2);
    geom.vertices.push(particle);
    geom.colors.push(new THREE.Color(Math.random() * 0x00ffff));
  }
  cloud = new THREE.PointCloud(geom,material);
  cloud.sortParticles = true;
  scene.add(cloud);
}

//
function createPointCloudRain() {
  var geom = new THREE.Geometry();
  var range = 500;
  var textureRain1 = THREE.ImageUtils.loadTexture("../assets/textures/particles/raindrop-3.png");
  var textureRain2 = THREE.ImageUtils.loadTexture("../assets/textures/particles/snowflake4.png");
  var textureRain3 = THREE.ImageUtils.loadTexture("../assets/textures/particles/snowflake2.png");
  
  var material1 = new THREE.PointCloudMaterial({size:6,map:textureRain1,blending: THREE.AdditiveBlending,transparent:true,opacity:0.9,color:0xffffff});
  var material2 = new THREE.PointCloudMaterial({size:6,map:textureRain2,blending: THREE.AdditiveBlending,transparent:true,opacity:0.9,color:0xffffff});
  var material3 = new THREE.PointCloudMaterial({size:6,map:textureRain3,blending: THREE.AdditiveBlending,transparent:true,opacity:0.9,color:0xffffff});
  
  for(var i=0;i<10000;i++) {
    var particle = new THREE.Vector3(Math.random()*range - range/2,Math.random()*range -range/2,Math.random()*range -range/2);
    particle.velocityY = 0.1 + Math.random() / 5;
    particle.velocityX = (Math.random() - 0.5) / 3;
    geom.vertices.push(particle);
  }
  cloud1 = new THREE.PointCloud(geom,material1);
  cloud1.sortParticles = true;
  scene.add(cloud1);
}

function animateRain() {
  var vertices1 = cloud1.geometry.vertices;
  var yBoundrary = window.innerHeight / 2 ;
  vertices1.forEach(function (v) {
      v.y = v.y - (v.velocityY);
      v.x = v.x - (v.velocityX);

      if (v.y <=  yBoundrary * -1) v.y = window.innerHeight / 2;
      if (v.x <= -20 || v.x >= 20) v.velocityX = v.velocityX * -1;
  });
}

function animateCloud() {
  cloud.rotation.x += 0.0005;
  cloud.rotation.z += 0.0005;
}


init();
createPointCloudRain();
animate();