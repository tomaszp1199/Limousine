window.onscroll = stick
window.onwheel = updateURL
window.addEventListener('popstate', setCurrentLink)
document.addEventListener("DOMContentLoaded", setupGallery)

const nameInput = document.querySelector("#name"),
      email = document.querySelector("#email"),
      message = document.querySelector("#message"),
      success = document.querySelector("#success"),
      errorNodes = document.querySelectorAll(".error")

      
gsap.from(".headline h1", {duration: 1.5, x: 20, y: -10, delay:.5})
gsap.from(".headline h1", {duration: 3, opacity:0, delay:.8})
gsap.from(".headline h2", {duration: 1.5, x: 20, y: 10, delay:1})
gsap.from(".headline h2", {duration: 3, opacity:0, delay:1.3})

function setAnim(playing, id){
  var anim = document.getElementById( id ) 

  playing ? anim.classList.add("playing") : anim.classList.remove("playing")
}

function rndInt (min, max){
  return  Math.floor(Math.random()*(max-min+1)) + min
}

function rndIntP (min, max){
  var nr = Math.floor(Math.random()*(max-min+1)) + min
  
  if (nr == max || nr == min)
    nr = Math.floor(Math.random()*(max-min+1)) + min

  return nr
}

Array.prototype.Sub = function (arr) {
  var sub = this.map( (e, i) => {
    return e - arr[i]
  })

  return sub
}

Array.prototype.Sum = function (arr) {
  var sum = this.map( (e, i) => {
    return e + arr[i]
  })
  return sum
}

Number.prototype.between = function(a, b, inclusive) {
  var min = Math.min(a, b),
      max = Math.max(a, b);

  return inclusive ? this >= min && this <= max : this > min && this < max;
}

