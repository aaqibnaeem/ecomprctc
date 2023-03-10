var auth = firebase.auth()
var db = firebase.database()
var signup = document.getElementsByTagName('button')
var email = document.getElementsByTagName('input')[0]
var pw = document.getElementsByTagName('input')[1]

signup[0].addEventListener('click', () => {
  event.preventDefault();
  // Signup user
  auth.createUserWithEmailAndPassword(email.value, password.value).then(async (res) => {
    console.log(res.user.uid)
    // Send data to db
    console.log(0)
    var loginDetails = {
      email: email.value,
      password: password.value,
      role: 'user',
      uid: res.user.uid
    }
    console.log(loginDetails)
    await db.ref('users/').child(res.user.uid).set(loginDetails);
    // Sign-in after signup
    auth.signInWithEmailAndPassword(email.value, password.value).then((res) => {
      console.log(res.user.uid)
      localStorage.setItem('uid', res.user.uid)
      localStorage.setItem('email', res.user.email)
      window.location.replace('./index.html')
    }).catch((err) => {
      alert(err.message)
      console.log(email.value)
    })
  }).catch((err) => {
    alert(err.message)
    console.log(email.value)
  })

})