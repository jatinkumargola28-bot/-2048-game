let grid = [];
let score = 0;
let best = localStorage.getItem("bestScore") || 0;

document.getElementById("best").textContent = best;

window.onload = () => {
  init();
};

function init() {
  grid = Array(4).fill().map(() => Array(4).fill(0));
  score = 0;
  addTile();
  addTile();
  update();
}

function addTile() {
  let empty = [];
  for (let i=0;i<4;i++)
    for (let j=0;j<4;j++)
      if (grid[i][j]==0) empty.push({i,j});

  if (!empty.length) return;

  let {i,j} = empty[Math.floor(Math.random()*empty.length)];
  grid[i][j] = Math.random()>0.5?2:4;
}

function update() {
  let g = document.getElementById("grid");
  g.innerHTML="";

  grid.forEach(r=>{
    r.forEach(v=>{
      let d=document.createElement("div");
      d.className="tile";
      if(v){
        d.textContent=v;
        d.setAttribute("data-value",v);
      }
      g.appendChild(d);
    });
  });

  document.getElementById("score").textContent=score;

  if(score>best){
    best=score;
    localStorage.setItem("bestScore",best);
    document.getElementById("best").textContent=best;
  }
}

function slide(row){
  row=row.filter(v=>v);
  for(let i=0;i<row.length-1;i++){
    if(row[i]==row[i+1]){
      row[i]*=2;
      score+=row[i];
      row[i+1]=0;
    }
  }
  row=row.filter(v=>v);
  while(row.length<4) row.push(0);
  return row;
}

function rotate(){
  let n=Array(4).fill().map(()=>Array(4).fill(0));
  for(let i=0;i<4;i++)
    for(let j=0;j<4;j++)
      n[j][3-i]=grid[i][j];
  grid=n;
}

function move(dir){
  let old=JSON.stringify(grid);

  if(dir=="up") rotate(),rotate(),rotate();
  if(dir=="right") rotate(),rotate();
  if(dir=="down") rotate();

  for(let i=0;i<4;i++) grid[i]=slide(grid[i]);

  if(dir=="up") rotate();
  if(dir=="right") rotate(),rotate();
  if(dir=="down") rotate(),rotate(),rotate();

  if(JSON.stringify(grid)!=old){
    addTile();
    update();
  }

  if(gameOver()){
    document.getElementById("gameOver").classList.remove("hidden");
  }
}

function gameOver(){
  for(let i=0;i<4;i++){
    for(let j=0;j<4;j++){
      if(grid[i][j]==0) return false;
      if(j<3 && grid[i][j]==grid[i][j+1]) return false;
      if(i<3 && grid[i][j]==grid[i+1][j]) return false;
    }
  }
  return true;
}

document.addEventListener("keydown",e=>{
  if(["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].includes(e.key)){
    e.preventDefault();  // 🔥 scroll band
  }

  if(e.key=="ArrowLeft") move("left");
  if(e.key=="ArrowRight") move("right");
  if(e.key=="ArrowUp") move("up");
  if(e.key=="ArrowDown") move("down");
});

function restartGame(){
  document.getElementById("gameOver").classList.add("hidden");
  init();
}
