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

import { snakeToCamel } from './helpers/snakecamel';
import { setupStyle } from './renderers/style';
import { setupBaseTemplate } from './renderers/base';
import { setupVideoTemplate, renderVideoTemplate} from './renderers/video';
import { setupChoicesTemplate, renderChoicesTemplate } from './renderers/choices';

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
          if(!this.state.next) return;
          this.setAttribute('current', this.state.next);
          this.state.videoTemplate.setAttribute('controls', true);
          this.state.choicesTemplate.classList.add('hidden');
        }
      },
      onVideoClick: {
        value: () => {
          let video = this.state.videoTemplate;
          video.focus();
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
            videoTpl.removeAttribute('controls');
            s.choicesTemplate.classList.remove('hidden');
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
        [snakeToCamel(name)]: (name !== 'srcmap') ? newValue : JSON.parse(newValue),
      });
    }
  }

  setup() {
    let srcmap = JSON.parse(this.getAttribute('srcmap'));
    let current = this.getAttribute('current') 
    if (!current) {
      current = Object.keys(srcmap)[0];
      this.setAttribute('current', current);
    }

    let next = this.getAttribute('next') || '';

    let style = setupStyle();
    let baseTemplate = setupBaseTemplate();
    let choicesTemplate = setupChoicesTemplate();
    let videoTemplate = setupVideoTemplate(this.firstElementChild);

    this.innerHTML = '';

    this.appendChild(style);
    
    baseTemplate.appendChild(videoTemplate);
    baseTemplate.appendChild(choicesTemplate);
    this.appendChild(baseTemplate);
    
    return {
      srcmap,
      current,
      next,
      style,
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
      currentVideo,
      this.onVideoClick,
      (currentVideo.options ? this.onVideoEnded : null),
      (currentVideo.options ? this.onTimeUpdate : null)
    );
  }
}

customElements.define('i-video', Ivid);