// pauses execution for given amount of time
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// takes path to audio file; plays audio
function playSound(url) {
    soundURL = chrome.runtime.getURL(url)
    const audio = new Audio(soundURL);
    // console.log(soundURL)
    audio.play()
    return audio
}

function getUserInfo() {
    postElement = document.querySelector("div.s-post-summary.js-post-summary");
    userNameElement = postElement.querySelector("div.s-user-card--link.d-flex.gs4 :nth-child(1)"); 
    reputationElement = postElement.querySelector("span.todo-no-class-here");

    if (userNameElement && reputationElement) {
        firstUser = userNameElement.textContent;
        repPoints = reputationElement.textContent;
        return [firstUser, repPoints]
    }

    else {
        alert("Failed to locate elements");
    }
}

// 
function newUserAlert(userStatus) {
    console.log("sendResponse Sent: ", typeof userStatus)
    if (userStatus.newUser) {
        sound = playSound("/assets-b/alert.mp3")
        sound.onended = () => {
            console.log(sound)
            location.reload()
        }     
    }

    else {
        location.reload()
    }
}

function main() {
    const nameAndReputation = chrome.runtime.sendMessage({userInfo: getUserInfo()})
    nameAndReputation.then((response) => {
        newUserAlert(response)
    })
}

console.log("likes-alert.js executed");

main()