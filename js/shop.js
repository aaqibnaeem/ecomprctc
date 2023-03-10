var db = firebase.database();
var auth = firebase.auth()

if(localStorage.getItem('uid')!=null){
    document.getElementsByClassName('fa-right-from-bracket')[0].classList.remove('d-none')
}else{
    document.getElementsByClassName('fa-user')[0].classList.remove('d-none')
}

function logout(){
    firebase.auth().signOut();
    localStorage.removeItem('uid')
    window.location.reload();
}

function getData(){
    db.ref(`allProducts/`).once('value',(snapshot)=>{
        var data = Object.values(snapshot.toJSON())
        document.getElementById('allProductsRow').innerHTML="";
        data.map((v,i)=>{
            document.getElementById('allProductsRow').innerHTML+=`
            <div class="col-12 col-sm-6 col-md-4 col-lg-3 my-1">
                <div class="card h-100">
                    <img src="${v.imgurl}" width="100px" class="card-img-top" alt="...">
                    <div class="card-body">
                        <h5 class="card-title">${v.itemname}</h5>
                        <p class="card-text">Price : ${v.itemprice}</p>
                        <button class="btn btn-sm btn-primary"  onclick="buyNow(this)">Buy Now</button>
                    </div>
                </div>
            </div>
            `;
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
                console.log('No Order.')
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
                orderKey: orderKey
            }
            await db.ref(`users/${localStorage.getItem('uid')}/myOrders/${orderKey}`).set(orderItem)
            await db.ref(`orders/${localStorage.getItem('uid')}/${orderKey}`).set(orderItem)
        } else {
            alert('Already Ordered')
        }
    } else {
        window.location.replace('./userlogin.html')
    }
}