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

 const setupStyle = () => {
  let style = document.createElement('style');
  style.textContent = `
    .ivid {
      background-color: black;
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      width: 100%;
      height: 100%;
    }

    .ivid__video {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      margin: auto;
      width: 100%;
      height: 100%;
    }
    
    .ivid__choice-wrapper {
      position: absolute;
      bottom: 0;
      width: 100%;
      display: flex;
      align-items: stretch;
      align-content: stretch;
      z-index: 2147483647;
    }

    .ivid__choice-button {
      width: 100%;
      height: 76px;
      color: white;
      font-size: large;
      font-weight: bold;
      border: none;
      background-color: rgba(0,0,0,0.28);
    }

    .ivid__choice-button:hover {
      font-size: larger;
      background-color: rgba(0,0,0,0.32);
    }

    .hidden {
      display: none;
    }
  `;
  return style;
}


export { setupStyle };