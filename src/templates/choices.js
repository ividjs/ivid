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


const setupChoicesTemplate = () => {
  let choices = document.createElement('div');
  choices.setAttribute('class', 'ivid__choices');
  choices.setAttribute('data-state', 'hidden');
  return choices;
}

/**
 * @param {HTMLElement} choicesTpl 
 * @param {Object} videoItem 
 * @param {Function} choiceClickCallback 
 */
const renderChoicesTemplate = (choicesTpl, videoItem, choiceClickCallback) => {
  const choices = videoItem.options.choices;

  choicesTpl.innerHTML = '';
  choicesTpl.setAttribute('data-state', 'hidden');

  Object.keys(choices).map(
    (choiceUid) => {
      let button = document.createElement('button');
      
      button.setAttribute('class', 'ivid__choice-button');
      button.id = choiceUid;
      button.innerHTML = choices[choiceUid];
      button.ontouchstart = (e) => choiceClickCallback(choiceUid, e);
      button.onclick = (e) => choiceClickCallback(choiceUid, e);
      
      choicesTpl.appendChild(button);
    }
  );
}

/**
 * @param {HTMLElement} choicesTpl 
 */
const resetChoicesTemplate = (choicesTpl) => {
  choicesTpl.innerHTML = '';
  choicesTpl.setAttribute('data-state', 'hidden');
}


export {
  setupChoicesTemplate,
  renderChoicesTemplate,
  resetChoicesTemplate,
};