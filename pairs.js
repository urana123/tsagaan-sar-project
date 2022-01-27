const classNum = [1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12]

const animals = ['https://firebasestorage.googleapis.com/v0/b/reaction-game-90561.appspot.com/o/12jil%2Fbar.png?alt=media&token=418d6e2d-c6f0-4236-868b-9d0d5a2b3e4e', 'https://firebasestorage.googleapis.com/v0/b/reaction-game-90561.appspot.com/o/12jil%2Fgahai.png?alt=media&token=4e507a49-99a3-4fe0-b628-4170aba486d4', 'https://firebasestorage.googleapis.com/v0/b/reaction-game-90561.appspot.com/o/12jil%2Fhoni.png?alt=media&token=f08e72d0-22ec-4661-ba8d-a5795e11c1d4', 'https://firebasestorage.googleapis.com/v0/b/reaction-game-90561.appspot.com/o/12jil%2Fhulgana.png?alt=media&token=87bea295-b909-4d9c-b4b6-7d7cca3a656e', 'https://firebasestorage.googleapis.com/v0/b/reaction-game-90561.appspot.com/o/12jil%2Fluu.png?alt=media&token=02266fcc-65c4-47b6-9e6c-5e126dd323aa', 'https://firebasestorage.googleapis.com/v0/b/reaction-game-90561.appspot.com/o/12jil%2Fmogoi.png?alt=media&token=e1869c74-33d6-4591-9dcf-6f8e01aef685', 'https://firebasestorage.googleapis.com/v0/b/reaction-game-90561.appspot.com/o/12jil%2Fmori.png?alt=media&token=1a127d1a-8e32-4444-a5f8-4306156dd686', 'https://firebasestorage.googleapis.com/v0/b/reaction-game-90561.appspot.com/o/12jil%2Fnohoi.png?alt=media&token=661ffae4-dcbe-44b2-acad-dac26c420540', 'https://firebasestorage.googleapis.com/v0/b/reaction-game-90561.appspot.com/o/12jil%2Fsarmagchin.png?alt=media&token=4c700cc3-4817-4832-80cd-d912d148ee67', 'https://firebasestorage.googleapis.com/v0/b/reaction-game-90561.appspot.com/o/12jil%2Ftahia.png?alt=media&token=60c3cbe8-da9c-4911-b150-998959206b8b', 'https://firebasestorage.googleapis.com/v0/b/reaction-game-90561.appspot.com/o/12jil%2Ftuulai.png?alt=media&token=52052c63-69fd-4c67-912e-e2afb2b2de36', 'https://firebasestorage.googleapis.com/v0/b/reaction-game-90561.appspot.com/o/12jil%2Fuher.png?alt=media&token=569ebac5-76c5-480d-9138-af332b66df42']

const container = document.querySelector('.container')
const hide = document.querySelector('.hide')

let match = 0
let count = 0;
let hideCard = null
let cardCurr = null;
const closingCards = [];
const foundCards = []
let playing = true

const clickHandler = (e) => {

    if (playing === true) {
        startTimer()
    }
    playing = false
    count++;
    const card = e.target.parentElement;
    card.classList.toggle('flipped');
    if (count === 1) {
        cardCurr = card
        hideCard = document.createElement('div')
        cardCurr.classList.add('hide-card')
    }

    if (cardCurr.classList[1] === card.classList[1] && count === 2) {
        cardCurr.classList.remove('hide-card')
        hide.style.zIndex = 10
        hide.style.pointerEvents = 'none'
        cannotClickEl()
        match++
        document.querySelector('.point').innerHTML = match
        foundCards.push(card, cardCurr);
        for (i = 0; i < foundCards.length; i++) {
            foundCards[i].style.pointerEvents = 'none'
        }
        if (parseInt(match) === 12) {
            stopTimer()
            playing = false
        }
    }

    if (cardCurr.classList[1] !== card.classList[1] && count === 2) {
        cardCurr.classList.remove('hide-card')
        hide.style.zIndex = 10
        hide.style.readOnly = true
        cannotClickEl()
        closingCards.push(card, cardCurr);
        setTimeout(() => {
            while (closingCards.length > 0) {
                const $el = closingCards.pop();
                $el.classList.remove('flipped');
            }
        }, 750);
    }

    if (count === 2) {
        count = 0;
    }
}



for (let i = 0; i < 4; i++) {

    const row = document.createElement('div')
    row.classList.add('row')
    container.append(row)

    for (let i = 0; i < 6; i++) {

        const card = document.createElement('div')
        card.onclick = clickHandler;
        card.classList.add('card')

        const front = document.createElement('div')
        front.classList.add('front')

        const back = document.createElement('div')
        back.classList.add('back')

        row.append(card)
        card.append(front, back)
    }
}



let card = document.querySelectorAll('.card')
for (classNum, i = classNum.length; i--;) {

    let random = classNum.splice(Math.floor(Math.random() * (i + 1)), 1)[0];
    card[i].classList.add(random)
    card[i].childNodes[1].style.backgroundImage = "url(" + animals[random - 1] + ")";
}
console.log(card)


const sec = document.querySelector('.timer-sec')
const min = document.querySelector('.timer-min')
let a


startTimer = () => {
    minute = Number(min.innerHTML)
    second = Number(sec.innerHTML)
    a = setInterval(() => {
        if (second <= 9) {
            sec.innerHTML = '0' + second++
        }
        if (second > 9) {
            sec.innerHTML = second++
        }
        if (second > 59) {
            if (minute < 9) {
                min.innerHTML = '0' + ++minute;
            } else {
                min.innerHTML = ++minute;
            }
            second = 0;
        }
    }, 1000)
    minute = '00'
    second = '00'
}

stopTimer = () => {
    clearInterval(a)
    sec.innerHTML = '00'
    min.innerHTML = '00'
}

const cannotClickEl = () => {
    setTimeout(() => {
        hide.style.zIndex = -1
        hide.style.readOnly = false
    }, 1400)
}

document.querySelector('.back-button').onclick = () => {
    window.location.assign('./game-profile.html')
}