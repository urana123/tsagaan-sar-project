const shagai = ['https://firebasestorage.googleapis.com/v0/b/reaction-game-90561.appspot.com/o/shagai%2Fyamaa.png?alt=media&token=84a3a5d8-2433-4b24-ad7a-0adea05cfbb7', 'https://firebasestorage.googleapis.com/v0/b/reaction-game-90561.appspot.com/o/shagai%2Fmori.png?alt=media&token=63ce84cf-e50b-4212-8bf1-1b0a840a61e1', 'https://firebasestorage.googleapis.com/v0/b/reaction-game-90561.appspot.com/o/shagai%2Ftemee.png?alt=media&token=13f436b9-8141-41f7-8d37-9a561bd48b2f', 'https://firebasestorage.googleapis.com/v0/b/reaction-game-90561.appspot.com/o/shagai%2Fyamaa.png?alt=media&token=84a3a5d8-2433-4b24-ad7a-0adea05cfbb7'];
const me = document.querySelector('.player1_point')
const opponent = document.querySelector('.player2_point')

let reaction
let yesBtn
let bool = false
let first = true
const askingReady = () => {
    const container = document.querySelector('.container')
    const info = document.querySelector('.info')
    reaction = document.createElement('div')
    reaction.innerText = 'READY?'
    reaction.classList.add('ready')
    yesBtn = document.createElement('button')
    yesBtn.innerText = 'YES'
    yesBtn.classList.add('yes')
    info.append(reaction, yesBtn)
    if (first === true) {
        createInviteBtn()
    }
}
const createInviteBtn = () => {
    const container = document.querySelector('.container')
    inviteBtn = document.createElement('button')
    inviteBtn.innerText = 'Invite friend'
    inviteBtn.classList.add('invite-button')
    container.append(inviteBtn)
}
askingReady()

// creating DOC with URL
docID = location.search.slice(2)
console.log(docID)
let userID
firebase.auth().onAuthStateChanged((user) => { 
    if (user) {
        userID = user.uid
        console.log(docID)
        console.log(user)
    } else {
        location.replace(`./login.html?=${docID}`);
    }
});

//createing room
db.collection('shagai').doc(docID).get().then((doc) => {
    if (doc.data().player1 === null) {
        db.collection('shagai').doc(docID).set({
            player1: userID
        }, { merge: true })
    } else if (doc.data().player2 === null) {
        if (doc.data().player1 === userID) {
            return
        }
        db.collection('shagai').doc(docID).set({
            player2: userID
        }, { merge: true }).then(() => addData())
    } else {
        location.replace('./index.html')
    }
});


// add data to db
const addData = () => {
    db.collection("shagai").doc(docID).update({
        p1: null,
        p2: null,
        winner: null,
    })
}


const start = () => {
    db.collection('shagai').doc(docID).get().then((doc) => {
        if(doc.data().player2 === null){
            alert('invite your friend!')
            window.location.assign('./game-profile.html')
        }
    })
    yesBtn.disabled = true
    resetingWinnerId()
    document.querySelector('#medeh').innerText = ''
    db.collection("shagai").doc(docID).get().then((doc) => {
        if (doc.data().p1 === null && doc.data().p2 === null) {
            db.collection("shagai").doc(docID).update({
                p1: doc.data().player1
            })
        } else if (doc.data().p2 === null && doc.data().p1 !== null)
            db.collection("shagai").doc(docID).update({
                p2: doc.data().player2
            })
    })
    if (first === true) {
        document.querySelector('.invite-button').remove()
        askingReadyToPlay()
    }
    if (first === false) {
        playingContinue()
    }
}

const playingContinue = () => {
    document.querySelector('.reaction-section').classList.remove('last-reaction')
    askingReady()
    yesBtn.classList.add('hide')
}






//checking 2 player
const askingReadyToPlay = () => {
    db.collection('shagai').doc(docID).onSnapshot((doc) => {
        if (doc.data().p1 === doc.data().player1 && doc.data().p2 === null) {
            reaction.innerText = 'waiting another player'
        }
        if (doc.data().p2 === doc.data().player2 && doc.data().p1 === null) {
            reaction.innerText = 'waiting another player'
        }
        if (doc.data().p1 !== null && doc.data().p2 !== null) {
            reaction.innerText = 'start in 3 seconds'
            setTimeout(() => {
                reaction.classList.add('hide')
                yesBtn.classList.add('hide')
                if (bool === false) {
                    startGame()
                    bool = true
                    first = false
                }

            }, 3000);
        }
    })
}
yesBtn = document.querySelector('.yes')
yesBtn.onclick = start



//rendering
const container = document.querySelector('.container')
for (let i = 0, j = 0, k = 100; i < shagai.length; i++) {
    j++;
    k++;
    const section = document.createElement('div')
    section.classList.add('section');
    const clickbtn = document.createElement('button')
    clickbtn.classList.add('click-btn')
    clickbtn.disabled = true
    clickbtn.innerText = "click me"
    section.id = k
    container.append(section)
    section.append(clickbtn)
    for (let i = 0; i < 4; i++, j++) {
        const child = document.createElement('div')
        child.id = j;
        child.classList.add('child')
        section.append(child)
        child.style.backgroundImage = `url(${shagai[i]})`
    }
    j--;
}


let section
let clickbtn
let chosenBtn

