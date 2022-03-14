let recursiveWalk = (node, func) => {
  var done = func(node);
  if (done) return true;
  if ('shadowRoot' in node &&  node.shadowRoot) {
    var done = recursiveWalk(node.shadowRoot, func);
    if (done) return true;
  }
  node = node.firstChild;
  while (node) {
    var done = recursiveWalk(node, func);
    if (done) return true;
    node = node.nextSibling;
  }
}

let focusPlayer = (player) => {
  let count = 0;
  let i = setInterval(() => {
    player.focus()
    count++;
    if (document.activeElement === player) {
      clearInterval(i);
    } else if (count > 10) {
      clearInterval(i);
      return false
    }
  }, 200)
  return true
}

let stylePlayer = (player) => {
  try {
    recursiveWalk(player, (node) => {
      if (node.classList?.contains("overlay-container-gradient")) {
        node.style.display = "none";
      }
      if (node.classList?.contains("slider-part-filled")
        || node.classList?.contains("slider-vrtnu")
        || node.classList?.contains("slider")
        || node.classList?.contains("slider-part-played")) {
        node.style.setProperty("height", "14px", "important")
        node.style.setProperty("margin-top", "0px", "important")
      }
      if (node.classList?.contains("slider")) {
        node.style.setProperty("background-color", "rgba(255,255,255,0.4)", "important")
        node.style.setProperty("box-shadow", "inset 0 2px 3px rgba(#000, .5)", "important")
      }
      if (node.classList?.contains("slider-part-filled")
        || node.classList?.contains("slider-part-played")) {
        node.style.setProperty("background-color", "#00f", "important")
      }
      if (node.classList?.contains("time-indicator")) {
        node.style.setProperty("color", "#fff", "important")
        node.style.setProperty("font-size", "1rem", "important")
      }
      if (node.classList?.contains("video")) {
        node.style.setProperty("height", "100%", "important")
      }
    });
  } catch {
    return false
  }
  return true
}

let doStuff = (player) => {
  if (stylePlayer(player)) console.log('the player was styled succesfully');
  if (focusPlayer(player)) console.log('the player was activated succesfully');
  let container = player.shadowRoot.querySelector('.vrt-mediaplayer-container');
  let video = player.shadowRoot.querySelector('video');
  let videoui = player.shadowRoot.querySelector('video-ui-container');
  videoui.dispatchEvent(new CustomEvent('doPlay'));
  setTimeout(() => {
    if (video.muted) videoui.dispatchEvent(new CustomEvent('doUnmute'));
  }, 1000);
  player.addEventListener('keydown', e => {
    let rate;
    switch (e.key) {
      case "[":
        e.preventDefault();
        rate = video.playbackRate*10 > 2 ? video.playbackRate*10 - 2 : 0;
        video.playbackRate = Math.floor(rate) / 10;
        console.log(video.playbackRate);
        videoui.dispatchEvent(new CustomEvent('speedSelectionchanged'))
        break;
      case "]":
        e.preventDefault();
        rate = video.playbackRate*10 < 20 ? video.playbackRate*10 + 2 : 20;
        video.playbackRate = Math.floor(rate) / 10;
        console.log(video.playbackRate);
        videoui.dispatchEvent(new CustomEvent('speedSelectionchanged'))
        break;
      // case ">":
      //   e.preventDefault();
      //   videoui.dispatchEvent(new CustomEvent('doNextPlaylistItem'))
      //   break;
      // case "<":
      //   e.preventDefault();
      //   videoui.dispatchEvent(new CustomEvent('doPreviousPlaylistItem'))
      //   break;
      case "ArrowLeft":
        e.preventDefault();
        // video.fastSeek(video.currentTime>5?video.currentTime-5:0);
        videoui.dispatchEvent(new CustomEvent('doRewind'))
        break;
      case "ArrowRight":
        e.preventDefault();
        // video.fastSeek(video.currentTime+5);
        videoui.dispatchEvent(new CustomEvent('doFastForward'))
        break;
    }
    setTimeout(() => { container.dispatchEvent(new CustomEvent('hideControlsForSettings')) }, 500);
  // container.dispatchEvent(new CustomEvent('hideControlsForSettings'))
  })
  // videoui.addEventListener('qualitySelectionChanged', e => {
    // if (video.muted) videoui.dispatchEvent(new CustomEvent('doUnmute'));
  // })
}


// }

let player = document.getElementsByTagName("vrt-mediaplayer")[0];
if (player === undefined) {
  console.log('waiting for the player...');
  let HTMLelementObserver = new MutationObserver( m => {
    m.forEach( record => {
      if (!record.addedNodes) return
      record.addedNodes.forEach( node => {
        if (node.tagName === "NUI-MEDIA--WRAPPER"){
          HTMLelementObserver.disconnect()
          HTMLelementObserver.observe(node, { childList: true });
        } else if (node.tagName === "VRT-MEDIAPLAYER"){
          HTMLelementObserver.disconnect()
          setTimeout(doStuff, 1000, node);
        }
      })
    })
  })
  HTMLelementObserver.observe(document.querySelector('nui-media'), { childList: true });
} else {
  setTimeout(doStuff, 1000, player);
}

