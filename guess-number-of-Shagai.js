let $user;
let $userId;
let theNumberOfSelectedShagai;
let hi = location.search.split("=");
let player1Id;
let player2Id;
let lengthNumber;
let $shots;
let iAmPlayer1 = false;
let $mainBody = document.querySelector(".main-body");
let $winningNumber = 5;
let isItDraw = false;

const $arrOfName = ["mori", "temee", "ymaa", "honi", "mori1"];
const $shagaiImgArr = [
    "./guess-mori.png",
    "./guess-temee.png",
    "./guess-ymaa.png",
    "./guess-honi.png",
    "./guess-mori.png",
];

inviteFriend();

firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        $user = user;
        $userId = user.uid;
        startGame();
    } else {
        // location.replace(`./login.html${location.search}`);
    }
});

function docRefId() {
    db.collection("game")
        .doc(`${hi[1]}`)
        .get()
        .then((shots) => {
            $shots = shots.data();

            if (shots.data().player1 === null) {
                $shots = {...$shots, player1: $userId };
                db.doc(`game/${hi[1]}`)
                    .set({ player1: `${$userId}` }, { merge: true })
                    .then(() => {
                        document.querySelector(".invite").style.zIndex = "10";
                    });
            } else if (shots.data().player2 === null) {
                if (shots.data().player1 !== $userId) {
                    $shots = { player2: $userId };
                    db.doc(`game/${hi[1]}`).set({ player2: `${$userId}` }, { merge: true });
                }
            } else {
                location.replace(`./profile.html`);
            }
            createNewRound();
        });
}

function createNewRound() {
    if ($shots.player1 !== $userId) return;

    db.collection(`game/${hi[1]}/subCollection`)
        .get()
        .then((alim) => {
            lengthNumber = 100 + parseInt(alim.size) + 1;
            let docRef = db
                .collection(`game/${hi[1]}/subCollection`)
                .doc(`${lengthNumber}`);
            docRef.set({});
        });
}

db.collection(`game/${hi[1]}/subCollection`).onSnapshot((haaha) => {
    if (haaha.size % 2 !== 0) {
        medque(haaha);
    } else {
        medne(haaha);
    }
});

function medque(par) {
    let mm = Object.keys(par.docs).length - 1;
    if (Object.keys(par.docs[mm].data()).length === 2) {
        $mainBody.prepend(guessNumberDraw());
        createNewRound();
    }
}

function medne(par) {
    let jjuse;
    let jjuse1;
    let mm = Object.keys(par.docs).length - 1;

    if (Object.keys(par.docs[mm].data()).length === 2) {
        for (const [key, value] of Object.entries(par.docs[par.size - 2].data())) {
            if (key === $userId) {
                jjuse = value;
            } else {
                jjuse1 = value;
            }
        }
        $mainBody.prepend(openHandDraw(jjuse1, jjuse));
        createNewRound();
        winningFun(par, jjuse1, jjuse);
    }
}

function winningFun(par, mine, someones) {
    let jj;
    let jj1;

    for (const [key, value] of Object.entries(par.docs[par.size - 1].data())) {
        if (key === $userId) {
            jj = value;
        } else {
            jj1 = value;
        }
    }
    if (jj1 === someones && jj === mine) {
        $mainBody.prepend(winningDraw("draw"));
        isItDraw = true;
        setTimeout(() => {
            $mainBody.prepend(chooseNumberDraw());
        }, 2000);
        return;
    }

    if (jj1 === someones) {
        numberOfWinning(jj1, "loose");
        $mainBody.prepend(winningDraw("loose"));
    }
    if (jj === mine) {
        numberOfWinning(jj, "win");
        $mainBody.prepend(winningDraw("win"));
    }
    setTimeout(() => {
        $mainBody.prepend(chooseNumberDraw());
    }, 2000);
}

