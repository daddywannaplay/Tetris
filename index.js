document.addEventListener('DOMContentLoaded',() => {
    let grid = document.querySelector('.grid');
    let squares = Array.from(document.querySelectorAll('.grid div'));
    let btnStart = document.getElementById("start-button");
    const scoreDisplay = document.querySelector('#score')
    let score =0;
    let timerID;
    let next_random = 0;
    const width = 10;

    const lTetromino = [
        [1, width+1, width*2+1, 2],
        [width, width+1, width+2, width*2+2],
        [1, width+1, width*2+1, width*2],
        [width, width*2, width*2+1, width*2+2]
      ]
    
      const zTetromino = [
        [0,width,width+1,width*2+1],
        [width+1, width+2,width*2,width*2+1],
        [0,width,width+1,width*2+1],
        [width+1, width+2,width*2,width*2+1]
      ]
    
      const tTetromino = [
        [1,width,width+1,width+2],
        [1,width+1,width+2,width*2+1],
        [width,width+1,width+2,width*2+1],
        [1,width,width+1,width*2+1]
      ]
    
      const oTetromino = [
        [0,1,width,width+1],
        [0,1,width,width+1],
        [0,1,width,width+1],
        [0,1,width,width+1]
      ]
    
      const iTetromino = [
        [1,width+1,width*2+1,width*3+1],
        [width,width+1,width+2,width+3],
        [1,width+1,width*2+1,width*3+1],
        [width,width+1,width+2,width+3]
      ]
    
      const theTetrominoes = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino]

      let currentRotation =0;
      let random = Math.floor((Math.random()*theTetrominoes.length));
      let currentPosition =4;
      let current = theTetrominoes[random][currentRotation];


      function draw(){
        current.forEach(items =>{
            squares[currentPosition + items].classList.add('tetromino')
        })
      }

      function undraw(){
        current.forEach(items =>{
            squares[currentPosition + items].classList.remove('tetromino')
        })
      }




    
    
    function movedown(){
        undraw();
        currentPosition+= width;
        draw();
        check();
    }
    function check(){
        if(current.some(items =>squares[currentPosition+items+width].classList.contains("taken"))){
            current.forEach(it =>squares[currentPosition+it].classList.add('taken'));
            // start new falling
            random = next_random;
            next_random = Math.floor(Math.random()*theTetrominoes.length);
            current = theTetrominoes[random][currentRotation];
            currentPosition =4;
            draw();
            displayNext();
            addScore();
            gameOver();
        }
        
    }

    //move left
    function moveLeft(){
        undraw();
        const isAtLeftEdge = current.some(index => (currentPosition+index)%width === 0);

        if(!isAtLeftEdge)currentPosition--;
        if(current.some(index => squares[currentPosition+index].classList.contains('taken'))){
            currentPosition++;
        }
        draw();
    }

    function moveRight(){
        undraw();
        const isAtRightEdge = current.some(index => (currentPosition+index)%width === width-1);

        if(!isAtRightEdge)currentPosition++;
        if(current.some(index => squares[currentPosition+index].classList.contains('taken'))){
            currentPosition--;
        }
        draw();
    }


    function rotate(){
        undraw();
        currentRotation++;
        if(currentRotation == current.length){
            currentRotation =0;
        }
        // console.log(currentRotation);
        current = theTetrominoes[random][currentRotation]
        draw();
    }

    // mapping keypresses to function 
    function control(e){
        if(e.keyCode === 37){
            moveLeft();
        }
        if(e.keyCode === 38 || e.keyCode === 40){
            rotate();
        }
        if(e.keyCode === 39){
            moveRight();
        }
    }
    document.addEventListener('keyup',control)

    
    
    //mini-grid
    const displayWidth =4;
    const displaySquares = document.querySelectorAll('.mini-grid div');
    const displayStart =0;

    // console.log(displaySquares.length);
    const upNextTertromino = [
        [1, displayWidth+1, displayWidth*2+1, 2], //lTetromino
        [0, displayWidth, displayWidth+1, displayWidth*2+1], //zTetromino
        [1, displayWidth, displayWidth+1, displayWidth+2], //tTetromino
        [0, 1, displayWidth, displayWidth+1], //oTetromino
        [1, displayWidth+1, displayWidth*2+1, displayWidth*3+1] //iTetromino
    ]

    function displayNext(){
        // remove all traces of tetromino class
        displaySquares.forEach(square => {
            square.classList.remove('tetromino');
        })
        upNextTertromino[next_random].forEach(index =>{
            displaySquares[index+displayStart].classList.add('tetromino');
        })
    }

    btnStart.addEventListener('click',()=>{
        if(timerID){
            clearInterval(timerID);
            timerID = null;
        }
        else{
            draw();
            timerID = setInterval(movedown,1000);
            next_random = Math.floor(Math.random()*theTetrominoes.length)
            displayNext()
        }
    })

    function addScore(){
        for(let i =0;i<199;i+=width){
            const row = [i,i+1,i+2,i+3,i+4,i+5,i+6,i+7,i+8,i+9];
            if(row.every(cell => squares[cell].classList.contains('taken'))){
                score+=10;
                scoreDisplay.innerHTML = score;
                row.forEach(index =>{
                    squares[index].classList.remove('tetromino')
                    squares[index].classList.remove('taken');
                });
                const removedSquares = squares.splice(i,width);
                squares = removedSquares.concat(squares) // removedSquares is concatanetated with sqaures
                squares.forEach(cell => grid.appendChild(cell))
            }
        }
    }

    //gameover function

    function gameOver(){
        if(current.some(cell => squares[currentPosition+cell].classList.contains('taken'))){
            scoreDisplay.innerHTML = "end";
            clearInterval(timerID);
        }
    }
    
   
    
})