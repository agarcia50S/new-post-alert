// ***** Redesign prototype-b/background.js, without setting an extension badge

function injectCounter(idOfTab) {
    chrome.scripting.executeScript({
        target : {tabId : idOfTab},
        files : ["likes-alert-B.js"]
    })
}

// swithes from current state to next state
function switchState(startState) {
    return startState === "ON" ? "OFF" : "ON"
}


function isNewTopUser(priorUser, currentUser) {
    if (priorUser != currentUser) {
        console.log("New User: ", currentUser)
        return true
    }
    return false
}

var state = "OFF"
const pageUrl = "https://stackoverflow.com/"

chrome.action.setBadgeText({
    text: state
})

// switch to "ON" state when extension is clicked
chrome.action.onClicked.addListener(function(tab) {

    if (tab.url === pageUrl) {

        var topUserName = ""
 
        chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
            console.log("Initial User: ", topUserName)

            var userName = message.userInfo[0]
            var isNew = isNewTopUser(topUserName, userName)
            topUserName = isNew === true ? userName: topUserName

            sendResponse({newUser: isNew})
        })

        state = switchState(state);
        chrome.action.setBadgeText({
            text: state
        })

        if (state === "ON" && tab.status === "complete") {
            intervalId = setInterval(() => {injectCounter(tab.id)}, 10000)
        }
        
        else if (state === "OFF") {
            clearInterval(intervalId)
        }
    }
    else {console.log("URL ERROR: Must be https://stackoverflow.com/", tab.url)}
})

console.log("Global Scope: ", state)