function numberOfWinning(number, what) {
    let $realNumberMine = document.querySelector(".realNumberMine");
    let $realNumberEnemy = document.querySelector(".realNumberEnemy");

    if (what === "win") {
        $realNumberMine.innerHTML = parseInt($realNumberMine.innerHTML) + number;
        $realNumberEnemy.innerHTML = parseInt($realNumberEnemy.innerHTML) - number;
    }
    if (what === "loose") {
        $realNumberEnemy.innerHTML = parseInt($realNumberEnemy.innerHTML) + number;
        $realNumberMine.innerHTML = parseInt($realNumberMine.innerHTML) - number;
    }

    if (parseInt($realNumberMine.innerHTML) < 5) {
        $winningNumber = parseInt($realNumberMine.innerHTML);
        console.log("mine bagashchihla");
    } else {
        $winningNumber = 5;
    }

    if (parseInt($realNumberMine.innerHTML) === 20) {
        console.log('ji');
        let promise = db.collection(`game/${hi[1]}/subCollection`).delete();
        createNewRound();
        $mainBody.innerHTML = "";
        $mainBody.prepend(chooseNumberDraw());

        // assuuuydaa
    }
}

function startGame() {
    docRefId();
    $mainBody.prepend(chooseNumberDraw());
}

function winningDraw(name) {
    let winningBody;
    if (name === "win") {
        winningBody = `<p> You Win Yeyy &#127881;</p>`;
    }
    if (name === "loose") {
        winningBody = `<p> You Loose</p>`;
    }
    if (name === "draw") {
        winningBody = `<p> DRAW !</p>`;
    }

    const $mainDiv = document.createElement("div");
    $mainDiv.className = "winning row center";
    $mainDiv.style.margin = "5px 0";
    $mainDiv.style.padding = "0px 30px";

    $mainDiv.innerHTML = winningBody;

    return $mainDiv;
}

function openHandDraw(number1, number2) {
    const openHandBody = `
        <div class="flex j-start left-hand" style="height: 162px; position: relative;">
            <img height="100%" src="./guess-leftOpen.png" alt="">
        </div>
        <div class="flex j-end right-hand" style="height: 162px; position: relative;">
            <img height="100%" src="./guess-rightOpen.png" alt="">
        </div>
    `;
    const $mainDiv = document.createElement("div");
    $mainDiv.className = "open-hand column";
    $mainDiv.style.margin = "5px 0";

    $mainDiv.innerHTML = openHandBody;

    const $leftHand = $mainDiv.querySelector(".left-hand");
    helperDrawShagai($leftHand, number1);

    const $rightHand = $mainDiv.querySelector(".right-hand");
    helperDrawShagai($rightHand, number2);

    return $mainDiv;
}

function guessNumberDraw() {
    const guessNumberBody = `
        <div class="flex j-start">
            <img src="./guess-leftHand.png" alt="">
        </div>
        <div class="flex between" style="padding-left: 30px;">
            <div class="choose-shagai row">
                 <div class="check flex center check-not" id='checkingSecondOwn'>
                    <i class="fa fa-check" style="font-size:13px;"></i>
                </div>
                <img width="40px" class="shagai" id="mori" style="opacity: 0.4;" src="./guess-mori.png" alt="">
                <img width="40px" class="shagai" id="temee" style="opacity: 0.4;" src="./guess-temee.png" alt="">
                <img width="40px" class="shagai" id="ymaa" style="opacity: 0.4;" src="./guess-ymaa.png" alt="">
                <img width="40px" class="shagai" id="honi" style="opacity: 0.4;" src="./guess-honi.png" alt="">
                <img width="40px" class="shagai" id="mori1" style="opacity: 0.4;" src="./guess-mori.png" alt="">
               
            </div>
            <img src="./guess-rightHand.png" alt="">
        </div>
        <div class="flex j-end" style="padding: 0 30px;">
            <div class="loader-border">
                <div class="loader"></div>
                <div class="check flex center check-not" id="chackingSecondOpposite">
                    <i class="fa fa-check" style="font-size:13px;"></i>
                </div>
            </div>
        </div>
    `;
    const $mainDiv = document.createElement("div");
    $mainDiv.className = "guess number column";
    $mainDiv.style.margin = "5px 0";

    $mainDiv.innerHTML = guessNumberBody;
    const shagaiArr = $mainDiv.querySelectorAll(".shagai");
    for (let shagai of shagaiArr) {
        shagai.onclick = chooseNumber;
    }
    let matar = $mainDiv.querySelector("#checkingSecondOwn");
    matar.onclick = () => checkingDoneOrNot(matar);

    return $mainDiv;
}

