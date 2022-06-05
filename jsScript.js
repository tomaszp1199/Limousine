window.onscroll = stick
window.onwheel = updateURL
window.addEventListener('popstate', setCurrentLink)

const nameInput = document.querySelector("#name")
const email = document.querySelector("#email")
const message = document.querySelector("#message")
const success = document.querySelector("#success")
const errorNodes = document.querySelectorAll(".error")

function stick() {
  const stickable = document.getElementsByClassName("stickable")

  for (let i = 0; i < stickable.length; i++) {
    if (window.pageYOffset > stickable[i].offsetTop)
      stickable[i].classList.add("sticky")
    else
      stickable[i].classList.remove("sticky")
  }
}

function updateURL() {
  const hooks = document.getElementsByClassName('hook')
  var page = document.URL.split('#', 2)[1]

  for (let i = 0; i < hooks.length; i++)
    if (hooks[i].offsetTop - window.innerHeight / 3 <= window.pageYOffset)
      page = hooks[i].getAttribute('name')

  location.href = document.URL.split('#', 2)[0] + '#' + page
}

function setCurrentLink() {
  const links = document.getElementsByClassName('link')

  for (let i = 0; i < links.length; i++) {
    if (links[i].getAttribute('href') === '#' + document.URL.split('#', 2)[1]) 
      links[i].classList.add('current-link')
    else
      links[i].classList.remove('current-link')
  }
}

/*
function initMap() {
  const popupContent = new google.maps.InfoWindow()
  const popupText = '<div class="popupText"><div id="title">Hodowla bydła</div><div id="subTitle">rasy <span>Limousine</span></div><div>Błotnica</div><div>Słoneczna 19</div></div>'
  const location = { lat: 52.99110908047872, lng: 17.29757809479382 }
  
  var map = new google.maps.Map(document.getElementsByClassName("map")[0], {
    zoom: 13,
    center: location
  })
  
  const marker = new google.maps.Marker({
    position: location,
    map: map,
    icon: "./image/icons/pin.png"
  })
  
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      l => { 
      var locationUser = { lat: l.coords.latitude, lng: l.coords.longitude } 
      const markerUser = new google.maps.Marker({
        position: locationUser,
        map: map,
      })
      console.log(locationUser);
      markerUser.setMap(map)
  })
  }

  google.maps.event.addListener(marker, 'click', (marker => () => {
    popupContent.setContent(popupText)
    popupContent.open(map, marker)
  }
  )(marker)
  )
  marker.setMap(map)
}
*/

function validateForm(){
  var errorFlag = false  
  clearMessages()

  if(nameInput.value.length < 1){
    errorNodes[0].innerText = "Podaj proszę swoje imię"
    nameInput.classList.add("error-border")
    errorFlag = true
  }
  
  if(!emailIsValid(email.value)){
    errorNodes[1].innerText = "Podaj proszę poprawny adress email"
    email.classList.add("error-border")
    errorFlag = true
  }
  
  if(message.value.length < 1){
    errorNodes[2].innerText = "Podaj proszę treść wiadomości"
    message.classList.add("error-border")
    errorFlag = true
  }

  if(!errorFlag)
    sendEmail()  
}

function clearMessages(){
  for(let i = 0; i < errorNodes.length; i++){
    errorNodes[i].innerText = ""
  }
  success.innerText = ""
  nameInput.classList.remove("error-border")
  email.classList.remove("error-border")
  message.classList.remove("error-border")
}

function emailIsValid(email){
  var pattern = /\S+@\S+\.\S+/
  return pattern.test(email)
}

function sendEmail(){
  Email.send({
    SecureToken : "53c2fd07-5b6f-454a-8d05-fcd7c21b679d",
    To: "tomaszp1199@gmail.com",
    From: email.value,
    Subject: `Limousine`,
    Body: `Imie: <b>${nameInput.value}</b> <br/> Email: <b>${email.value}</b> <br/><br/> ${message.value}`,
  }).then(console.log("weszło"))
  
}