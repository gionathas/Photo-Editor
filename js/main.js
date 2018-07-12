$(document).ready(() => {
    
    const fadeTime = 300;

    //buttons
    const uploadBtn = $("#file");

    //image element, default value
    let imageUploaded = true;
    let imageSrc = 'img/moto.jpg';
    let filename = 'img/moto.jpg';

    let activeEditor = $(".basic-edits");
    let activeIconBar = $("#editBtn");

    //all sliders tools in basic edit
    const sliders = $('input[type=range]');

    //current preset filter
    let presetFilter = undefined;

    //crop object
    let cropper = undefined;

    let canvasMode = 'caman';

    //INIT FUNCTION
    Caman('#canvas'); //create canvas from image
    resetAllSliders();
    resetTextInput();

    // Assign all panel animation to icon bar element
    $("#editBtn").click(() => {toCamanCanvas();panelAnimation($(".basic-edits"),$(this))});
    $("#settingsBtn").click(() => {toCamanCanvas();panelAnimation($(".settings"),$(this))});
    $("#filtersBtn").click(() => {toCamanCanvas();panelAnimation($(".filters-panel"),$(this))});

    //on click on Choose Photo Button
    uploadBtn.change(() => uploadPhoto());

    //apply edit filter when a slider value change
    sliders.on('change',applyAllFilters);

    //on click on reset of edit tool element
    $(".element span").click(function(){
        let name = $(this).attr('id').replace('-rst','');
        
        //find the slider to change value
        for (let i = 0; i < sliders.length; i++) {
            const element = sliders[i];
            
            if(element.id === name){
                element.value = 0;
                break;
            }
        }

        //update edit filters
        applyAllFilters();
    });

    //slide down some panel area(crop,resize,ecc..)
    $(".slidepanel").click(function(){               
       //on slide down
       if($(this).css("border-bottom-color") != "rgb(46, 50, 56)"){
            $(this).css('border-bottom-color', '#2e3238');
       }
       else{
            $(this).css("border-bottom-color","rgb(160, 159, 159)");
       }

       //get id of area of the panel to slide
       let id_area = $(this).attr('id')+"-area";
       
        //slide effect
        $("#"+id_area).slideToggle();
    });

    //on click on resize button
    $("#resize-submit").click(function(){
        //get width and height value
        const width = parseInt($("#resize-width").val());
        const height = parseInt($("#resize-height").val());   
        
        if(isNaN(width) || isNaN(height) || width <= 0 || height <= 0){
            $("#resize-error").show();
        }
        else{            
            Caman("#canvas",function(){
                this.resize({
                    width: width,
                    height: height
                  });

                this.render();
                
                //hide possible error
                $("#resize-error").hide();
            });
        }
        
    });

    //on click on button reset of basic edits
    $('#resetEditBtn').click(() =>{
        resetAllSliders();
        applyAllFilters();
    });

    //on click on preset filter
    $('.filter-container').click(function(){
        presetFilter = $(this).attr('id').replace('-filter','');
        applyAllFilters();

        //show remove button
        $('#filters-header-btn').css("visibility","visible");
    });

    //on click on remove preset filter
    $('#filters-header-btn').click(function(){
        presetFilter = undefined;
        applyAllFilters();

        //hide remove button
        $('#filters-header-btn').css("visibility","hidden");
    });

    $('#paintBtn').click(function(){
        let canvas = document.getElementById('canvas');

        toNormalCanvas(canvas);

        let context = canvas.getContext('2d');

        canvas.addEventListener('mousemove',function(evt){
            console.log(getMousePosition(canvas,evt));
        })

        canvas.addEventListener('click',function(evt){
            let mouse = getMousePosition(canvas,evt);

            context.fillStyle = 'rgb(0,0,255)';
            context.fillRect(mouse.x,mouse.y,100,100);
        })
    })

    // *********MANUAL TOOLS ************ 

    //on click on tools icon bar button
    $("#toolsBtn").click(function(){

        //hide icon bar and editor
        $('.editor').hide('fast',function(){
            $('.icon-bar').hide('fast',function(){
                
                //display tools buttons
                $(".manual-tools-area").fadeIn();

                let canvas = document.getElementById('canvas');

                cropper = new Cropper(canvas,{
                    ready(){
                        //remove the initial crop
                        this.cropper.clear();
                    },
                    dragMode: 'none',
                });
            });
        });
    });

    //zoom effects
    $('#zoomIn').click(function(){
        cropper.zoom(0.1);
    });

    $('#zoomOut').click(function(){
        cropper.zoom(-0.1);
    });

    //rotate effects
    $('#rotate-left').click(function(){
        cropper.rotate(-90);
    });

    $('#rotate-right').click(function(){
        cropper.rotate(90);
    });

    //moving effects
    $('#arrow-left').click(function(){
        cropper.move(-5, 0);
    });

    $('#arrow-right').click(function(){
        cropper.move(5, 0);
    });

    $('#arrow-up').click(function(){
        cropper.move(0, -5);
    });

    $('#arrow-down').click(function(){
        cropper.move(0, 5);
    });

    //drag and crop effects
    let dragMode = 'none';

    //on click on move button
    $('#move').click(function(){
        changeButtonColor($(this));

        if(dragMode == 'none' || dragMode == 'crop'){
            if(dragMode == 'crop'){
                changeButtonColor($('#crop'));
            }

            dragMode = 'move'
        }else{
            dragMode = 'none';
        }

        cropper.setDragMode(dragMode);
    });

    //on click on crop
    $('#crop').click(function(){
        changeButtonColor($(this));

        if(dragMode == 'none' || dragMode == 'move'){
            if(dragMode == 'move'){
                changeButtonColor($('#move'));
            }
            dragMode = 'crop'
        }else{
            dragMode = 'none';
        }

        cropper.setDragMode(dragMode);
    });
    
    //on click on crop button
    $('#apply-manual').click(function(){
        cropper.getCroppedCanvas().toBlob((blob) => {

            let url = URL.createObjectURL(blob);

            $('#canvas').replaceWith('<img id="canvas" src="" alt="">');

            $('#canvas').attr('src',url);

            hideCropArea();
            cropper.destroy();
        });
    });

    //on click on cancel on crop area
    $('#exit-manual').click(function(){
        hideCropArea();
        cropper.destroy();
    });

    //on click on reset tool button
    $('#reset-manual').click(function(){
        cropper.reset();
    });

    //SETTINGS AREA

    //on click on save photo TODO

    //on click on reset photo
    $('#resetBtn').click(function(){
        $('#canvas').replaceWith('<img id="canvas" src="" alt="">');

        //update image src, with the file readed
        $("#canvas").attr("src",imageSrc);

        //create canvas from image uploaded
        Caman("#canvas");

    });

    //on click on save photo
    $('#saveBtn').click(function(){
        const fileExtension = filename.slice(-4);

        let newFileName;

        if(fileExtension === '.jpg' || fileExtension === '.png')
        {  
            newFileName = filename.substring(0,filename.length - 4)+ '-edited.jpg';
        }

        //console.log(newFileName);
        
        donwloadPhoto(newFileName);
    });

    //On canvas click update photo
    //canvas.click(uploadPhoto();

    
    //******* FUNCTIONS **************

    function toNormalCanvas(canvas)
    {
        if(canvasMode == 'caman')
        {
            console.log("normal");
            
            //update canvas mode
            canvasMode = 'normal';

            //get current image on canvas
            let imageURL = canvas.toDataURL();
            //modified some canvas parameter
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;  
            
            //get context
            let context = canvas.getContext('2d');

            //create an image with the content inside the canvas
            let img = new Image();
            img.src = imageURL;

            //center the image on canvas when is loaded
            img.onload = function(){
                let hRatio = canvas.width  / img.width    ;
                let vRatio =  canvas.height / img.height  ;
                let ratio  = Math.min ( hRatio, vRatio );
                let centerShift_x = ( canvas.width - img.width*ratio ) / 2;
                let centerShift_y = ( canvas.height - img.height*ratio ) / 2;  
                context.drawImage(img, 0,0, img.width, img.height,
                                    centerShift_x,centerShift_y,img.width*ratio, img.height*ratio);
            }
        }   
    }

    function toCamanCanvas()
    {            
        if(canvasMode == 'normal')
        {
            let canvas = $('#canvas')[0];
            console.log("caman");

             //update canvas mode
            canvasMode = 'caman';

            let imageURL = canvas.toDataURL();

            $("#myEl").off();

            $('#canvas').replaceWith('<img id="canvas" src="" alt="">');

            //update image src, with the file readed
            $("#canvas").attr("src",imageURL);

            //create canvas from image uploaded
            Caman("#canvas");
        }   
    }

    function donwloadPhoto(filename)
    {
        let canvas = $('#canvas')[0];

        //create a link for download
        const link = document.createElement('a');

        link.download = filename;
        link.href = canvas.toDataURL('image/jpeg');

        //make a click on link created
        let e = new MouseEvent('click');
        link.dispatchEvent(e);
    }

    function getMousePosition(canvas,evt)
    {
        const rect = canvas.getBoundingClientRect();
        return { x: evt.clientX - rect.left,y: evt.clientY - rect.top};
    }

    //change button color of move and crop tools button
    function changeButtonColor(toolsBtn)
    {
        if(toolsBtn.css('background-color') == 'rgb(1, 1, 153)'){
            toolsBtn.css('background-color','rgb(0,0,255)');
        }else{
            toolsBtn.css('background-color','rgb(1, 1, 153)');
        }
    }

    //hide the whole crop area
    function hideCropArea(){
        $('.manual-tools-area').hide(function(){
            $('.icon-bar').fadeIn();
        });

        $('.editor').fadeIn();
        activeEditor.fadeIn();

        //revert canvas to caman mode
        Caman('#canvas');
    }
    

    //set all sliders to default value
    function resetAllSliders(){
        sliders.each(function(){
            $(this).val(0);
        });
    }

    //set all text input to empty string
    function resetTextInput(){
        $("input[type=text]").each(function(){
            $(this).val("");
        })
    }

    //panel and icon bar animation
    function panelAnimation(newEditor,newIconBar){
        //hide old editor
        activeEditor.fadeOut(fadeTime,() => {
            //when animation finished...

            //show new editor
            newEditor.fadeIn();

            //update active icon bar
            activeIconBar.removeClass("active");
            newIconBar.addClass("active");

            //update the active editor and the active icon bar
            activeEditor = newEditor;
            activeIconBar = newIconBar;
        });
    }

    function uploadPhoto(){

        //get file
        const file = document.querySelector("#file").files[0];
    
        //init file reader
        const reader = new FileReader();
    
        if(file){
            //set filename
            filename = file.name;
    
            //read data as URL
            reader.readAsDataURL(file);
        }
    
        reader.addEventListener("load",() => {

            if(!imageUploaded){
                imageUploaded = true;
            }else{
                //if an image was already uploaded, remove the old canvas to replace with a new one
                $('#canvas').replaceWith('<img id="canvas" src="" alt="">');
            }

            //save source of image
            imageSrc = reader.result;

            //update image src, with the file readed
            $("#canvas").attr("src",imageSrc);

            //create canvas from image uploaded
            Caman("#canvas");
        });
    }


    const editFilters = [
        'brightness',
        'contrast',
        'saturation',
        'hue',
        'noise',
        'stackBlur',
        'exposure'
    ];

    function applyAllFilters(){
        Caman('#canvas',function(){
            let canvas = this;

            canvas.revert(false);

            //apply resetFilter
            if(presetFilter){
                canvas[presetFilter]();
            }

            //apply all edit filters
            editFilters.forEach(function(filter){
                let val = parseInt($('#'+filter).val());

                if(val == 0){
                    return;
                }

                canvas[filter](val); //apply filters
                
            });

            canvas.render();
        });
    }
});