function chooseNumberDraw() {
    const chooseNumberBody = `
    <div class="flex j-start">
        <div class="loader-border">
            <div class="loader"></div>
            <div class="check flex center check-not" id="checkingOpposite">
                <i class="fa fa-check" style="font-size:13px;"></i>
            </div>
        </div>
    </div>
    <div class="flex j-end">
        <div class="choose-shagai plus-some-shagai row">
            <div class="check flex center check-not" id="checkingOwn">
                <i class="fa fa-check" style="font-size:13px;"></i>
            </div>
        </div>
    </div>
    `;

    const $mainDiv = document.createElement("div");
    $mainDiv.className = "choose-number column";
    $mainDiv.style.padding = `0px 30px`;
    $mainDiv.style.margin = "20px 0";

    $mainDiv.innerHTML = chooseNumberBody;
    const $plusSomeShagai = $mainDiv.querySelector(".plus-some-shagai");

    for (let index = 0; index < $winningNumber; index++) {
        const $newImg = document.createElement("img");
        $newImg.style.width = "40px";
        $newImg.style.opacity = "0.4";
        $newImg.id = $arrOfName[index];
        $newImg.className = "shagai";
        $newImg.src = $shagaiImgArr[index];
        $plusSomeShagai.append($newImg);
    }

    const shagaiArr = $mainDiv.querySelectorAll(".shagai");

    for (let shagai of shagaiArr) {
        shagai.onclick = chooseNumber;
    }
    let matar = $mainDiv.querySelector("#checkingOwn");
    matar.onclick = () => checkingDoneOrNot(matar);

    return $mainDiv;
}

function checkingDoneOrNot(par) {
    if (par.className === "check flex center check-not") {
        par.className = "check flex center check-done";
    } else {
        return;
    }
    let SizeOfDoc;

    db.collection(`game/${hi[1]}/subCollection`)
        .get()
        .then((alim) => {
            SizeOfDoc = 100 + parseInt(alim.size);
            let docRef = db
                .collection(`game/${hi[1]}/subCollection`)
                .doc(`${SizeOfDoc}`);

            docRef
                .set({
                    [$userId]: theNumberOfSelectedShagai,
                }, { merge: true })
                .then((res) => {});
        });
}

function chooseNumber(e) {
    const lengthOfNumber = e.target.parentElement.children.length;
    for (let i = 1; i < lengthOfNumber; i++) {
        e.target.parentElement.children[i].style.opacity = "0.4";
    }

    if (e.target.id === "mori") {
        theNumberOfSelectedShagai = 1;
    } else if (e.target.id === "temee") {
        theNumberOfSelectedShagai = 2;
    } else if (e.target.id === "ymaa") {
        theNumberOfSelectedShagai = 3;
    } else if (e.target.id === "honi") {
        theNumberOfSelectedShagai = 4;
    } else if (e.target.id === "mori1") {
        theNumberOfSelectedShagai = 5;
    }

    for (let i = 0; i < theNumberOfSelectedShagai + 1; i++) {
        e.target.parentElement.children[i].style.opacity = "1";
    }
}

function helperDrawShagai(par, number) {
    const div = document.createElement("div");
    div.style.width = "70px";
    div.style.height = "60px";
    if (par.className === "flex j-start left-hand") {
        div.className = "number-of-shagai-left flex center";
    } else {
        div.className = "number-of-shagai-right flex center";
    }

    for (let i = 0; i < number; i++) {
        const img = document.createElement("img");
        img.src = $shagaiImgArr[i];
        img.style.width = "30px";
        div.append(img);
    }
    par.append(div);
}

function inviteFriend() {
    let $invitation = document.getElementById("invitation");
    $invitation.innerHTML = location.href;
}

function done(event) {
    document.querySelector(`.${event}`).style.zIndex = "-1";
}

function copyFunction() {
    let copyText = document.getElementById("invitation").innerText;
    navigator.clipboard.writeText(copyText);

    document.getElementById("copyIcon").style.display = "none";
    document.getElementById("checkIcon").style.display = "flex";
}

function tailbarFun(event) {
    document.querySelector(`.${event}`).style.zIndex = "10";
}

function backFun() {
    // location.replace('./login.html')
}