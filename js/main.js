const configModal = new bootstrap.Modal(document.getElementById('configModal'));
const configModalbtnSave = document.getElementById("configModalbtnSave");

const txtbAppId = document.getElementById("txtbAppId");
const txtbApiSecret = document.getElementById("txtbApiSecret");

/**
 * The first function called when the page is loaded
 */
function main(){
    registerEvents();
    configModal.show();
}


/**
 * Register events handlers
 */
function registerEvents(){
    configModalbtnSave.onclick = onConfigModalBtnSaveClicked;
}

/**
 * This function is invoked when the saved settings button 
 * is clicked (configModal)
 */
function onConfigModalBtnSaveClicked(){
    alert("SAVED!");
    configModal.hide();
}

main();