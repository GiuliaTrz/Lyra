
const configModal = new bootstrap.Modal(document.getElementById('configModal'));
const configModalbtnSave = document.getElementById("configModalbtnSave");

const txtbAppId = document.getElementById("txtbAppId");
const txtbApiSecret = document.getElementById("txtbApiSecret");

const appConfig = new LocalStorageDB("lyra-config");

const ipAddressApi = "https://ip-api.com/json?fields=lat,lon,status";
const baseUrl = "https://api.astronomyapi.com/api/v2/studio/moon-phase";

const moonPhaseImage = document.getElementById("moonPhaseImage");

/**
 * The first function called when the page is loaded
 */
function main(){
    registerEvents();
    // Shows the configuration modal if the app is not initialized
    if(!isInitialized()) configModal.show();
    fetchPhase();
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
    if(txtbAppId.value == "" || txtbApiSecret.value == ""){
        alert("Invalid Data!");
        return;
    }

    saveApiSecret(txtbAppId.value, txtbApiSecret.value);
    configModal.hide();
    window.location.reload(); // Reloads the page
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

/**
 * This function returns the user geographic coordinates
 * 
 * @param {*} callback the function to invoke when the request is completed
 */
function findPositionFromIpAddress(callback) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var response = JSON.parse(this.responseText);
            if(response.status !== 'success') {
                console.log('query failed: ' + response.message);
                callback(null);
                return;
            }
            callback(response);
        }
    };
    xhr.open('GET', ipAddressApi, true);
    xhr.send();
}

function formatDate(){
    return new Date().toISOString().split('T')[0];
}

function fetchPhase(){
    var position;

    findPositionFromIpAddress(function(response) {
    if (response) {
        position = response;
        const appSecret = btoa(appConfig.get("api-app-id") + ":" + appConfig.get("api-secret"));
            var result;
        (async () => {
            const rawResponse = await fetch(baseUrl, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Basic ' + appSecret
                },
                body: JSON.stringify(
                                    {
                                      "format": "svg",
                                      "style": {
                                        "moonStyle": "default",
                                        "backgroundStyle": "solid",
                                        "backgroundColor": "#FAE3E3"
                                      },
                                      "observer": {
                                        "latitude": position.lat,
                                        "longitude": position.lon,
                                        "date": formatDate(),
                                      },
                                      "view": {
                                        "type": "portrait-simple",
                                        "orientation": "south-up"
                                      }
                                    })
            });
            const content = await rawResponse.json();

            console.log(content);
            moonPhaseImage.src = content.data.imageUrl
        })();
    } else {
        console.error('Unable to find position');
    }
    });

    
}

main();
