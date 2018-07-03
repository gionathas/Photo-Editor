$(document).ready(() => {
    
    const fadeTime = 300;

    const canvas = $("canvas");
    //const ctx = canvas.getContext('2d');

    let imageUploaded = false;

    // $("#editBtn").click(($(this)) => {console.log("hello");    $(this).addClass("active")});

    let activeEditor = $(".settings");
    let activeIconBar = $("#settingsBtn");

    //panel and icon bar animation
    let panelAnimation = function(newEditor,newIconBar){
        
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

    // Assign all panel animation to icon bar element
    $("#editBtn").click(function(){panelAnimation($(".basic-edits"),$(this))});
    $("#settingsBtn").click(function(){panelAnimation($(".settings"),$(this))});
    // $("#editBtn").click(() => panelAnimation($(".basic-edits")));
    // $("#editBtn").click(() => panelAnimation($(".basic-edits")));
    // $("#editBtn").click(() => panelAnimation($(".basic-edits")));
    // $("#editBtn").click(() => panelAnimation($(".basic-edits")));
    // $("#editBtn").click(() => panelAnimation($(".basic-edits")));


    canvas.click(uploadPhoto);
});


function uploadPhoto(){

}
  
  
  
  

