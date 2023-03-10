var db = firebase.database();
var newArrRow = document.getElementById('new-swiper-wrapper')

if (localStorage.getItem('uid') != null) {
    document.getElementsByClassName('fa-right-from-bracket')[0].classList.remove('d-none')
} else {
    document.getElementsByClassName('fa-user')[0].classList.remove('d-none')
}

function logout() {
    firebase.auth().signOut();
    localStorage.removeItem('uid')
    window.location.reload();
}

function getData() {
    db.ref(`newArrivals`).once('value', async (snapshot) => {
        var data = Object.values(snapshot.toJSON());
        // console.log(data)
        newArrRow.innerHTML = ''
        data.map((v, i) => {
            newArrRow.innerHTML += `
            <div class="swiper-slide h-100">
                <div id="${v.itemid}" class="card rounded-0 mb-5">
                    <img src="${v.imgurl}" alt="...">
                    <div class="card-body text-start">
                        <h5 class="card-title fs-6">${v.itemname}</h5>
                        <p class="card-text fs-6">${v.itemprice}</p>
                        <button class="btn btn-sm btn-primary" onclick="buyNow(this);">Buy now</button>
                    </div>
                </div>
            </div>
            `
        })
    })
}
getData();

async function buyNow(e) {
    if (localStorage.getItem('uid') != null) {
        // Check if the current item is already ordered
        var canOrder = true;
        await db.ref(`users/${localStorage.getItem('uid')}/myOrders/`).once('value', (snap) => {
            if (snap.toJSON() != null || snap.toJSON() != undefined) {
                var data = Object.values(snap.toJSON())
                for (var i in data) {
                    if (data[i].itemid == e.parentNode.parentNode.id) {
                        canOrder = false;
                        break
                    } else {
                        canOrder = true;
                    }
                }
            } else {
                // console.log('No Order.')
            }
        })
        // Order if the current item is not ordered
        if (canOrder == true) {
            var orderKey = await db.ref(`users/${localStorage.getItem('uid')}/myOrders`).push().getKey()
            var orderItem = {
                itemid: e.parentNode.parentNode.id,
                itemimg: e.parentNode.parentNode.childNodes[1].src,
                itemname: e.parentNode.childNodes[1].innerText,
                itemprice: e.parentNode.childNodes[3].innerText,
                qty: 1,
                orderstatus: 'new',
                orderKey: orderKey,
                email : firebase.auth().currentUser.email,
                userid : firebase.auth().currentUser.uid
            }
            await db.ref(`users/${localStorage.getItem('uid')}/myOrders/${orderKey}`).set(orderItem)
            await db.ref(`orders/${localStorage.getItem('uid')}/${orderKey}`).set(orderItem)
            // console.log(orderItem)
        } else {
            alert('Already Ordered')
        }
    } else {
        window.location.replace('./userlogin.html')
    }
}