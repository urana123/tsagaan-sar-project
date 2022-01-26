const $dropNav = document.querySelector('.drop-nav')
const $container = document.querySelector('.container')

let isClickDropNav = false




firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        $userId = user.uid;
        let docRef = db.collection(`family-tree`).doc(`${$userId}`);
        docRef.set({}, { merge: true });
        start()
    } else {
        // location.replace(`./login.html`);
    }
});

function start() {
    db.collection(`family-tree/${$userId}/sub`).get().then((snapshot) => {
        if (snapshot.size === 0) {

        }
    });
}

function createNewInfo(name) {
    const innerInfo = `
        <h3 class="name-h3">${name}</h3>
            <h3> &nbsp;: </h3>
            ${(name === "Нөхөр" || name === "Эхнэр") ? '<input class="margin-left name-father-imp"  placeholder="Father name" type="text" name="" id="">': ''}
            <input class="margin-left name-imp"  placeholder="Name" type="text" name="" id="">
            <div class="img margin-left">Img</div>
            <i class="fa fa-check margin-left" style="font-size:24px; display: none;"></i>
            <input type="file" name="" id="" class="inputFile" hidden>
            <select class="margin-left selection" name="" id="">
                <option value="male">male</option>
                <option value="female">female</option>
            </select>
            <div class="plus flex center margin-left">
                <i class="fa fa-plus" style="font-size:16px"></i>
        </div>
    `;
    let $containerDiv = document.createElement("div");
    $containerDiv.className = "row";
    $containerDiv.style.padding = "5px 0px";
    $containerDiv.innerHTML = innerInfo;

    $containerDiv.querySelector(".img").onclick = onclickImg;
    $containerDiv.querySelector(".plus").onclick = onclickPlus;

    $about.appendChild($containerDiv);
}













function dropNavFun(event, className) {

    event.target.style.display = 'none';
    document.querySelector(`.${className}`).style.display = 'flex';
    !isClickDropNav ? $dropNav.style.height = '100px' : $dropNav.style.height = '0px';
    isClickDropNav = !isClickDropNav;

}
