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

import './style.css';
import { toggleFullScreen, isFullScreen } from './helpers/fullscreen';
import { setupBaseTemplate } from './templates/base';
import { setupControlsTemplate } from './templates/controls';
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

      // IVID events
      onProgressClick: {
        value: (event) => {
          let video = this.state.videoTemplate;
          let prog = event.target;
          let pos = (event.pageX  - (prog.offsetLeft + prog.offsetParent.offsetLeft)) / prog.offsetWidth;
          video.currentTime = pos * video.duration;
        }
      },
      onPlayClick: {
        value: () => {
          this.togglePlayPause();
        }
      },
      onVolumeClick: {
        value: () => {
          let video = this.state.videoTemplate;
          this.changeVolume(video.muted ? video.volume : 0);
        }
      },
      onVolumeHover: {
        value: () => {
          let volumeSlider = this.state.controls.volumeSlider;
          volumeSlider.setAttribute('data-state', 'open');
        }
      },
      onVolumeLeave: {
        value: () => {
          let volumeSlider = this.state.controls.volumeSlider;
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
          this.togglePlayPause();
        }
      },
      onLoadedMetadata: {
        value: () => {
          let progress = this.state.controls.progress;
          let video = this.state.videoTemplate;
          progress.setAttribute('max', video.duration);
        }
      },
      onTimeUpdate: {
        value: () => {
          let s = this.state;
          let current = s.srcmap[s.current];
          let video = s.videoTemplate;

          s.controls.progress.value = video.currentTime;

          if (current.options) {
            let timeout = current.options.timeout;
            let countdown = (timeout ? timeout : 10)

            if (video.duration - video.currentTime <= countdown) {
              if(s.videoAttrs.controls) s.controls.controlsTemplate.classList.add('hidden');
              s.choicesTemplate.classList.remove('hidden');
            }
          }
        }
      },
      onVideoEnded: {
        value: () => {
          let s = this.state;
          if(!s.next) return;

          this.setAttribute('current', s.next);
          if(s.videoAttrs.controls) s.controls.controlsTemplate.classList.remove('hidden');
          s.choicesTemplate.classList.add('hidden');
        }
      },
      onChoiceSelected: {
        value: (choiceUid) => {
          this.setAttribute('next', choiceUid);
          this.state.next = choiceUid;
        }
      },
      onKeydown: {
        value: (event) => {
          if(event.keyCode === 70) toggleFullScreen();
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
    let controls = setupControlsTemplate(
      this.onProgressClick,
      this.onPlayClick,
      this.onVolumeClick,
      this.onVolumeHover,
      this.onVolumeLeave,
      this.onVolumeChange,
      this.onFullscreenClick
    );

    console.log(controls);


    // Renders the component skeleton
    this.innerHTML = '';
    baseTemplate.appendChild(videoTemplate);
    baseTemplate.appendChild(choicesTemplate);
    baseTemplate.appendChild(controls.controlsTemplate);
    this.appendChild(baseTemplate);

    return {
      videoAttrs,
      srcmap,
      next,
      current,
      baseTemplate,
      videoTemplate,
      choicesTemplate,
      controls,
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
  togglePlayPause() {
    let video = this.state.videoTemplate;
    video.paused ? video.play() : video.pause();
    this.changeButtonState('playpause');
  }

  changeVolume(value) {
    let video = this.state.videoTemplate;
    video.volume = value;
    video.muted = (value <= 0) ? true : false;
    this.changeButtonState('mute');
  }

  changeButtonState(type) {
    let video = this.state.videoTemplate;
    let controls = this.state.controls;

    switch (type) {
      case 'playpause': 
        controls.playButton.setAttribute('data-state', (video.paused || video.ended) ? 'play' : 'pause')
        break;

      case 'mute': 
        controls.volumeButton.setAttribute('data-state', video.muted ? 'unmute' : 'mute')
        break;

      case 'fullscreen': 
        controls.fullscreenButton.setAttribute('data-state', isFullScreen() ? 'exit-full' : 'go-full')
        break;
    }
  }

}

customElements.define('i-video', Ivid);