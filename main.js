$(document).ready(() => {
    
    const fadeTime = 300;

    //buttons
    const uploadBtn = $("#file");

    //image element
    let imageUploaded = true;

    let activeEditor = $(".filters-panel");
    let activeIconBar = $("#filtersBtn");

    //all sliders tools in basic edit
    const sliders = $('input[type=range]');

    //current preset filter
    let presetFilter = undefined;

    //INIT FUNCTION
    Caman('#canvas');
    resetAllSliders();
    resetTextInput();

    // Assign all panel animation to icon bar element
    $("#editBtn").click(function(){panelAnimation($(".basic-edits"),$(this))});
    $("#settingsBtn").click(function(){panelAnimation($(".settings"),$(this))});
    $("#filtersBtn").click(() => panelAnimation($(".filters-panel"),$(this)));
    // $("#editBtn").click(() => panelAnimation($(".basic-edits")));
    // $("#editBtn").click(() => panelAnimation($(".basic-edits")));
    // $("#editBtn").click(() => panelAnimation($(".basic-edits")));
    // $("#editBtn").click(() => panelAnimation($(".basic-edits")));

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

    //on click rotate button
    $(".rotateBtn").click(function(){
        let direction = $(this).attr('id').replace('rotate-','');

        if(direction == "left"){
            Caman("#canvas",function(){
                this.rotate(-90);
                this.render();
            });
        }
        else{
            Caman("#canvas",function(){
                this.rotate(90);
                this.render();
            });
        }
    });

    //on click on button reset of basic edits
    $('#resetEditBtn').click(() =>{
        resetAllSliders();
        applyAllFilters();
    });

    //on click on save button 
    $("#saveBtn").click(() =>{
        Caman('#canvas',function(){
            this.render(function(){
                this.save('image.png');
            });
        });
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

    //test
    $('#textBtn').click(function(){
        let canvas = document.getElementById('canvas');
        let context = canvas.getContext('2d');
        
       context.fillRect(canvas.width/2,canvas.height/2,200,200);
        
    })

    //On canvas click update photo
    //canvas.click(uploadPhoto();

    
    //******* FUNCTIONS **************

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
                $('#canvas').replaceWith('<img id="canvas" src="" alt="">');
            }

            //update image src, with the file readed
            $("#canvas").attr("src",reader.result);

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