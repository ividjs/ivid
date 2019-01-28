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
 */
const setupVideoTemplate = (videoTpl) => {
  if (!videoTpl) videoTpl = document.createElement('video');
  videoTpl.classList.add('ivid__video');
  return videoTpl;
}

/**
 * @param {HTMLElement} videoTpl 
 * @param {Object} videoAttrs
 * @param {Object} videoItem 
 * @param {Function} videoClickCallback 
 * @param {Function} loadedMetadataCallback
 * @param {Function|null} videoEndCallback 
 * @param {Function|null} timeUpdateCallback 
 */
const renderVideoTemplate = (
  videoTpl, 
  videoAttrs, 
  videoItem, 
  videoClickCallback, 
  loadedMetadataCallback, 
  videoEndCallback, 
  timeUpdateCallback
) => {

  videoTpl.id = videoItem.uid;
  videoTpl.src = videoItem.src;
  if(videoAttrs.autoplay) videoTpl.autoplay = true;
  if(videoAttrs.muted) videoTpl.muted = true;
  if(videoAttrs.playsinline) videoTpl.playsinline = true;
  if(videoAttrs.poster) videoTpl.poster = videoAttrs.poster;
  if(videoAttrs.preload) videoTpl.preload = videoAttrs.preload;

  videoTpl.ontouchstart = (e) => videoClickCallback(e);
  videoTpl.onclick = (e) => videoClickCallback(e);
  videoTpl.onloadedmetadata = () => loadedMetadataCallback();
  if(timeUpdateCallback) videoTpl.ontimeupdate = () => timeUpdateCallback();
  if(videoEndCallback) videoTpl.onended = () => videoEndCallback();
}


export {
  setupVideoTemplate,
  renderVideoTemplate
};