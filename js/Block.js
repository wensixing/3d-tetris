Tetris.staticBlocks = [];
Tetris.zColors = [
  0x6666ff, 0x66ffff, 0xcc68EE, 0x666633, 0x66ff66, 0x9966ff, 0x00ff66, 0x66EE33, 0x003399, 0x330099, 0xFFA500, 0x99ff00, 0xee1289, 0x71C671, 0x00BFFF, 0x666633, 0x669966, 0x9966ff
  ];

Tetris.addStaticBlock = function(x,y,z) {
  if(Tetris.staticBlocks[x] === undefined) Tetris.staticBlocks[x] = [];
  if(Tetris.staticBlocks[x][y] === undefined) Tetris.staticBlocks[x][y] = [];

  var mesh = THREE.SceneUtils.createMultiMaterialObject(new THREE.CubeGeometry( Tetris.blockSize, Tetris.blockSize, Tetris.blockSize), [
          new THREE.MeshBasicMaterial({color: 0x000000, shading: THREE.FlatShading, wireframe: true, transparent: true}),
          new THREE.MeshBasicMaterial({color: Tetris.zColors[z]}) 
          ] );
  // x ranges 0~5
  // so , (x - Tetris.boundingBoxConfig.splitX/2) tranform 0~5 to -3~2
  // (x - Tetris.boundingBoxConfig.splitX/2)*Tetris.blockSize) can specify the cube' corner. 
  // but we specify cube center, not a corner - we have to shift position. so just add (Tetris.blockSize/2)
  mesh.position.x = (x - Tetris.boundingBoxConfig.splitX/2)*Tetris.blockSize + Tetris.blockSize/2;
  mesh.position.y = (y - Tetris.boundingBoxConfig.splitY/2)*Tetris.blockSize + Tetris.blockSize/2;
  mesh.position.z = (z - Tetris.boundingBoxConfig.splitZ/2)*Tetris.blockSize + Tetris.blockSize/2;
  mesh.overdraw = true;

  Tetris.scene.add(mesh);
  Tetris.staticBlocks[x][y][z] = mesh;
};
Tetris.currentPoints = 0;
Tetris.addPoints = function(n) {
    Tetris.currentPoints += n;
    Tetris.pointsDOM.innerHTML = Tetris.currentPoints;
    Cufon.replace('#points');
}
var i = 0, j = 0, k = 0;
// test
//interval = setInterval(function() {
//    if(i==6) {i=0;j++;} 
//    if(j==6) {j=0;k++;} 
//    if(k==6) {clearInterval(interval); return;} 
//    Tetris.addStaticBlock(i,j,k); i++;
//    },30)

