$(document).ready(() => {
    
    let imageUploaded = false;

    const canvas = $("canvas");
    //const ctx = canvas.getContext('2d');

    let activeEditor = $(".settings");

    $("#editBtn").click(() =>{
        activeEditor.fadeOut(400,() =>{
            $(".basic-edits").fadeIn();
            //set active on icon bar
            //update active editor
        });
        
    })

    canvas.click(uploadPhoto);
});


function uploadPhoto(){

}
  
  
  
  

