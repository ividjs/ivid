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
import { toggleFullScreen } from './helpers/fullscreen';
import { setupBaseTemplate } from './templates/base';
import { setupVideoTemplate, renderVideoTemplate} from './templates/video';
import { setupChoicesTemplate, renderChoicesTemplate } from './templates/choices';

class Ivid extends HTMLElement {
  
  static get observedAttributes() {
    return ['srcmap', 'current'];
  }

  constructor() {
    super();

    let initState = this.setup();

    Object.defineProperties(this, {
      state: {
        value: initState,
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
      onVideoEnded: {
        value: () => {
          let s = this.state;
          if(!s.next) return;

          this.setAttribute('current', s.next);
          if(s.videoAttrs.controls) s.videoTemplate.controls = true;
          s.choicesTemplate.classList.add('hidden');
        }
      },
      onVideoClick: {
        value: () => {
          let video = this.state.videoTemplate;
          video.paused ? video.play() : video.pause();
        }
      },
      onChoiceSelected: {
        value: (choiceUid) => {
          this.setAttribute('next', choiceUid);
          this.state.next = choiceUid;
        }
      },
      onTimeUpdate: {
        value: () => {
          let s = this.state;
          let timeout = s.srcmap[s.current].options.timeout;
          let countdown = (timeout ? timeout : 10)
          let videoTpl = s.videoTemplate;
        
          if (videoTpl.duration - videoTpl.currentTime <= countdown) {
            videoTpl.ontimeupdate = null;
            if(s.videoAttrs.controls) videoTpl.controls = false;
            s.choicesTemplate.classList.remove('hidden');
          }
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
    let current = this.getAttribute('current');
    let next = this.getAttribute('next') || '';

    // HTMLElements - IVID skeleton
    let baseTemplate = setupBaseTemplate();
    let choicesTemplate = setupChoicesTemplate();
    let videoTemplate = setupVideoTemplate(this.firstElementChild);

    // Renders the component skeleton
    this.innerHTML = '';
    baseTemplate.appendChild(videoTemplate);
    baseTemplate.appendChild(choicesTemplate);
    this.appendChild(baseTemplate);

    if (!current) {
      current = Object.keys(srcmap)[0];
      this.setAttribute('current', current);
    }

    return {
      videoAttrs,
      srcmap,
      current,
      next,
      baseTemplate,
      videoTemplate,
      choicesTemplate,
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
      (currentVideo.options ? this.onVideoEnded : null),
      (currentVideo.options ? this.onTimeUpdate : null)
    );
  }
}

customElements.define('i-video', Ivid);