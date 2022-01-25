const $dropNav = document.querySelector('.drop-nav')
const $container = document.querySelector('.container')

console.log($container.offsetWidth);

let isClickDropNav = false



function dropNavFun(event, className) {

    event.target.style.display = 'none';
    document.querySelector(`.${className}`).style.display = 'flex';
    !isClickDropNav ? $dropNav.style.height = '100px' : $dropNav.style.height = '0px';
    isClickDropNav = !isClickDropNav;

}

firebase.auth().onAuthStateChanged((user) => {

    if (user) {
        $userId = user.uid;
        let docRef = db.collection(`family-tree`).doc(`${$userId}`);
        docRef.set({}, { merge: true });
    } else {
        // location.re




        place(`./login.html`);
    }

});