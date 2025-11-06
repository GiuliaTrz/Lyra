const configModal = new bootstrap.Modal(document.getElementById('configModal'));
const configModalbtnSave = document.getElementById("configModalbtnSave");

const txtbAppId = document.getElementById("txtbAppId");
const txtbApiSecret = document.getElementById("txtbApiSecret");

const appConfig = new LocalStorageDB("lyra-config");
/**
 * The first function called when the page is loaded
 */
function main(){
    registerEvents();
    // Shows the configuration modal if the app is not initialized
    if(!isInitialized()) configModal.show();
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
    saveApiSecret(txtbAppId.value, txtbApiSecret.value);
    configModal.hide();
}

/**
 * This function saves the app id and the secret
 * @param {*} appId the API application id
 * @param {*} secret the API secret
 */
function saveApiSecret(appId, secret){
    appConfig.save("api-app-id",appId);
    appConfig.save("api-secret",secret);
}

/**
 * Checks if the application has been initialized with the proper API authentication
 * data.
 * @returns true if the app is initialized
 */
function isInitialized(){
    return appConfig.get("api-app-id") != null && appConfig.get("api-secret") != null
}

main();