function setupGallery( ){

  function createGridTiles () {
   for (let i = 0; i < bullsGalleryPhotos; i++) {
      var tile = document.createElement("div"),
          width = rndIntP(1, 4)       
  
      gsap.set( tile, {attr:{
        id: `tile${i}`,
        class: `tile w${width} h${rndIntP(width, 6)}`
      }})
      galleryGrid.appendChild( tile )
    }
  }

function convertPathToString( p ){
  return `M ${ p[0]  }, ${ p[1]  } 
          C ${ p[2]  }, ${ p[3]  }
            ${ p[4]  }, ${ p[5]  } 
            ${ p[6]  }, ${ p[7]  }
          S ${ p[8]  }, ${ p[9]  } 
            ${ p[10] }, ${ p[11] }

          S ${ p[12] }, ${ p[13] }
            ${ p[14] }, ${ p[15] }
          S ${ p[16] }, ${ p[17] }
            ${ p[18] }, ${ p[19] }

          S ${ p[20] }, ${  p[21] }
            ${ p[22] }, ${  p[23] }
          S ${ p[24] }, ${  p[25] }
            ${ p[26] }, ${  p[27] }
          
          S ${ p[28] }, ${ p[29] }
            ${ p[0] }, ${ p[1] }
            Z`
}

  function getSvgPath( paths ){
    return paths[0][0] === undefined ?
            convertPathToString( paths ) : 
            paths.map(p => (
              convertPathToString( p )
            ))
  }
  
  function getLoopedPath( paths ){
    var output = ``

    paths.forEach(p => {
      output += `${p};`
    })
    for (let i = paths.length-2; i > 0; i--) {
      output += `${paths[i]};`      
    }
    output += `${paths[0]}`

    return output
  }

  function createPath( tile, name ){
    var W = tile.offsetWidth + photoOverlap,
        H = tile.offsetHeight + photoOverlap,
        X = tile.offsetLeft - galleryGrid.offsetLeft,
        Y = tile.offsetTop - galleryGrid.offsetTop,
        min = Math.max(W/galleryGrid.offsetWidth*30, 15),
        max = W/galleryGrid.offsetWidth*50,
        paths = [],
        points = Array.from([
          X,          Y,
          X,          Y,
          X + W/4,    Y,
          X + W/3,    Y,
          X + W,      Y,
          X + W,      Y,
          X + W,      Y + H/4,
          X + W,      Y + H/2,
          X + W,      Y + H,
          X + W,      Y + H,
          X + W/2,    Y + H,
          X + W/3,    Y + H,
          X,          Y + H,
          X,          Y + H,
          X,          Y + H/6
        ])
    
    if( name == `default` ){
      paths.push( points )
    }
    else if (name == `idle` ){
      var O = photoOverlap/2        
      
      for (let i = 0; i < animFrames; i++) {
        var firstX = rndInt(min*1.2, max) + min,
            firstY = rndInt(min*1.2, max) + min
        paths.push( Array.from([
          O + firstX,                              O + firstY,
          O + firstX + rndInt(min, max) + min,     O + firstY - rndInt(min*1.3, max),
          -O + rndInt(min, max),          O + rndInt(min, max) - min,
          -O + rndInt(min, max),          O + rndInt(min, max),
          -O + Math.sin(i/4*Math.PI*2)*rndInt(min, max) - .1*W,   O + Math.sin(i/4*Math.PI*2)*rndInt(min, max) - min,
          -O - rndInt(min, max) ,         O + rndInt(min, max) + min,
          -O + rndInt(min, max) + .01*W,  -O,
          -O + rndInt(min, max)- .03*W,   -O + rndInt(min, max),
          -O + rndInt(min, max),          -O - rndInt(min, max),
          -O + -rndInt(min, max) - .1*W,  -O - rndInt(min, max) -min,
          -O + -rndInt(min, max),         -O - rndInt(min, max),
          -O + -rndInt(min, max),         -O - rndInt(min, max),
          O + rndInt(min, max)  - .01*W,  -O - rndInt(min, max),
          O + rndInt(min, max)  + .01*W,  -O - rndInt(min, max) - min - .2*H,
          O  - rndInt(min, max) - min,    -O  + H/6
        ]))
      }
    }
    return paths
  }

  function createNeighborPath (tile, idlePath, tangentEdge ){
    var no = 50,
        paths = [],
        X = Y = W = H = 0,
        tW = tile.offsetWidth + photoOverlap,
        tH = tile.offsetHeight + photoOverlap,
        tX = tile.offsetLeft - galleryGrid.offsetLeft,
        tY = tile.offsetTop - galleryGrid.offsetTop

    if( tangentEdge.y1 == tangentEdge.y2 ){
      //top
      if( tangentEdge.y1 == tY ){
        Y += no
        H -= no
      }
      //bottom
      else if( tangentEdge.y1 == tY + tH - photoOverlap ){
        H -= no
      }
    }
    if( tangentEdge.x1 == tangentEdge.x2 ){
      //left
      if( tangentEdge.x1 == tX  ){
        X += no
        W -= no
      }
      //right
      else if( tangentEdge.x1 == tX + tW - photoOverlap ){ 
      W -= no
      }
    }

    for (let i = 0; i < animFrames; i++) {
      paths.push( idlePath.Sum( Array.from([
        X,          Y,
        X,          Y,
        X + W/4,    Y, 
        X + W/3,    Y,
        X + W/1.1,  Y,
        X + W,      Y,
    
        X + W,      Y + H/4,
        X + W,      Y + H/2,
        X + W,      Y + H,
        X + W/1.1,  Y + H,
    
        X + W/2,    Y + H,
        X + W/3,    Y + H,
        X + W/2,    Y + H,
        X,          Y + H/1.2,
        X,          Y + H/6
      ])))
    }
    return paths
  }

  function getStartingPoints( anim, path ){
    var progress = (anim.getCurrentTime() % anim.getSimpleDuration()) / anim.getSimpleDuration(),
        output = []

    if( path[0][0] == undefined ){
      output = path.Sub()
    }
    else{
      var start = Math.floor( progress * (animFrames-1) )
      
      output = path[ start ]

    }

    return output
  }

  const svgUrl = "http://www.w3.org/2000/svg",
        bulls = document.querySelectorAll(".bulls")[0],
        heifers = document.querySelectorAll(".heifers")[0],
        bullsGalleryPhotos = 23,
        photoOverlap = 40,
        animFrames = 3
  
  var galleryGrid = document.createElement("div"),
      filter = document.createElementNS(svgUrl, "filter"),
      blur = document.createElementNS(svgUrl, "feGaussianBlur"),
      gallerySvg = document.createElementNS(svgUrl, "svg"),
      frames = [],
      animsIdle = [],
      idlePaths = [],
      neighborPaths = [],
      hoverPath = Array(30).fill(0)

  createGridTiles()

  gsap.set( filter, {attr:{ id: `blurMe` }})
  gallerySvg.appendChild( filter )
  gsap.set( blur, {attr:{ stdDeviation: `1` }})
  filter.appendChild( blur )
  gsap.set( galleryGrid, {attr:{ 
    class: `galleryGrid`,
    id: `galleryGridBulls`
  }})
  bulls.appendChild( galleryGrid )
  gsap.set( gallerySvg, {attr: {
    viewBox: `0 0 ${ galleryGrid.offsetWidth } ${ galleryGrid.offsetHeight }`,
    class: `gallerySvg`,
    id: `gallerySvgBulls`
  }})
  bulls.appendChild( gallerySvg )

  galleryGrid.childNodes.forEach( (tile, i) => {
    var path = document.createElementNS(svgUrl, "path"),
        mask = document.createElementNS(svgUrl, "mask"),
        frame = document.createElementNS(svgUrl, "g"),
        image = document.createElementNS(svgUrl, "image"),
        animIdle = document.createElementNS(svgUrl, "animate"),
        animChange = document.createElementNS(svgUrl, "animate"),
        W = tile.offsetWidth + photoOverlap + 2,
        H = tile.offsetHeight + photoOverlap + 2,
        X = tile.offsetLeft - galleryGrid.offsetLeft -1,
        Y = tile.offsetTop - galleryGrid.offsetTop -1,
        neighbors = []
       

    idlePaths.push( createPath(tile, 'idle') )

    gsap.set( mask, {attr:{ id: `mask${i}` }})    
    gallerySvg.appendChild( mask )

    gsap.set( frame, {attr:{
      id: `frame${i}`,
      mask: `url(#mask${i})`,
      fill: `currentColor`,
      width: `${W}`,
      height: `${H}`,
      x: `${X}`,
      y: `${Y}`
    }})
    gallerySvg.appendChild( frame )

    gsap.set( image, {attr:{
      href: `./image/gallery/bulls/${i+1}.jpg`,
      x: `${X}`,
      y: `${Y}`,
      width: `${W}`,
      height: `${H}`,
      preserveAspectRatio: `xMidYMid slice`
    }})
    frame.appendChild( image )
    
    gsap.set( path, {attr:{
      id: `path${i}`,
      filter: `url(#blurMe)`, 
      fill: `white`,
      d: getSvgPath( createPath(tile, 'default') )
    }})
    mask.appendChild( path )    
    
    gsap.set( animChange, {attr:{
      id: `change${i}`,
      class: `animChange`,
      attributeName: `d`,
      restart: `always`,
      fill: `freeze`,
      additive: `sum`,
      dur: `1.4s`,
      to: getSvgPath( idlePaths[i][0] ),
      from: getSvgPath( hoverPath ),
      onbegin: `setAnim(true, "change${i}")`,
      onend: `setAnim(false, "change${i}")`
    }})
    path.appendChild( animChange )
    animChange.endElement()

    gsap.set( animIdle, {attr:{
      id: `idle${i}`,
      class: `animIdle`,
      attributeName: `d`,
      restart: `always`,
      additive: `sum`,
      dur: `${animFrames*2}s`,
      repeatCount: `indefinite`,
      // calcMode: `spline`,
      // keyTimes: `0; 0.166; 0.332; 0.498; 0.664; 0.83; 1`,
      // keySplines: `0.1 0 0.5 1; 0.5 0 0.5 1; 0.5 0 0.5 1; 0.5 0 0.5 1; 0.5 0 0.5 1; 0.5 0 0.5 1`,
      values: getLoopedPath( getSvgPath( idlePaths[i] ) ),
      onbegin: `setAnim(true, "idle${i}")`,
      onend: `setAnim(false, "idle${i}")`
    }})
    path.appendChild( animIdle )

    for (let j = i-1; j >= 0; j--) {
      var candidat = document.getElementById( `tile${j}` ),
          cW = candidat.offsetWidth + photoOverlap,
          cH = candidat.offsetHeight + photoOverlap,
          cX = candidat.offsetLeft - galleryGrid.offsetLeft,
          cY = candidat.offsetTop - galleryGrid.offsetTop,
          tW = tile.offsetWidth + photoOverlap,
          tH = tile.offsetHeight + photoOverlap,
          tX = tile.offsetLeft - galleryGrid.offsetLeft,
          tY = tile.offsetTop - galleryGrid.offsetTop,
          isWider = tX+tW > cX+cW,
          isHiger = tY+tH > cY+cH,
          onTop = isHiger ? cY.between( tY, tY+tH, true ) : tY.between( cY, cY+cH, true ),
          onBottom = isHiger ? ( cY+cH ).between( tY, tY+tH, true ) : ( tY+tH ).between( cY, cY+cH, true ),
          onLeft = isWider ? cX.between( tX, tX+tW, true ) : tX.between( cX, cX+cW, true ),
          onRight = isWider ? ( cX+cW ).between( tX, tX+tW, true ) : ( tX+tW ).between( cX, cX+cW, true )

      if(( onTop || onBottom ) && ( onLeft || onRight )){
        var neighborTile = document.getElementById( `tile${j}` ),
            tangentEdge = {
              x1: Math.max( cX, tX ),
              y1: Math.max( cY, tY ),
              x2: Math.min( cX + cW - photoOverlap, tX + tW - photoOverlap ),
              y2: Math.min( cY + cH - photoOverlap, tY + tH - photoOverlap )
            }

        neighbors.push( {id: j, path: createNeighborPath( neighborTile, idlePaths[i][0], tangentEdge )} )
        neighborPaths[j].push( {id: i, path: createNeighborPath(tile, idlePaths[j][0], tangentEdge )} )

        // gsap.set( animChange, {attr:{
        //   begin: animChange.getAttribute(`begin`).concat(`; frame${j}.mouseover; frame${j}.mouseout`)
        // }})
        // gsap.set( animIdle, {attr:{
        //   end: animIdle.getAttribute(`end`).concat(`; frame${j}.mouseover; frame${j}.mouseout`)
        // }})

        // gsap.set( neighborAnimChange, {attr:{
        //   begin: neighborAnimChange.getAttribute(`begin`).concat(`; frame${i}.mouseover; frame${i}.mouseout`)
        // }})
        // gsap.set( neighborAnimIdle, {attr:{
        //   end: neighborAnimIdle.getAttribute(`end`).concat(`; frame${i}.mouseover; frame${i}.mouseout`)
        // }})
      }
    }

    neighborPaths.push ( neighbors )
  })

  frames = document.getElementById(`gallerySvgBulls`).getElementsByTagName(`g`)
  animsIdle = document.getElementById(`gallerySvgBulls`).getElementsByClassName(`animIdle`)
  animsChange = document.getElementById(`gallerySvgBulls`).getElementsByClassName(`animChange`)


  function addEventHandler(frame, animsIdle, animsChange, idlePaths, neighbors, i) {
    frame.addEventListener( `mouseover`, () =>{
      var out = animsChange[i],
          idle = animsIdle[i],
          path = idlePaths[i],
          from = getStartingPoints(idle, path)

      idle.endElement()

      gsap.set( out, {attr:{
        from: getSvgPath( getStartingPoints(idle, path) ),
        to: getSvgPath( hoverPath )
      }})

      out.beginElement()  

      neighbors.forEach( p => {
        out = animsChange[p.id]
        idle = animsIdle[p.id]
        path = idlePaths[p.id]
        from = getStartingPoints(idle, path)
        
        idle.endElement()

        gsap.set( idle, {attr:{
          values: getLoopedPath(  getSvgPath( p.path ) ) 
        }})

        gsap.set( out, {attr:{
          from: getSvgPath( getStartingPoints(idle, path) ),
          to: getSvgPath( p.path[0] )
        }})

        out.beginElement()    
      })
    })

    frame.addEventListener( `mouseout`, () =>{
      var out = animsChange[i],
          idle = animsIdle[i],
          path = idlePaths[i]

      gsap.set( out, {attr:{
        from: getSvgPath( hoverPath ),
        to: getSvgPath( path )
      }})
      out.beginElement()
      idle.beginElement()

      neighbors.forEach( p => {
        out = animsChange[p.id]
        idle = animsIdle[p.id]
        path = idlePaths[p.id]

        gsap.set( idle, {attr:{
          values: getLoopedPath( getSvgPath( path ) )
        }})

        gsap.set( out, {attr:{
          from: getSvgPath( getStartingPoints(out, p.path) ),
          to: getSvgPath( path[0] )
        }})

        out.endElement()  
        idle.beginElement()      
      })
    })
}
  for (var i=0; i < frames.length; i++) {
    addEventHandler(frames[i], animsIdle, animsChange, idlePaths, neighborPaths[i], i)
  }

  // console.log(idlePaths)
  // galleryGrid.childNodes.forEach( ( tile, i ) => {
  //   var frame = document.getElementById(`frame${i}`),
  //       tileAnimIdle = document.getElementById( `idle${i}` ),
  //       tileAnimHover = document.getElementById( `hover${i}` ),
  //       tileAnimChange = document.getElementById( `out${i}` )

  //   frame.addEventListener( `mouseover`, () =>{
  //   })
  //   frame.addEventListener( `mouseout`, () =>{
  //     tileAnimChange.beginElement()   
  //   })
  // })
}

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
  const subpage = document.URL.split('#', 2)[1]

  if(subpage != undefined)
    for (let i = 0; i < links.length; i++) {
      if (links[i].getAttribute('href') === '#' + subpage) 
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