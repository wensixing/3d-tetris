var Tetris = {};
if ( !window.requestAnimationFrame ) {
    window.requestAnimationFrame = ( function() {
            return window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function( /* function FrameRequestCallback */ callback, /* DOMElement Element */ element ) {
            window.setTimeout( callback, 1000 / 60 );
            };
            })();
}
Tetris.sounds = {};
// wensixing
Tetris.init = function() {
    var WIDTH  = window.innerWidth,
        HEIGHT = window.innerHeight;

    var VIEW_ANGLE = 45;
        ASPECT = WIDTH / HEIGHT;
        NEAR = 0.1
        FAR = 10000;

    Tetris.renderer = new THREE.WebGLRenderer();
    Tetris.camera = new THREE.PerspectiveCamera(  VIEW_ANGLE,
            ASPECT,
            NEAR,
            FAR  );

    Tetris.scene = new THREE.Scene();

    // the camera starts at 0,0,0 so pull it back
    Tetris.camera.position.z = 600;
    Tetris.camera.lookAt(new THREE.Vector3( 0, 0, 0 ));

    Tetris.scene.add(Tetris.camera);


    // start the renderer
    Tetris.renderer.setSize(WIDTH, HEIGHT);

    // attach the render-supplied DOM element
    document.body.appendChild(Tetris.renderer.domElement);
    var boundingBoxConfig = {
        width: 360,
        height: 360,
        depth: 1200,
        splitX: 6,      // x 轴方向曲面划分为6个
        splitY: 6,
        splitZ: 20
    };
    Tetris.boundingBoxConfig = boundingBoxConfig;
    Tetris.blockSize = boundingBoxConfig.width/boundingBoxConfig.splitX;

    var boundingBox = new THREE.Mesh(
            new THREE.CubeGeometry(
                boundingBoxConfig.width, boundingBoxConfig.height, boundingBoxConfig.depth, 
                boundingBoxConfig.splitX, boundingBoxConfig.splitY, boundingBoxConfig.splitZ), 
            new THREE.MeshBasicMaterial( { color: 0xffaa00, wireframe: true } )
            );
    Tetris.scene.add(boundingBox);
    Tetris.renderer.render(Tetris.scene, Tetris.camera);
    Tetris.Board.init(boundingBoxConfig.splitX, boundingBoxConfig.splitY, boundingBoxConfig.splitZ);

    Tetris.stats = new Stats();
    Tetris.stats.domElement.style.position = 'absolute';
    Tetris.stats.domElement.style.top = '10px';
    Tetris.stats.domElement.style.left = '10px';
    document.body.appendChild(Tetris.stats.domElement);
    document.getElementById('play_button').addEventListener('click',function (event) {
            event.preventDefault();
            Tetris.start();
            });
    Tetris.gameStepTime = 1000;
    Tetris.frameTime = 0; // ms
    Tetris.cumulatedFrameTime = 0; // ms
    Tetris._lastFrameTime = Date.now(); // timestamp
    Tetris.gameOver = false;
    Tetris.sounds["theme"] = document.getElementById("audio_theme");
    Tetris.sounds["collision"] = document.getElementById("audio_collision");
    Tetris.sounds["move"] = document.getElementById("audio_move");
    Tetris.sounds["gameover"] = document.getElementById("audio_gameover");
    Tetris.sounds["score"] = document.getElementById("audio_score");
    Tetris.sounds["theme"].play();
}
Tetris.start = function(){
    Tetris.sounds["theme"].pause();
    document.getElementById("menu").style.display = "none";
    Tetris.pointsDOM = document.getElementById("points");
    Tetris.pointsDOM.style.display = "block";
//    document.body.addEventListener('mousedown',onDocumentMouseDown,false);
    Tetris.Block.generate();
    Tetris.animate();
}
Tetris.animate = function() {
    var time = Date.now();
    Tetris.frameTime = time - Tetris._lastFrameTime;
    Tetris._lastFrameTime = time;
    Tetris.cumulatedFrameTime += Tetris.frameTime;

    while(Tetris.cumulatedFrameTime > Tetris.gameStepTime) {
        Tetris.cumulatedFrameTime -= Tetris.gameStepTime;
        if(!Tetris.view_mode){
            Tetris.Block.move(0,0,-1);
        }
    }

    Tetris.renderer.render(Tetris.scene, Tetris.camera);

    Tetris.stats.update();

    Tetris.check_camera();
    if(!Tetris.gameOver) window.requestAnimationFrame(Tetris.animate);
}
Tetris.change_view = false;
Tetris.view_mode = false;
Tetris.speed = {"x":0,"y":0,"z":0,'set':false};
Tetris.target = {"x":0,"y":0,"z":600};

