$(document).ready(() => {
    
    const fadeTime = 300;

    //canvas element
    let canvas,context;

    //image element
    const image = $("#canvas");

    //buttons
    const uploadBtn = $("#file");

    //image element
    let imageUploaded = false;

    let activeEditor = $(".basic-edits");
    let activeIconBar = $("#editBtn");

    //all sliders tools in basic edit
    const sliders = $('input[type=range]');

    //INIT FUNCTION
    resetAllSliders();

    // Assign all panel animation to icon bar element
    $("#editBtn").click(function(){panelAnimation($(".basic-edits"),$(this))});
    $("#settingsBtn").click(function(){panelAnimation($(".settings"),$(this))});
    // $("#editBtn").click(() => panelAnimation($(".basic-edits")));
    // $("#editBtn").click(() => panelAnimation($(".basic-edits")));
    // $("#editBtn").click(() => panelAnimation($(".basic-edits")));
    // $("#editBtn").click(() => panelAnimation($(".basic-edits")));
    // $("#editBtn").click(() => panelAnimation($(".basic-edits")));

    //on click on Choose Photo Button
    uploadBtn.change(() => uploadPhoto());

    //apply edit filter when a slider value change
    sliders.on('change',applyEditFilters);

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
        applyEditFilters();
    });

    //on click on button reset of basic edits
    $('#resetEditBtn').click(() =>{
        resetAllSliders();
        applyEditFilters();
    });

    //on click on save button 
    $("#saveBtn").click(() =>{
        Caman('#canvas',function(){
            this.render(function(){
                this.save('image.png');
            });
        });
    });

    //On canvas click update photo
    //canvas.click(uploadPhoto();

    
    //******* FUNCTIONS **************

    //set all sliders to default value
    function resetAllSliders(){
        sliders.each(function(){
            $(this).val(0);
        });
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
            //update image src, with the file readed
            //img.src = reader.result;
            image.attr("src",reader.result);
        });
    }


    function applyEditFilters(){
        const brgt = parseInt($('#brightness').val());
        const ctrs = parseInt($('#contrast').val());
        const str = parseInt($('#saturation').val());
        const hue =  parseInt($('#hue').val());
        const noise = parseInt($('#noise').val());
        const blur = parseInt($('#blur').val());
        const expo = parseInt($('#exposure').val());

        Caman('#canvas',function(){
            this.revert(false);
            this.brightness(brgt);
            this.contrast(ctrs);
            this.saturation(str);
            this.hue(hue);
            this.noise(noise);
            this.stackBlur(blur);
            this.exposure(expo);
            this.render();
        })
    }
});