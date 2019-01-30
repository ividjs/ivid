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


const supportsProgress = () => (document.createElement('progress').max !== undefined);

const setupControlsTemplate = () => {
  let controlsTemplate = document.createElement('div');
  controlsTemplate.setAttribute('class', 'ivid__ctrls');

  let controlsWrapper = document.createElement('div');
  controlsWrapper.setAttribute('class', 'ivid__ctrls-wrapper');

  // Progress controls
  let progressWrapper = document.createElement('div');
  progressWrapper.setAttribute('class', 'ivid__ctrls-progress');

  let progressBackground = document.createElement('div');
  progressBackground.setAttribute('class', 'ivid__ctrls-progress-bg');

  let progressValue = document.createElement('span');
  progressValue.setAttribute('class', 'ivid__ctrls-progress-value');

  let progressTrackball = document.createElement('div');
  progressTrackball.setAttribute('class', 'ivid__ctrls-progress-trackball');

  let progress = {
    progressWrapper,
    progressValue,
    progressTrackball,
  }

  // ---
  let buttonsWrapper = document.createElement('div');
  buttonsWrapper.setAttribute('class', 'ivid__ctrls-buttons-wrapper');

  // Play/Pause control
  let playButton = document.createElement('button');
  playButton.setAttribute('data-state', 'pause');
  playButton.setAttribute('class', 'ivid__ctrls-button material-icons');

  // Volume controls
  let volumeWrapper = document.createElement('div');
  volumeWrapper.setAttribute('class', 'ivid__ctrls-volume-wrapper');

  let volumeButton = document.createElement('button');
  volumeButton.setAttribute('data-state', 'volume_up');
  volumeButton.setAttribute('class', 'ivid__ctrls-button material-icons');

  let volumeSlider = document.createElement('input');
  volumeSlider.setAttribute('data-state', 'close');
  volumeSlider.setAttribute('class', 'ivid__ctrls-volume');
  volumeSlider.type = 'range';
  volumeSlider.min = 0;
  volumeSlider.max = 100;
  volumeSlider.step = 1;

  let volume = {
    volumeWrapper,
    volumeButton,
    volumeSlider
  };

  let time = document.createElement('span');
  time.setAttribute('class', 'ivid_ctrls-time');
  time.innerHTML = '0:00  /  0:00';

  // ---
  let spacer = document.createElement('div');
  spacer.setAttribute('class', 'ivid__ctrls-spacer');

  // Fullscreen control
  let fullscreenButton = document.createElement('button');
  fullscreenButton.setAttribute('data-state', 'fullscreen');
  fullscreenButton.setAttribute('class', 'ivid__ctrls-button material-icons');


  // Contruct the template
  progressBackground.appendChild(progressValue);
  progressBackground.appendChild(progressTrackball);
  progressWrapper.appendChild(progressBackground);

  volumeWrapper.appendChild(volumeButton);
  volumeWrapper.appendChild(volumeSlider)

  buttonsWrapper.appendChild(playButton);
  buttonsWrapper.appendChild(volumeWrapper);
  buttonsWrapper.appendChild(time);
  buttonsWrapper.appendChild(spacer);
  buttonsWrapper.appendChild(fullscreenButton);

  controlsWrapper.appendChild(progressWrapper);
  controlsWrapper.appendChild(buttonsWrapper);

  controlsTemplate.appendChild(controlsWrapper);

  return {
    controlsTemplate,
    progress,
    playButton,
    volume,
    time,
    fullscreenButton,
  };
}

/**
 * @param {Function} progressClickCallback 
 * @param {Function} playClickCallback 
 * @param {Function} volumeClickCallback 
 * @param {Function} volumeHoverCallback 
 * @param {Function} volumeLeaveCallback 
 * @param {Function} volumeChangeCallback 
 * @param {Function} fullscreenClickCallback 
 */
 const renderControlsTemplate = (
  controls,
  progressClickCallback,
  playClickCallback,
  volumeClickCallback,
  volumeHoverCallback,
  volumeLeaveCallback,
  volumeChangeCallback,
  fullscreenClickCallback
) => {

  controls.progress.progressWrapper.ontouchstart = (e) => progressClickCallback(e);
  controls.progress.progressWrapper.onclick = (e) => progressClickCallback(e);

  controls.playButton.ontouchstart = (e) => playClickCallback(e);
  controls.playButton.onclick = (e) => playClickCallback(e);

  controls.volume.volumeWrapper.onmouseover = () => volumeHoverCallback();
  controls.volume.volumeWrapper.onmouseleave = () => volumeLeaveCallback();
  controls.volume.volumeButton.ontouchstart = (e) => volumeClickCallback(e);
  controls.volume.volumeButton.onclick = (e) => volumeClickCallback(e);

  controls.volume.volumeSlider.oninput = (e) => volumeChangeCallback(e);
  controls.volume.volumeSlider.onchange = (e) => volumeChangeCallback(e);

  controls.fullscreenButton.ontouchstart = () => fullscreenClickCallback();
  controls.fullscreenButton.onclick = () => fullscreenClickCallback();
}


export { 
  setupControlsTemplate,
  renderControlsTemplate
};