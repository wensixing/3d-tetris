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
}
Tetris.start = function(){
    document.getElementById("menu").style.display = "none";
    Tetris.pointsDOM = document.getElementById("points");
    Tetris.pointsDOM.style.display = "block";
    if(Tetris.Block.shapes);
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
        Tetris.Block.move(0,0,-1);
    }

    Tetris.renderer.render(Tetris.scene, Tetris.camera);

    Tetris.stats.update();

    if(!Tetris.gameOver) window.requestAnimationFrame(Tetris.animate);
}
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
    }
},false);
