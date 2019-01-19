/**
 * Copyright 2019 Alex Perez (alxpez)
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 * http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { secondsToHms } from './helpers/transformer';
import { toggleFullScreen, isFullScreen } from './helpers/fullscreen';
import { setupBaseTemplate } from './templates/base';
import { setupControlsTemplate, renderControlsTemplate } from './templates/controls';
import { setupVideoTemplate, renderVideoTemplate} from './templates/video';
import { setupChoicesTemplate, renderChoicesTemplate } from './templates/choices';

class Ivid extends HTMLElement {
  
  static get observedAttributes() {
    return ['srcmap', 'current'];
  }

  constructor() {
    super();

    Object.defineProperties(this, {
      state: {
        value: this.setup(),
        writable: true
      },
      setState: {
        value: (newState) => {
          for (let key in newState) {
            if (newState.hasOwnProperty(key)) this.state[key] = newState[key];
          }
          this.render();
        }
      },
      onProgressClick: {
        value: (event) => {
          let video = this.state.videoTemplate;
          let prog = event.target;
          let pos = (event.pageX - (prog.offsetLeft + prog.offsetParent.offsetLeft)) / prog.offsetWidth;
          video.currentTime = pos * video.duration;
        }
      },
      onPlayClick: {
        value: () => {
          this.togglePlay();
        }
      },
      onVolumeClick: {
        value: () => {
          this.toggleMute();
        }
      },
      onVolumeHover: {
        value: () => {
          let volumeSlider = this.state.controls.volume.volumeSlider;
          volumeSlider.setAttribute('data-state', 'open');
        }
      },
      onVolumeLeave: {
        value: () => {
          let volumeSlider = this.state.controls.volume.volumeSlider;
          volumeSlider.setAttribute('data-state', 'close');
        }
      },
      onVolumeChange: {
        value: (event) => {
          this.changeVolume(event.target.value);
        }
      },
      onFullscreenClick: {
        value: () => {
          toggleFullScreen();
          this.changeButtonState('fullscreen');
        }
      },
      onVideoClick: {
        value: () => {
          this.togglePlay();
        }
      },
      onLoadedMetadata: {
        value: () => {
          let controls = this.state.controls;
          let video = this.state.videoTemplate;
          controls.progress.progressElement.setAttribute('max', video.duration);
          controls.volume.volumeSlider.setAttribute('value', video.volume * 100);
          this.changeButtonState('mute');
          this.changeButtonState('play');
        }
      },
      onTimeUpdate: {
        value: () => {
          let s = this.state;
          let current = s.srcmap[s.current];
          let video = s.videoTemplate;
          let controls = this.state.controls;

          controls.time.innerHTML = `${secondsToHms(video.currentTime)}  /  ${secondsToHms(video.duration)}`;
          controls.progress.progressElement.value = video.currentTime;
          controls.progress.progressValue.style.width = Math.floor((video.currentTime / video.duration) * 100) + "%";

          if (current.options) {
            let timeout = current.options.timeout;
            let countdown = (timeout ? timeout : 10);

            if (video.duration - video.currentTime <= countdown) {
              if(s.videoAttrs.controls) s.controls.controlsTemplate.setAttribute('data-state', 'hidden');
              s.choicesTemplate.removeAttribute('data-state');
            }
          }
        }
      },
      onVideoEnded: {
        value: () => {
          let s = this.state;
          if(!s.next) return;

          this.setAttribute('current', s.next);
          if(s.videoAttrs.controls) s.controls.controlsTemplate.removeAttribute('data-state');
          s.choicesTemplate.setAttribute('data-state', 'hidden');
        }
      },
      onChoiceSelected: {
        value: (choiceUid) => {
          this.setAttribute('next', choiceUid);
          this.state.next = choiceUid;
        }
      },
      onMouseMoveIvid: {
        value: () => {
          let choices = this.state.choicesTemplate;
          let controls = this.state.controls.controlsTemplate;

          clearTimeout(this.state.timer);
          this.state.timer = setTimeout(() => {
            controls.setAttribute('data-state', 'hidden')
          }, 2300);
    
          if (choices.getAttribute('data-state')) controls.removeAttribute('data-state');
        }
      },
      onKeydown: {
        value: (event) => {
          let video = this.state.videoTemplate;
          switch (event.keyCode) {
            // F (Fullscreen)
            case 70: toggleFullScreen(); break;
            // M (Mute)
            case 77: this.toggleMute(); break;
            // arrow_right (forwards)
            case 39: this.forwardVideo(); break;
            // arrow_left (backwards)
            case 37: this.backwardVideo(); break;
            // arrow_top (volume up)
            case 38: this.changeVolume((video.volume*100)+10); break;
            // arrow_bottom (volume down)
            case 40: this.changeVolume((video.volume*100)-10); break;
            // space (play/pause)
            case 32: this.togglePlay(); break;
          }
        }
      }
    });
  }


  connectedCallback() {
    let s = this.state;
    this.render();

    renderControlsTemplate(
      s.controls,
      this.onProgressClick,
      this.onPlayClick,
      this.onVolumeClick,
      this.onVolumeHover,
      this.onVolumeLeave,
      this.onVolumeChange,
      this.onFullscreenClick
    );

    document.onkeydown = (e) => this.onKeydown(e);
    s.baseTemplate.onmousemove = () => this.onMouseMoveIvid();

    s.baseTemplate.onmouseleave = (e) => {
      s.controls.controlsTemplate.setAttribute('data-state', 'hidden');
    };
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if(oldValue !== null) {
      this.setState({
        [name]: (name === 'srcmap') ? JSON.parse(newValue) : newValue,
      });
    }
  }


  setup() {
    // HTML5 video attributes to pass down
    let videoAttrs = {
      autoplay: this.hasAttribute('autoplay') || null,
      controls: this.hasAttribute('controls') || null,
      muted: this.hasAttribute('muted') || null,
      playsinline: this.hasAttribute('playsinline') || null,
      poster: this.getAttribute('poster'),
      preload: this.getAttribute('preload'),
    };
    
    // IVID specific attrubutes
    let srcmap = JSON.parse(this.getAttribute('srcmap'));
    let next = this.getAttribute('next') || '';
    let current = this.getAttribute('current');

    if (!current) {
      current = Object.keys(srcmap)[0];
      this.setAttribute('current', current);
    }

    // HTMLElements - IVID skeleton
    let baseTemplate = setupBaseTemplate();
    let videoTemplate = setupVideoTemplate(this.firstElementChild);
    let choicesTemplate = setupChoicesTemplate();
    let controls = setupControlsTemplate();

    // Renders the component skeleton
    this.innerHTML = '';
    baseTemplate.appendChild(videoTemplate);
    baseTemplate.appendChild(choicesTemplate);
    baseTemplate.appendChild(controls.controlsTemplate);
    this.appendChild(baseTemplate);

    let timer = setTimeout(null, 300);

    return {
      videoAttrs,
      srcmap,
      next,
      current,
      baseTemplate,
      videoTemplate,
      choicesTemplate,
      controls,
      timer,
    }
  }

  render() {
    let s = this.state;
    let currentVideo = s.srcmap[s.current];

    if(currentVideo.options) {
      // Set fallback selection
      let fallback = currentVideo.options.fallback || Object.keys(currentVideo.options.choices)[0]
      this.onChoiceSelected(fallback);
      if(currentVideo.options.choices) {
        renderChoicesTemplate(s.choicesTemplate, currentVideo, this.onChoiceSelected);
      }
    } else {
      this.onChoiceSelected(null);
    }

    renderVideoTemplate(
      s.videoTemplate,
      s.videoAttrs,
      currentVideo,
      this.onVideoClick,
      this.onLoadedMetadata,
      (currentVideo.options ? this.onVideoEnded : null),
      (currentVideo.options ? this.onTimeUpdate : null)
    );
  }


  // Internal helper functions
  forwardVideo() {
    let video = this.state.videoTemplate;
    (video.currentTime++ > video.duration) ? video.currentTime = video.duration : video.currentTime++;
  }

  backwardVideo() {
    let video = this.state.videoTemplate;
    (video.currentTime-- < 0) ? video.currentTime = 0 : video.currentTime--;
  }

  togglePlay() {
    let video = this.state.videoTemplate;
    video.paused ? video.play() : video.pause();
    this.changeButtonState('play');
  }

  toggleMute() {
    let video = this.state.videoTemplate;
    video.muted = !video.muted;
    this.changeButtonState('mute');
  }

  changeVolume(value) {
    let video = this.state.videoTemplate;
    video.volume = (value > 100) ? 1 : (value < 0) ? 0 : value/100;
    video.muted = (value <= 0) ? true : false;
    this.changeButtonState('mute');
  }

  changeButtonState(type) {
    let ivid = this.state.baseTemplate;
    let video = this.state.videoTemplate;
    let controls = this.state.controls;

    switch (type) {
      case 'play': 
        controls.playButton.setAttribute('data-state', (video.paused || video.ended)
          ? 'play_arrow'
          : 'pause'
        );
        break;

      case 'mute': 
        controls.volume.volumeSlider.setAttribute('value', video.volume*100);
        controls.volume.volumeButton.setAttribute('data-state', video.muted
          ? 'volume_off'
          : (video.volume >= 0.5)
            ? 'volume_up'
            : 'volume_down'
        );
        break;

      case 'fullscreen': 
        ivid.setAttribute('data-state', isFullScreen() ? 'fullscreen' : '');
        controls.fullscreenButton.setAttribute('data-state', isFullScreen() ? 'fullscreen' : 'fullscreen_exit');
        break;
    }
  }

}

customElements.define('i-video', Ivid);