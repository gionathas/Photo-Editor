function Paint(canvas,backgroundImage)
{
    this.canvas = canvas;
    this.image = backgroundImage;

    let context = this.canvas.getContext('2d');
    let paint = false;

    //image
    let img = new Image();
    img.src = backgroundImage;

    let color = 'rgb(0,0,255)';
    let size = 10;

    let paintPoints = new Array();
    let tool = 'pen';

    this.setColor = function(newColor){
        color = newColor;
    }

    this.setSize = function(newSize){
        size = newSize;
    }

    this.setTool = function(newTool){
        tool = newTool;
    }

    this.clear = function(){
        paintPoints = new Array();
        draw();
    }

    this.start = function(){
        this.color = 'rgb(0,0,255)';
        this.size = 10;
        //on mouse down
        this.canvas.addEventListener('mousedown',function(evt){
            let mousePosition = getMousePosition(canvas,evt);

            paint = true;

            if(tool == 'pen'){   
                addPoint(mousePosition,false,color,size);
            }
            //eraser
            else{
                removePoints(mousePosition);
            }
            draw();
        })

        // on mouse move
        this.canvas.addEventListener('mousemove',function(evt){
            if(paint){

                if(tool == 'pen'){
                    addPoint(getMousePosition(canvas,evt),true,color,size);
                }
                //eraser
                else{
                    removePoints(getMousePosition(canvas,evt));
                }

                draw();
            }
        })

        //on mouse up
        this.canvas.addEventListener('mouseup',function(){
            paint = false;
        });

        //on mouse leave canvas
        this.canvas.addEventListener('mouseleave',function(){
            paint = false;
        })

        img.onload = function(){
             //calculate image parameters
            hRatio = canvas.width  / img.width;
            vRatio =  canvas.height / img.height;
            ratio  = Math.min ( hRatio, vRatio );
            centerShift_x = ( canvas.width - img.width*ratio ) / 2;
            centerShift_y = ( canvas.height - img.height*ratio ) / 2; 
            draw();
        }

    }

    //add a new point to draw
    function addPoint(point,dragging,color,size){
        let newPoint = new PaintPoint(point.x,point.y,dragging,color,size)
        paintPoints.push(newPoint);
    }

    function removePoints(point){
        paintPoints.filter(function(PaintPoint){
            return !isNearPoint(point,PaintPoint);
        })
    }

    function isNearPoint(point1,point2){
        if(Math.abs(point1.x - point2.x) < size && Math.abs(point1.y - point2.y) < size){
            return true;
        }else{
            return false;
        }
    }

    function draw(){        
        
        // clear the canvas
        context.clearRect(0,0,this.canvas.width,this.canvas.height);

        context.drawImage(img, 0,0, img.width, img.height,
            centerShift_x,centerShift_y,img.width*ratio, img.height*ratio);

            console.log(paintPoints);
            
        
        //drawing brush lines
        context.lineJoin = "round";

        for (let i = 0; i < paintPoints.length; i++) {
            context.beginPath();
            
            if(paintPoints[i].drag && i){
                context.moveTo(paintPoints[i-1].x,paintPoints[i-1].y);
            }
            else{
                context.moveTo((paintPoints[i]-1).x, paintPoints[i].y);
            }

            context.lineTo(paintPoints[i].x, paintPoints[i].y);
            context.closePath();
            context.strokeStyle = paintPoints[i].color;
            context.lineWidth = paintPoints[i].size;
            context.stroke();
        }
    }
}

function PaintPoint(x,y,drag,color,size)
{
    this.x = x;
    this.y = y;
    this.drag = drag;
    this.color = color;
    this.size = size;
}

function getMousePosition(canvas,evt)
{
    const rect = canvas.getBoundingClientRect();
    return { x: evt.clientX - rect.left,y: evt.clientY - rect.top};
}