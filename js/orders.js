var db = firebase.database()
var auth = firebase.auth()
var logoutBtn = document.getElementsByTagName('button')[1]
var mainTable = document.getElementById('outer-order')

// Check for current user
if (localStorage.getItem('aUID') == null) {
    window.location.replace('./login.html')
} else {
    console.log('Admin logged in.')
}
// Logout Button
logoutBtn.addEventListener('click', async function () {
    await auth.signOut();
    localStorage.removeItem('aUID')
    window.location.replace('./login.html')
})

let getAllOrders = () => {
    db.ref(`orders/`).once('value', async (snap) => {
        if (snap.toJSON() != null) {
            var data = Object.values(snap.toJSON())
            var key = Object.keys(snap.toJSON())
            for (var i in data) {
                var a = Object.values(data[i])
                for(var j in a){
                    mainTable.innerHTML+=`
                    <tr class='align-middle'>
                        <td>${a[j].userid}</td>
                        <td>${a[j].email}</td>
                        <td>${a[j].orderKey}</td>
                        <td>${a[j].itemid}</td>
                        <td>${a[j].itemname}</td>
                        <td class="text-center">${a[j].qty}</td>
                        <td class="text-end">${a[j].itemprice}</td>
                        <td class="text-end"><select name="order-status" id="order-status" class="form-control shadow-none" onchange="updOrder(this)">
                        <option value="${a[j].orderstatus}" selected>${a[j].orderstatus}</option>
                        <option value="pending">pending</option>
                        <option value="delivered">delivered</option>
                        <option value="rejected">rejected</option>
                        </select></td>
                    </tr>
                    `
                }
            }
        }else{
            mainTable.innerHTML+='<tr><td colspan=6 class="text-center">No orders</td></tr>'
        }

    })
}
getAllOrders()

function updOrder(e){
    var updOrderID = e.parentNode.parentNode.childNodes[5].innerText
    var updUserID = e.parentNode.parentNode.childNodes[1].innerText
    var newStatus = e.value
    
    db.ref(`orders/${updUserID}/${updOrderID}/`).update(
        {
            orderstatus: newStatus
        }
    )
    db.ref(`users/${updUserID}/myOrders/${updOrderID}/`).update(
        {
            orderstatus: newStatus
        }
    )
}