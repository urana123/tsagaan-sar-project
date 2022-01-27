const $roll1 = document.querySelector(".img1");
const $roll2 = document.querySelector(".img2");
const $roll3 = document.querySelector(".img3");
const $roll4 = document.querySelector(".img4");

let margin;


let playerb1;
let playerb2;
let timer;
let isDone = false

let count = 0;
let arr = [$roll1, $roll2, $roll3, $roll4];

//road vvsgeh div
const $road = document.querySelector(".road");

for (let i = 0; i < 18; i++) {
    const $mori = document.createElement("div");
    $mori.classList.add("mori");
    $mori.id = "div" + i;
    $mori.style.backgroundImage = "url('./guess-mori.png')";
    $road.append($mori);
}
let activePlayer = 0;

//Roll
let $playerLeft = document.querySelector(".playerLeft");
let $playerRight = document.querySelector(".playerRight");
let current = 0;
let currentPlayer1 = 0;
let currentPlayer2 = 0;

function onClickStart() {
    if (isDone === true) return
    console.log('darsan');
    isDone = true;
    // console.log(" --- >", activePlayer);

    uraldaan();

    if (activePlayer === 1) {
        document.querySelector("#start").innerHTML = "Player 1";
        document.querySelector("#start").style.color = "green";
        activePlayer = 0;
    } else {
        document.querySelector("#start").innerHTML = "Player 2";
        document.querySelector("#start").style.color = "red";
        activePlayer = 1;
    }
}

function controller() {
    let randomNumber
    for (let i = 0; i < 4; i++) {
        let randomNumberShuu = Math.floor(Math.random() * 4) + 1;
        if (randomNumberShuu === 1) randomNumber = 'mori'
        if (randomNumberShuu === 2) randomNumber = 'temee'
        if (randomNumberShuu === 3) randomNumber = 'honi'
        if (randomNumberShuu === 4) randomNumber = 'ymaa'
        $img1 = "./guess-" + randomNumber + ".png";
        arr[i].setAttribute("src", $img1);
        if (randomNumberShuu == 1) {
            count++;
            firebase
        }
    }
}

function draw() {
    for (let i = 0; i < 4; i++) {

        let randomNumber = Math.floor(Math.random() * 4) + 1;
        if (randomNumber === 1) randomNumber = 'mori'
        if (randomNumber === 2) randomNumber = 'temee'
        if (randomNumber === 3) randomNumber = 'honi'
        if (randomNumber === 4) randomNumber = 'ymaa'

        $img1 = "./guess-" + randomNumber + ".png";
        arr[i].setAttribute("src", $img1);
    }
    timer = setTimeout(() => draw(), 100);
}

function uraldaan() {

    draw();

    setTimeout(() => {
        clearTimeout(timer);
        controller();
        if (count != 0) {
            if (activePlayer === 0) {
                currentPlayer1 += count;
                $playerRight.style.marginLeft = `${80 * currentPlayer1}px`;
            } else {
                currentPlayer2 += count;
                $playerLeft.style.marginLeft = `${80 * currentPlayer2}px`;
            }
            count = 0;
        }

        let style = $playerLeft.style;
        margin = parseInt(style.marginLeft);

        let styleRight = $playerRight.style;
        let marginLeft = parseInt(styleRight.marginLeft);

        setTimeout(() => {
            if (marginLeft > 1440) {
                alert("Player2 Won ");
                location.reload();
            }
            if (margin > 1440) {
                alert("Player1 Won ");
                location.reload();
            }
        }, 1000);
        isDone = false;
    }, 1000);
}

function winning() {}