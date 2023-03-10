var auth = firebase.auth()
var loginBtn = document.getElementsByTagName('button')[0]
var email = document.getElementsByTagName('input')[0]
var pw = document.getElementsByTagName('input')[1]

loginBtn.addEventListener('click',function(){
    auth.signInWithEmailAndPassword(email.value,pw.value)
    .then((userCredential) => {
      localStorage.setItem('aUID',userCredential.user.uid)
      window.location.replace('./admin.html')
    })
    .catch((error) => {
      alert(error)
    });

})