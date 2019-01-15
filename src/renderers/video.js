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


/**
 * @param {HTMLElement} videoTpl 
 * @param {Object} videoItem 
 * @param {Function} videoClickCallback 
 * @param {Function|null} videoEndCallback 
 * @param {Function|null} timeUpdateCallback 
 */
const renderVideoTemplate = (videoTpl, videoItem, videoClickCallback, videoEndCallback, timeUpdateCallback) => {
  videoTpl.id = videoItem.uid;
  videoTpl.setAttribute('src', videoItem.src);
  videoTpl.setAttribute('preload', 'auto');
  videoTpl.setAttribute('controls', true);
  videoTpl.setAttribute('autoplay', true);
  videoTpl.setAttribute('playsinline', true);

  videoTpl.onclick = () => videoClickCallback();
  if(timeUpdateCallback) videoTpl.ontimeupdate = () => timeUpdateCallback();
  if(videoEndCallback) videoTpl.onended = () => videoEndCallback();
}

/**
 * @param {HTMLElement} videoTpl 
 */
const setupVideoTemplate = (videoTpl) => {
  if (!videoTpl) videoTpl = document.createElement('video');
  videoTpl.classList.add("ivid__video");
  return videoTpl;
}


export {
  setupVideoTemplate,
  renderVideoTemplate
};