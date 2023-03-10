var db = firebase.database()
var auth = firebase.auth()
var strg = firebase.storage().ref()
var logoutBtn = document.getElementsByTagName('button')[1]
var addNewArrival = document.getElementsByClassName('btn-success')[0]
var addProduct = document.getElementsByClassName('btn-success')[1]
var arrImgSelector = document.querySelectorAll('[type="file"]')[0]
var pImgSelector = document.querySelectorAll('[type="file"]')[1]
var productsTable = document.getElementsByTagName('table')[0]
// Check for current user
if(localStorage.getItem('aUID') == null){
    window.location.replace('./login.html')
}else{
    console.log('Admin logged in.')
}
// Logout Button
logoutBtn.addEventListener('click', async function () {
    await auth.signOut();
    localStorage.removeItem('aUID')
    window.location.replace('./login.html')
})

// Add new arrival
addNewArrival.addEventListener('click', async function () {
    var newArrKey = db.ref('newarrivals/').push().getKey()
    var img_url;
    var uploadTask = strg.child(`images/new-arrivals/${newArrKey}/${arrImgSelector.files[0].name}`).put(arrImgSelector.files[0])
    uploadTask.on("state_changed", (snapshot) => {
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log(progress)
    }, (error) = {
        // Handle errors
    }, () => {
        uploadTask.snapshot.ref.getDownloadURL().then(async (downloadURL) => {
            img_url = await downloadURL;
            var obj = {
                itemname: document.getElementById('newname').value,
                itemcat: document.getElementById('newcat').value,
                itemqty: document.getElementById('newqty').value,
                itemprice: document.getElementById('newprice').value,
                itemid: newArrKey,
                imgurl: img_url
            }
            await db.ref(`newArrivals/${newArrKey}/`).set(obj)
            window.location.reload()
        })
    })
})

// Add product
addProduct.addEventListener('click', async function () {
    var newProductKey = db.ref('allProducts/').push().getKey()
    var img_url;
    var uploadTask = strg.child(`images/all-products/${newProductKey}/${pImgSelector.files[0].name}`).put(pImgSelector.files[0])
    uploadTask.on("state_changed", (snapshot) => {
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log(progress)
    }, (error) = {
        // Handle errors
    }, () => {
        uploadTask.snapshot.ref.getDownloadURL().then(async (downloadURL) => {
            img_url = await downloadURL;
            var obj = {
                itemname: document.getElementById('name').value,
                itemcat: document.getElementById('cat').value,
                itemqty: document.getElementById('qty').value,
                itemprice: document.getElementById('price').value,
                itemid: newProductKey,
                imgurl: img_url
            }
            await db.ref(`allProducts/${newProductKey}/`).set(obj)
            console.log(obj)
            window.location.reload()
        })
    })
})

let getAllProducts = ()=>{
    db.ref(`allProducts/`).once('value',async (snap)=>{
        if(snap.toJSON() != null){
            var data = Object.values(snap.toJSON())
            data.map((v,i)=>{
                productsTable.innerHTML +=`
                <tr >
                <td>${v.itemid}</td>
                <td>${v.itemname}</td>
                <td>${v.itemcat}</td>
                <td class="text-center">${v.itemqty}</td>
                <td class="text-end">${v.itemprice}</td>
                </tr>
                `
            })
        }
    })
}
getAllProducts();