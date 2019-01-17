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
  * @param {Function} progressClickCallback 
  * @param {Function} playClickCallback 
  * @param {Function} volumeClickCallback 
  * @param {Function} volumeHoverCallback 
  * @param {Function} volumeLeaveCallback 
  * @param {Function} volumeChangeCallback 
  * @param {Function} fullscreenClickCallback 
  */
const setupControlsTemplate = (
  progressClickCallback,
  playClickCallback,
  volumeClickCallback,
  volumeHoverCallback,
  volumeLeaveCallback,
  volumeChangeCallback,
  fullscreenClickCallback
) => {

  let controlsTemplate = document.createElement('div');
  controlsTemplate.setAttribute('class', 'ivid__ctrls-wrapper');

  let progress = document.createElement('progress');
  progress.setAttribute('class', 'ivid__ctrls-progress');
  progress.onclick = (e) => progressClickCallback(e);

  let buttonsWraper = document.createElement('div');
  buttonsWraper.setAttribute('class', 'ivid__ctrls-buttons-wrapper');

  let playButton = document.createElement('button');
  playButton.setAttribute('class', 'ivid__ctrls-button ivid__ctrls-button--play');
  progress.onclick = (e) => playClickCallback(e);

  let volumeButton = document.createElement('button');
  volumeButton.setAttribute('class', 'ivid__ctrls-button ivid__ctrls-button--volume');
  progress.onmouseover = (e) => volumeHoverCallback(e);
  progress.onmouseleave = (e) => volumeLeaveCallback(e);
  progress.onclick = (e) => volumeClickCallback(e);

  let volumeSlider = document.createElement('input');
  volumeSlider.setAttribute('class', 'ivid__ctrls-volume');
  volumeSlider.type = 'range';
  volumeSlider.min = 0;
  volumeSlider.max = 100;
  volumeSlider.step = 1;
  volumeSlider.oninput = (e) => volumeChangeCallback(e);
  volumeSlider.onchange = (e) => volumeChangeCallback(e);

  let spacer = document.createElement('div');
  spacer.setAttribute('class', 'ivid__ctrls-spacer');

  let fullscreenButton = document.createElement('button');
  fullscreenButton.setAttribute('class', 'ivid__ctrls-button ivid__ctrls-button--fullscreen');
  fullscreenButton.onclick = (e) => fullscreenClickCallback(e);

  // Contruct the template
  buttonsWraper.appendChild(playButton);
  buttonsWraper.appendChild(volumeButton);
  buttonsWraper.appendChild(volumeSlider);
  buttonsWraper.appendChild(spacer);
  buttonsWraper.appendChild(fullscreenButton);

  controlsTemplate.appendChild(progress);
  controlsTemplate.appendChild(buttonsWraper);

  // An object holding the single elements of the controlsTemplate
  return controls = {
    controlsTemplate,
    progress,
    playButton,
    volumeButton,
    volumeSlider,
    fullscreenButton,
  };
}


export { setupControlsTemplate };