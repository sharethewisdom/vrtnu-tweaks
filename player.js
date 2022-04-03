console.log("init")

let select;
switch (document.location.host) {
  case "sporza.be":
    select = [
      "ui-container",
      "overlay-container",
      "control-container",
      "playhead-slider",
      "volume-slider"
    ];
    break;
  case "dagelijksekost.een.be":
  case "www.vrt.be":
    select = [
      "video-ui-container",
      "video-overlay-container",
      "video-control-container",
      "common-playhead-slider",
      "common-volume-slider"
    ];
    break;
}

const qs = (selector, parent = document.documentElement) => {
  return parent.shadowRoot ? parent.shadowRoot.querySelector(selector) : parent.querySelector(selector)
}

const qsa = (selector, parent = document.documentElement) => {
  return parent.shadowRoot ? [...parent.shadowRoot.querySelectorAll(selector)] : [...parent.querySelector(selector)]
}

// sleep(1000).then(() => {})
const sleep = (duration) => {
  return new Promise(resolve => {
    setTimeout(resolve, duration)
  })
}

const appendStyle = (
  parent=document.documentElement,
  id=Math.floor(Math.random()*10000),
  css="",
  element=document.createElement("style")
) => {
  element.type = "text/css";
  element.id = "vrtnu-tweaks-" + id;
  element.textContent = css;
  parent.shadowRoot ? parent.shadowRoot.appendChild(element) : parent.appendChild(element);
}

const getCSSValue = (element=document.documentElement, property) => {
  let value = getComputedStyle(element).getPropertyValue(property);
  return value === "" ? "1" : value;
}

let playheadCSS = `
:host {
  display:block !important;
  line-height: 1 !important;
  font-size: 1rem !important;
}
* {
  font-size: inherit !important;
  line-height: inherit !important;
}
.slider-container {
  position:relative;
  height: 1em !important;
}
.slider{
  width:100% !important;
  margin: 0 !important;
  border-radius: 0.5em !important;
  background-color: rgba(255,255,255,0.4) !important;
}
.slider-part-filled,
.slider-part-played{
  border-radius: 0.5em 0 0 0.5em !important;
  background: repeating-linear-gradient(-65deg, midnightblue, midnightblue 0.5em, lightskyblue 0.5em, lightskyblue 1em) !important;
}
.slider,
.slider-part-filled,
.slider-part-played{
  position:absolute !important;
  height: 1em !important;
}
.control-container--bottom--controls{
  background-color: black !important;
}
.slider:focus-visible::-moz-range-thumb,
.slider::-moz-range-thumb{
  box-shadow: 0.1em 0.1em 0.1em black, 0 0 0.1em grey !important;
  border: none !important;
  height: 1em !important;
  width:  1em !important;
  border-radius: 100% !important;
  background: white !important;
  cursor: pointer !important;
  appearance: none !important;
  z-index: 3 !important;
}
`

// video{
//   position: absolute !important;
// }
let controlCSS = `
.sc-control-container-h,
.sc-video-control-container-h {
 position:absolute !important;
 top:0 !important;
 left:0 !important;
 width:inherit !important;
 height:inherit !important;
 display:flex !important;
 flex-direction:column !important;
 z-index:10 !important;
 overflow:hidden !important;
}
.invisible {
 visibility:hidden !important;
 pointer-events:none !important;
}
.mouse-events-forced {
 pointer-events:all !important;
}
.control-container--top,
.control-container--middle,
.control-container--bottom{
  height:33.33% !important;
}
.control-container--top {
 display:flex !important;
 flex-direction:row !important;
}
.control-container--top video-title {
 padding-top:8px !important;
}
.control-container--middle {
 visibility:hidden !important;
 pointer-events:none !important;
}
.control-container--bottom {
 display:flex !important;
 flex-direction:column !important;
}
.control-container--bottom:hover .control-container--bottom--play-head {
 opacity: 1 !important;
}
.control-container--bottom .control-container--bottom--play-head {
 opacity: 0.01 !important;
 transition: opacity 0.6s ease-in-out !important;
 margin-top:auto !important;
 margin-left:16px !important;
 margin-right:16px !important;
}
.control-container--bottom .control-container--bottom--controls {
 display:flex !important;
 flex-direction:row !important;
 bottom:0 !important;
 height:48px !important;
}
.control-container--bottom .control-container--bottom--controls .volume-slider {
 display:flex !important;
 align-items:center !important;
 width:64px !important;
}
ul.sc-video-control-container {
 padding:0 !important;
 margin:0 !important;
 list-style:none !important;
}
ul.sc-control-container li.sc-control-container,
ul.sc-video-control-container li.sc-video-control-container {
 padding-bottom:10px !important;
}
`

