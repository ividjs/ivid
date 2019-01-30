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
import { setupChoicesTemplate, renderChoicesTemplate, resetChoicesTemplate } from './templates/choices';

class Ivid extends HTMLElement {
  
  static get observedAttributes() {
    return ['model', 'current'];
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
          let videoTpl = this.state.videoTemplate;
          let prog = event.target;
          let pos = (event.pageX - (prog.offsetLeft + prog.offsetParent.offsetLeft)) / prog.offsetWidth;
          videoTpl.currentTime = pos * videoTpl.duration;
        }
      },
      onPlayClick: {
        value: (event) => {
          event.preventDefault();
          this.togglePlay();
        }
      },
      onVolumeClick: {
        value: (event) => {
          event.preventDefault();
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
        value: (event) => {
          event.preventDefault();
          this.togglePlay();
          this.onShowControls();
        }
      },
      onLoadedMetadata: {
        value: () => {
          let controls = this.state.controls;
          let videoTpl = this.state.videoTemplate;
          controls.volume.volumeSlider.setAttribute('value', videoTpl.volume * 100);
          this.changeButtonState('mute');
          this.changeButtonState('pause');
        }
      },
      onTimeUpdate: {
        value: () => {
          let s = this.state;
          let videoItem = s.model[s.current];
          let videoTpl = s.videoTemplate;
          let controls = this.state.controls;

          controls.time.innerHTML = `${secondsToHms(videoTpl.currentTime || 0)}  /  ${secondsToHms(videoTpl.duration || 0)}`;
          controls.progress.progressValue.style.width = Math.floor((videoTpl.currentTime / videoTpl.duration) * 100) + "%";

          if (s.choicesTemplate.hasAttribute('data-state') && videoItem.options && videoItem.options.choices) {
            const timeout = videoItem.options.timeout;
            const countdown = (timeout ? timeout : 10);
            if (videoTpl.duration - videoTpl.currentTime <= countdown) {
              if(s.videoAttrs.controls) s.controls.controlsTemplate.setAttribute('data-state', 'hidden');
              s.choicesTemplate.removeAttribute('data-state');
            }
          }

          if (videoTpl.duration - videoTpl.currentTime <= 1) {
            let fallback = null;
            if (s.next)
              fallback = s.next;
            else if (videoItem.options)
              fallback = videoItem.options.fallback || Object.keys(videoItem.options.choices)[0];
              
            this.onChoiceSelected(fallback);
          }
        }
      },
      onVideoEnded: {
        value: () => {
          let s = this.state;

          s.choicesTemplate.setAttribute('data-state', 'hidden');
          if(!s.next) return;

          this.setAttribute('current', s.next);
          if(s.videoAttrs.controls) s.controls.controlsTemplate.removeAttribute('data-state');
        }
      },
      onChoiceSelected: {
        value: (choiceUid, event) => {
          if (event) event.preventDefault();
          let choices = this.state.choicesTemplate;

          this.setAttribute('next', choiceUid);
          this.state.next = choiceUid;

          for (let i = 0; i < choices.children.length; i++) {
            let choiceBtn = choices.children[i];
            
            (choiceBtn.id.toString() === choiceUid.toString())
              ? choiceBtn.setAttribute('data-state', 'selected')
              : choiceBtn.removeAttribute('data-state');
          }
        }
      },
      onShowControls: {
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
          this.onShowControls();
          let videoTpl = this.state.videoTemplate;
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
            case 38: this.changeVolume((videoTpl.volume*100)+10); break;
            // arrow_bottom (volume down)
            case 40: this.changeVolume((videoTpl.volume*100)-10); break;
            // space (play/pause)
            case 32: this.togglePlay(); break;
          }
        }
      }
    });
  }


  connectedCallback() {
    this.render();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if(oldValue !== null) {
      this.setState({
        [name]: (name === 'model') ? JSON.parse(newValue) : newValue,
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
    let model = JSON.parse(this.getAttribute('model'));
    let next = this.getAttribute('next') || '';
    let current = this.getAttribute('current');

    if (!current) {
      current = Object.keys(model)[0];
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

    // Keyboard and mouse event hooks
    document.onkeydown = (e) => this.onKeydown(e);
    baseTemplate.onmousemove = () => this.onShowControls();

    baseTemplate.onmouseleave = (e) => {
      controls.controlsTemplate.setAttribute('data-state', 'hidden');
    };

    let timer = setTimeout(null, 300);

    return {
      videoAttrs,
      model,
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
    let currentVideo = s.model[s.current];

    this.onChoiceSelected('');

    (currentVideo.options && currentVideo.options.choices)
      ? renderChoicesTemplate(s.choicesTemplate, currentVideo, this.onChoiceSelected)
      : resetChoicesTemplate(s.choicesTemplate);

    renderVideoTemplate(
      s.videoTemplate,
      s.videoAttrs,
      currentVideo,
      this.onVideoClick,
      this.onLoadedMetadata,
      (currentVideo.options ? this.onVideoEnded : null),
      (currentVideo.options ? this.onTimeUpdate : null)
    );

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
  }


  // Internal helper functions
  forwardVideo() {
    let videoTpl = this.state.videoTemplate;
    (videoTpl.currentTime++ > videoTpl.duration)
      ? videoTpl.currentTime = videoTpl.duration
      : videoTpl.currentTime++;
  }

  backwardVideo() {
    let videoTpl = this.state.videoTemplate;
    (videoTpl.currentTime-- < 0)
      ? videoTpl.currentTime = 0
      : videoTpl.currentTime--;
  }

  togglePlay() {
    let videoTpl = this.state.videoTemplate;
    videoTpl.paused ? videoTpl.play() : videoTpl.pause();
    this.changeButtonState('play');
  }

  toggleMute() {
    let videoTpl = this.state.videoTemplate;
    videoTpl.muted = !videoTpl.muted;
    this.changeButtonState('mute');
  }

  changeVolume(value) {
    let videoTpl = this.state.videoTemplate;
    videoTpl.volume = (value > 100) ? 1 : (value < 0) ? 0 : value/100;
    videoTpl.muted = (value <= 0) ? true : false;
    this.changeButtonState('mute');
  }

  changeButtonState(type) {
    let ivid = this.state.baseTemplate;
    let videoTpl = this.state.videoTemplate;
    let controls = this.state.controls;

    switch (type) {
      case 'play': 
        controls.playButton.setAttribute('data-state', (videoTpl.paused || videoTpl.ended)
          ? 'play_arrow'
          : 'pause'
        );
        break;

      case 'mute': 
        controls.volume.volumeSlider.setAttribute('value', videoTpl.volume*100);
        controls.volume.volumeButton.setAttribute('data-state', videoTpl.muted
          ? 'volume_off'
          : (videoTpl.volume >= 0.5)
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