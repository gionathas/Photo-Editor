function Paint(canvas,backgroundImage)
{
    this.canvas = canvas;
    this.image = backgroundImage;

    let context = this.canvas.getContext('2d');
    let paint = false;

    //image
    let img = new Image();
    img.src = backgroundImage;

    //brush elements
    let brushColor = 'rgb(0,0,255)';
    let brushSize = 10;

    let paintPoints = new Array();

    //text elements
    let text = '';
    let textColor = 'rgb(0,0,255)';
    let textSize = '70px';
    let textFont = 'Calibri';
    let strokeText = false;
    let fillText = true;

    this.setTextColor = function(newColor){
        textColor = newColor;
        draw();
    }

    this.setText = function(newText){
        text = newText;
        draw();
    }

    this.setTextSize = function(newSize){
        textSize = newSize;
        draw();
    }

    this.setTextFont = function(newFont){
        textFont = newFont;
        draw();
    }

    this.setFillText = function(newFillText){
        fillText = newFillText;
    }

    this.setStrokeText = function(newStroke){
        strokeText = newStroke;
    }

    this.setBrushColor = function(newbrushColor){
        brushColor = newbrushColor;
    }

    this.setBrushSize = function(newbrushSize){
        brushSize = newbrushSize;
    }

    this.clear = function(){
        paintPoints = new Array();
        draw();
    }

    this.start = function(){
        this.brushColor = 'rgb(0,0,255)';
        this.brushSize = 10;
        //on mouse down
        this.canvas.addEventListener('mousedown',function(evt){
            let mousePosition = getMousePosition(canvas,evt);

            paint = true;
            
            addPoint(mousePosition,false,brushColor,brushSize);
            
            draw();
        })

        // on mouse move
        this.canvas.addEventListener('mousemove',function(evt){
            if(paint){

                addPoint(getMousePosition(canvas,evt),true,brushColor,brushSize);
                    
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
    function addPoint(point,dragging,brushColor,brushSize){
        let newPoint = new PaintPoint(point.x,point.y,dragging,brushColor,brushSize)
        paintPoints.push(newPoint);
    }


    function draw(){        
        
        // clear the canvas
        context.clearRect(0,0,this.canvas.width,this.canvas.height);

        context.drawImage(img, 0,0, img.width, img.height,
            centerShift_x,centerShift_y,img.width*ratio, img.height*ratio);

        //if text is setted
        if(text != ''){ 
            //draw text
            context.font = textSize + " "+ textFont;
            context.fillStyle = textColor;            
            context.fillText(text,Math.floor(canvas.width /2),Math.floor(canvas.height / 2));
        }            
        
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
            context.strokeStyle = paintPoints[i].brushColor;
            context.lineWidth = paintPoints[i].brushSize;
            context.stroke();
        }
    }
}

function PaintPoint(x,y,drag,brushColor,brushSize)
{
    this.x = x;
    this.y = y;
    this.drag = drag;
    this.brushColor = brushColor;
    this.brushSize = brushSize;
}

function getMousePosition(canvas,evt)
{
    const rect = canvas.getBoundingClientRect();
    return { x: evt.clientX - rect.left,y: evt.clientY - rect.top};
}