const containerCSS = `
.vrt-mediaplayer-container{
  --vid-contrast: 1;
  --vid-brightness: 1;
}
.vrt-mediaplayer-container video{
  filter: brightness(var(--vid-brightness)) contrast(var(--vid-contrast));
}
.theatre-mode.vrt-mediaplayer-container{
  width: 100% !important;
  max-width: calc((100vh - 42px) * 1.77)  !important;
}
`

const pageCSS = `
.theatre-mode .video-page{
  --main-content-width: 100% !important;
}
@media (min-width: 1024px) {
  .theatre-mode .video-page{
    flex-direction: column !important;
  }
  .theatre-mode .video-page aside{
    height: auto !important;
    width: 100% !important;
  }
}
`

const onPlayerReady = (e,page) => {
  e.target.addEventListener("keydown", (e,main,container,video,volume) => {
    let value,float,result;
    container = qs("div", e.target)
    video = qs("video",container)
    if (select !== "undefined"){
      ui = qs(select[0],container)
    }
    switch (e.key) {
      // TODO: add media play/pause key
      case "k":
        if (video.paused) {
          if (ui) ui.dispatchEvent(new CustomEvent('doPlay'));
          else video.play();
        } else {
          if (ui) ui.dispatchEvent(new CustomEvent('doPause'));
          else video.pause();
        }
        break;
      case "ArrowUp":
        e.preventDefault();
        if (ui) {
          // change the slider, then trigger an event to update the volume on <video>
          volume = qs("input",qs(select[4],ui));
          value = parseInt(volume.value);
          volume.value = value > 100 ? 100 : value + 5;
          volume.dispatchEvent(new Event('change'));
          // ui.dispatchEvent(new CustomEvent('volumeUpdated'));
        } else {
          video.volume = video.volume > 1 ? 1 : parseFloat(video.volume).toFixed(1) + parseFloat("0.1");
        }
        break;
      case "ArrowDown":
        e.preventDefault();
        if (ui) {
          // change the slider, then trigger an event to update the volume on <video>
          volume = qs("input",qs(select[4],ui));
          value = parseInt(volume.value);
          volume.value = value < 0 ? 0 : value - 5;
          volume.dispatchEvent(new Event('change'));
          // ui.dispatchEvent(new CustomEvent('volumeUpdated'));
        } else {
          video.volume = video.volume >= 0 ? 0 : parseFloat(video.volume).toFixed(1) - parseFloat("0.1");
        }
        break;
      case "ArrowLeft":
        e.preventDefault();
        if (ui) ui.dispatchEvent(new CustomEvent('doRewind'));
        else video.fastSeek(video.currentTime>5?video.currentTime-5:0);
        break;
      case "ArrowRight":
        e.preventDefault();
        if (ui) ui.dispatchEvent(new CustomEvent('doFastForward'));
        else video.fastSeek(video.currentTime+5);
        break;
      case "[":
        e.preventDefault();
        rate = video.playbackRate*10 > 2 ? video.playbackRate*10 - 2 : 0;
        video.playbackRate = Math.floor(rate) / 10;
        console.log(video.playbackRate);
        ui?.dispatchEvent(new CustomEvent('speedSelectionchanged'))
        break;
      case "]":
        e.preventDefault();
        rate = video.playbackRate*10 < 20 ? video.playbackRate*10 + 2 : 20;
        video.playbackRate = Math.floor(rate) / 10;
        console.log(video.playbackRate);
        ui?.dispatchEvent(new CustomEvent('speedSelectionchanged'))
        break;
      case "t":
        e.preventDefault();
        if (document.location.host !== "sporza.be") {
          main = document.getElementById("main")
          main.classList.toggle("theatre-mode")
          container.classList.toggle("theatre-mode")
        }
        break;
      // adjust contrast
      case "1":
        e.preventDefault();
        value = getCSSValue(container,"--vid-contrast");
        float = parseFloat(value) - parseFloat("0.125");
        result = float.toFixed(2) < 0 ? "0" : float.toFixed(2).toString();
        container.style.setProperty("--vid-contrast", result.toString(), "important");
        break;
      case "2":
        e.preventDefault();
        value = getCSSValue(container,"--vid-contrast");
        float = parseFloat(value) + parseFloat("0.125");
        result = float.toFixed(2) >= 2 ? "2" : float.toFixed(2).toString();
        container.style.setProperty("--vid-contrast", result.toString(), "important");
        break;
      // adjust brightness
      case "3":
        e.preventDefault();
        value = getCSSValue(container,"--vid-brightness");
        float = parseFloat(value) - parseFloat("0.125");
        result = float.toFixed(2) < 0 ? "0" : float.toFixed(2).toString();
        container.style.setProperty("--vid-brightness", result.toString(), "important");
        break;
      case "4":
        e.preventDefault();
        value = getCSSValue(container,"--vid-brightness");
        float = parseFloat(value) + parseFloat("0.125");
        result = float.toFixed(2) >= 2 ? "2" : float.toFixed(2).toString();
        container.style.setProperty("--vid-brightness", result.toString(), "important");
        break;
    }
  });

  sleep(2000).then(() => {
    e.target.focus()
    // TODO: don't assume that the first div is the media player container (see above)
    //       ".vrt-mediaplayer-container" should be the first child div
    //       of <vrt-mediaplayer> 's shadowroot on all hosts except sporza.be (?)
    container = qs("div", e.target)
    video = qs("video",container)
    // video.addEventListener('canplaythrough', function onVideoPlayable(e) {
    //   HTMLelementObserver.disconnect();
    //   console.log("video can probably be played through", e.target);
    //   // e.target.removeEventListener("canplaythrough", onVideoPlayable);
    // }, { once: true });
    ui = qs(select[0],container)
    overlay = qs(select[1],ui)
    controls = qs(select[2],ui)
    slider = qs(select[3],ui)
    console.log(
      "ui: ", ui,
      "overlay: ", overlay,
      "controls: ", controls,
      "slider: ", slider
    )
    overlay?.remove()
    ui.dispatchEvent(new CustomEvent("doPlay"));
    if (video.muted) ui.dispatchEvent(new CustomEvent('doUnmute'));
    video.addEventListener("ended", e => {
      if (/s\d+a\d+\/$/.test(document.location.pathname)) {
        let tryNext = document.location.href.replace(/(.*s\d+a)(\d+)\/$/, ($0, $1, $2) => {return $1 + (parseInt($2) + 1) + "/"})
        fetch(tryNext, {mode: 'no-cors'}).then(r=>document.location.replace(tryNext)).catch(e=>console.error(tryNext + " is unreachable.", e))
      }
    })

    // remove styles from the player and slider elements
    let styles = qsa("style", e.target);
    styles.push.apply(styles,qsa("style", slider))
    styles.forEach(e => e.remove())

    // add styles
    appendStyle(e.target,"player",containerCSS)
    appendStyle(controls,"controls",controlCSS)
    appendStyle(slider,"slider",playheadCSS)
    // I like to start out in theatre mode on vrtnu pages
    if (/^\/vrtnu.*/.test(document.location.pathname)) container.classList.add("theatre-mode")
  })
  // e.target.removeEventListener("playerReady", onPlayerReady);
}

let observeElements = (mutation) => {
  mutation.forEach( record => {
    if (!record.addedNodes) return
    record.addedNodes.forEach( node => {
      switch (node.tagName.toLowerCase()) {
        case "vrt-mediaplayer":
          console.log(node)
          HTMLelementObserver.disconnect();
          node.addEventListener("playerReady", onPlayerReady, { once: true });
          break;
      }
    })
  })
}

const HTMLelementObserver = new MutationObserver(observeElements);

if (document.readyState === "loading") {
  window.addEventListener("DOMContentLoaded", (e,main,container) => {
    if (document.location.host !== "sporza.be") {
      main = document.getElementById("main");
      appendStyle(main,"page",pageCSS)
      // I like to start out in theatre mode on vrtnu pages
      if (/\/vrtnu.*/.test(document.location.pathname)) main.classList.add("theatre-mode")
    }
    HTMLelementObserver.observe(document.documentElement, {
      subtree: true, childList: true
    })
  }, { once: true });
} else {
  window.location.reload(true);
}
