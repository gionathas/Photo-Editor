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

    //FUNCTIONS

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

    //fit image on canvas
    var fitImageOn = function(canvas, imageObj) {

        context.clearRect(0, 0, canvas.width, canvas.height);

        let imageDimensionRatio = imageObj.width / imageObj.height;
        let canvasDimensionRatio = canvas.width / canvas.height;
        let renderableHeight, renderableWidth, xStart, yStart;


        // If image's aspect ratio is less than canvas's we fit on height
        // and place the image centrally along width
        if(imageDimensionRatio < canvasDimensionRatio) {
            renderableHeight = canvas.height;
            renderableWidth = imageObj.width * (renderableHeight / imageObj.height);
            xStart = (canvas.width - renderableWidth) / 2;
            yStart = 0;
        } 
        // If image's aspect ratio is greater than canvas's we fit on width
	    // and place the image centrally along height
        else if(imageDimensionRatio > canvasDimensionRatio) {
            renderableWidth = canvas.width
            renderableHeight = imageObj.height * (renderableWidth / imageObj.width);
            xStart = 0;
            yStart = (canvas.height - renderableHeight) / 2;
        } 
        // Happy path - keep aspect ratio
        else {
            renderableHeight = canvas.height;
            renderableWidth = canvas.width;
            xStart = 0;
            yStart = 0;
        }

        context.drawImage(imageObj, xStart, yStart, renderableWidth, renderableHeight);
    };

    //photo test
    //img.src = "/home/gio/Scrivania/js/simpleImageFilter/img/moto.jpg";

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

    function changeSliderHandler(event){
        Caman('#canvas',function(){
            this[event.target.name](event.target.value).render();
        });
    }


    //save button 
    $("#saveBtn").click(() =>{
        Caman('#canvas',function(){
            this.render(function(){
                this.save('image.png');
            });
        });
    });

    //brightness adjustment
    $("#brightness").change(function(){
        console.log($(this).val());
        let val = $(this).val();
        Caman('#canvas',function(){
            this.brightness(val).render();
        })
    });


    //On canvas click update photo
    //canvas.click(uploadPhoto();
});