Tetris.change_camera = function(x,y,z){
    Tetris.change_view = true;
    Tetris.target['x'] = x;
    Tetris.target['y'] = y;
    Tetris.target['z'] = z;
    if(!Tetris.speed['set']){
        if(Tetris.camera.position.x != Tetris.target['x']){
            Tetris.speed['x'] = (Tetris.target['x'] - Tetris.camera.position.x)/120;
        }
        if(Tetris.camera.position.y != Tetris.target['y']){
            Tetris.speed['y'] = (Tetris.target['y'] - Tetris.camera.position.y)/120;
        }
        if(Tetris.camera.position.z != Tetris.target['z']){
            Tetris.speed['z'] = (Tetris.target['z'] - Tetris.camera.position.z)/120;
        }
        console.log("x :"+ Tetris.speed['x']);
        console.log("y :"+ Tetris.speed['y']);
        console.log("z :"+ Tetris.speed['z']);
        Tetris.speed['set'] = true;
    }
}

Tetris.check_camera = function(){
    if(Tetris.change_view){
        if(Tetris.camera.position.x != Tetris.target['x']){
            Tetris.camera.position.x += Tetris.speed['x'];
        }
        if(Tetris.camera.position.y != Tetris.target['y']){
            Tetris.camera.position.y += Tetris.speed['y'];
        }
        if(Tetris.camera.position.z != Tetris.target['z']){
            Tetris.camera.position.z += Tetris.speed['z'];
        }
        if(Tetris.camera.position.x == Tetris.target['x'] &&
           Tetris.camera.position.y == Tetris.target['y'] &&
           Tetris.camera.position.z == Tetris.target['z']){
            Tetris.change_view  = false;
            Tetris.speed['set'] = false;
            Tetris.speed['x']   = 0;
            Tetris.speed['y']   = 0;
            Tetris.speed['z']   = 0;
        }
        Tetris.camera.lookAt(new THREE.Vector3( 0, 0, 0 ));
    }
}

//function onDocumentMouseDown(event){
//    event.preventDefault();
//    document.body.addEventListener('mousemove', onDocumentMouseMove, false);
//    document.body.addEventListener('mouseup',   onDocumentMouseUp,  false);
//    event.clientX;
//}
//function onDocumentMouseMove(event){
//    // caculate camera
//    mouseX = event.clientX - windowHalfX;
//    targetRotation = targetRotationOnMouseDown + ( mouseX - mouseXOnMouseDown ) * 0.02;
//}
//function onDocumentMouseUp(event){
//    document.body.removeEventListener('mousedown',  onDocumentMouseDown,false);
//    document.body.removeEventListener('mouseup',    onDocumentMouseUp,  false);
//    document.body.removeEventListener('mousemove',  onDocumentMouseMove,false);
//}
//
window.addEventListener("load", Tetris.init);
window.addEventListener("keydown", function(event){
    var key = event.which ? event.which : event.keyCode;
    switch(key) {
    case 38: // up (arrow)
    Tetris.Block.move(0, 1, 0);
    break;
    case 40: // down (arrow)
    Tetris.Block.move(0, -1, 0);
    break;
    case 37: // left(arrow)
    Tetris.Block.move(-1, 0, 0);
    break;
    case 39: // right (arrow)
    Tetris.Block.move(1, 0, 0);
    break;
    case 32: // space
    Tetris.Block.move(0, 0, -1);
    break;

    case 87: // up (w)
    Tetris.Block.rotate(90, 0, 0);
    break;
    case 83: // down (s)
    Tetris.Block.rotate(-90, 0, 0);
    break;

    case 65: // left(a)
    Tetris.Block.rotate(0, 0, 90);
    break;
    case 68: // right (d)
    Tetris.Block.rotate(0, 0, -90);
    break;

    case 81: // (q)
    Tetris.Block.rotate(0, 90, 0);
    break;

    case 69: // (e)
    Tetris.Block.rotate(0, -90, 0);
    break;

    case 86: // (v)
    if(Tetris.view_mode){
        Tetris.view_mode = false;
        console.log('view off');
    }else{
        Tetris.view_mode = true;
        console.log('view on');
    }
    break;
    case 48: // 0
    if(Tetris.view_mode){
        Tetris.change_camera(0,0,600);
    }
    break;
    case 49: // 1
    if(Tetris.view_mode){
        Tetris.change_camera(720,0,0);
    }
    break;
    case 50: // 2
    if(Tetris.view_mode){
        Tetris.change_camera(0,720,0);
    }
    break;
    }
},false);