const startGame = () => {
    container.innerHTML = ''
    for (let i = 0, j = 0, k = 100; i < shagai.length; i++) {
        j++;
        k++;
        section = document.createElement('div')
        section.classList.add('section');
        clickbtn = document.createElement('button')
        clickbtn.classList.add('click-btn')
        clickbtn.disabled = true
        clickbtn.innerText = "click me"
        section.id = k
        container.append(section)
        section.append(clickbtn)
        for (let i = 0; i < 4; i++, j++) {
            const child = document.createElement('div')
            child.id = j;
            child.classList.add('child')
            section.append(child)
            child.style.backgroundImage = `url(${shagai[i]})`
        }
        j--;
    }

    for (let i = 1; i < 17; i++) {
        child = document.getElementById(`${i}`)
        child.style.backgroundImage = `url(${shagai[Math.floor(Math.random() * 4)]})`
    }


    let p = Math.floor(Math.random() * 4) + 101;
    const parent = document.getElementById(p)
    chosenBtn = parent.querySelector('button')
    chosenBtn.classList.add(parent.id)
    console.log(chosenBtn.classList[1])


    parent.childNodes[1].style.backgroundImage = "url('https://firebasestorage.googleapis.com/v0/b/reaction-game-90561.appspot.com/o/shagai%2Fyamaa.png?alt=media&token=84a3a5d8-2433-4b24-ad7a-0adea05cfbb7')"
    parent.childNodes[2].style.backgroundImage = "url('https://firebasestorage.googleapis.com/v0/b/reaction-game-90561.appspot.com/o/shagai%2Fmori.png?alt=media&token=63ce84cf-e50b-4212-8bf1-1b0a840a61e1')"
    parent.childNodes[3].style.backgroundImage = "url('https://firebasestorage.googleapis.com/v0/b/reaction-game-90561.appspot.com/o/shagai%2Ftemee.png?alt=media&token=13f436b9-8141-41f7-8d37-9a561bd48b2f')"
    parent.childNodes[4].style.backgroundImage = "url('https://firebasestorage.googleapis.com/v0/b/reaction-game-90561.appspot.com/o/shagai%2Fhoni.png?alt=media&token=37a79b5c-00eb-4717-9616-22f406dd7c6f')"

    if (parent.id === chosenBtn.classList[1]) {
        chosenBtn.style.opacity = '0.3'
        chosenBtn.disabled = false
        chosenBtn.onclick = () => {
            stopTimer()
            givingWinnerId()
            renderPlayerPoints()
        }
    }
    startTimer()
    playBtn.disabled = true
    const reactionSection = document.querySelector('.reaction-section')
    reactionSection.classList.remove('last-reaction')
}
const playBtn = document.querySelector('.play-btn')
playBtn.onclick = start
const renderPlayerPoints = () => {
    db.collection('shagai').doc(docID).onSnapshot((doc) => {
        let winnerId = doc.data().winner
        console.log(doc.data())
        if (winnerId === userID) {
            document.querySelector('#medeh').innerHTML = 'winner'
        }
        if(winnerId !== userID){
            document.querySelector('#medeh').innerHTML = 'loser'
        }
    })
}

const resetingWinnerId = () => {
    db.collection("shagai").doc(docID).get().then((doc) => {
        if (doc.data().winner !== null) {
            db.collection("shagai").doc(docID).update({
                winner: null,
            })
        }
    })
}

const givingWinnerId = () => {
    db.collection("shagai").doc(docID).get().then((doc) => {
        if (doc.data().winner === null) {
            db.collection("shagai").doc(docID).update({
                winner: userID,
                p1: null,
                p2: null,
            })
        }
    })
}

document.querySelector('.invite-button').onclick = () => {
    const url = window.location.href
    alert('naiz ruugaa yavuulah url', url)
}

document.querySelector('.back-button').onclick = () => {
    window.location.assign('./game-profile.html')
}

const seconds = document.querySelector('#seconds')
const tens = document.querySelector('#tens')
const reactionTimerSec = document.querySelector('.reaction-timer-sec')
const reactionTimerTens = document.querySelector('.reaction-timer-tens')


let a
startTimer = () => {
    console.log("start timer");

    milsecond = tens.innerHTML
    sec = seconds.innerHTML
    a = setInterval(() => {
        if (milsecond <= 9) {
            tens.innerHTML = '0' + milsecond++
        }
        if (milsecond > 9) {
            tens.innerHTML = milsecond++
        }
        if (milsecond > 99) {
            if (sec < 9) {
                seconds.innerHTML = '0' + ++sec;
            } else {
                seconds.innerHTML = ++sec;
            }
            milsecond = 0;
        }
    }, 10)
    reactionTimerSec.innerHTML = '00'
    reactionTimerTens.innerHTML = '00'
    console.log(document.querySelector('#medeh'))
    document.querySelector('#medeh').innerHTML = ''
}
stopTimer = () => {
    bool = false
    console.log("Stop timer");
    clearInterval(a)
    a = 0;
    reactionTimerSec.innerHTML = seconds.innerHTML
    reactionTimerTens.innerHTML = tens.innerHTML
    seconds.innerHTML = '00'
    tens.innerHTML = '00'
    playBtn.disabled = false
    chosenBtn.disabled = true
    const reactionSection = document.querySelector('.reaction-section')
    reactionSection.classList.add('last-reaction')
}