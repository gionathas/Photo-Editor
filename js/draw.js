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

    //element for drawing 
    let paintPoints = new Array();
    let paintText = new PaintText('',Math.floor(canvas.width /2),Math.floor(canvas.height / 2),'Calibri','normal','70px','rgb(0,0,255)',context);


    this.setTextStyle = function(newStyle){
        paintText.style = newStyle;
        paintText.update();
        draw();
    }

    this.setTextColor = function(newColor){
        paintText.color = newColor;
        paintText.update();
        draw();
    }

    this.setText = function(newText){
        paintText.text = newText;
        paintText.update();        paintText.update();

        draw();
    }

    this.setTextSize = function(newSize){
        paintText.size = newSize;
        paintText.update();

        draw();
    }

    this.setTextFont = function(newFont){
        paintText.font = newFont;
        paintText.update();

        draw();
    }

    this.setBrushColor = function(newbrushColor){
        brushColor = newbrushColor;
    }

    this.setBrushSize = function(newbrushSize){
        brushSize = newbrushSize;
    }

    this.clear = function(){
        paintPoints = new Array();
        paintText.text = '';
        paintText.update();

        draw();
    }

    this.start = function(){
        this.brushColor = 'rgb(0,0,255)';
        this.brushSize = 10;


        //on mouse down
        this.canvas.addEventListener('mousedown',function(evt){
            let mousePosition = getMousePosition(canvas,evt);

            paint = true;

            paintText.contains(mousePosition);
            
            addPoint(mousePosition,false,brushColor,brushSize);
            
            draw();
        })

        // on mouse move
        this.canvas.addEventListener('mousemove',function(evt){
            if(paint){

                paintText.contains(getMousePosition(canvas,evt));
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
        if(paintText.text != ''){ 
            //draw text
            paintText.draw();
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

function PaintText(text,x,y,font,style,size,color,context)
{
    this.text = text;
    this.x = x;
    this.y = y;
    this.font = font;
    this.style = style;
    this.size = size;
    this.color = color;

    //setup
    context.font = this.style + " "+ this.size +" "+this.font;            
    context.fillStyle = this.color;
    
    let width = context.measureText(this.text).width;
    let height = context.measureText('M').height;

    this.draw = function(){
        context.font = this.style + " "+ this.size +" "+this.font;            
        context.fillStyle = this.color;            
        context.fillText(this.text,this.x,this.y);
    }

    //update width & height of text
    this.update = function(){
        width = context.measureText(this.text).width;
        height = context.measureText('M').width;
        console.log(width+" "+height);
        
    }

    this.contains = function(point){
        if(point.x >= this.x && point.x <= this.x + width 
        && point.y >= this.y && point.y <= this.y + height){
            console.log('hit');
            
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