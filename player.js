@charset "UTF-8";
.sc-video-control-container-h {
 position:absolute;
 top:0;
 width:inherit;
 height:inherit;
 display:-ms-flexbox;
 display:flex;
 -ms-flex-direction:column;
 flex-direction:column;
 z-index:10;
 overflow:hidden;
}
.invisible.sc-video-control-container {
 visibility:hidden;
 pointer-events:none
}
.not-rendered.sc-video-control-container {
 display:none
}
.mouse-events-forced.sc-video-control-container {
 pointer-events:all
}
.control-container--top.sc-video-control-container {
 display:-ms-flexbox;
 display:flex;
 -ms-flex-direction:row;
 flex-direction:row;
 height:33.33%
}
.control-container--top.sc-video-control-container video-title.sc-video-control-container {
 padding-top:8px
}
.control-container--middle.sc-video-control-container {
 display:-ms-flexbox;
 display:flex;
 -ms-flex-align:center;
 align-items:center;
 -ms-flex-pack:center;
 justify-content:center;
 height:33.33%
}
.control-container--middle.sc-video-control-container *.sc-video-control-container {
 padding-left:15px;
 padding-right:15px
}
.control-container--middle.screen-sm.sc-video-control-container *.sc-video-control-container {
 padding-left:0 !important;
 padding-right:0 !important
}
.control-container--bottom.sc-video-control-container {
 height:33.34%;
 display:-ms-flexbox;
 display:flex;
 -ms-flex-direction:column;
 flex-direction:column
}
.control-container--bottom.sc-video-control-container .control-container--bottom--play-head.sc-video-control-container {
 margin-top:auto;
 margin-left:16px;
 margin-right:16px
}
.control-container--bottom.sc-video-control-container .control-container--bottom--controls.sc-video-control-container {
 display:-ms-flexbox;
 display:flex;
 -ms-flex-direction:row;
 flex-direction:row;
 bottom:0;
 height:48px
}
.control-container--bottom.sc-video-control-container .control-container--bottom--controls.sc-video-control-container .volume-slider.sc-video-control-container {
 display:-ms-flexbox;
 display:flex;
 -ms-flex-align:center;
 align-items:center;
 width:64px
}
ul.sc-video-control-container {
 padding:0;
 margin:0;
 list-style:none
}
ul.sc-video-control-container li.sc-video-control-container {
 padding-bottom:10px
}
