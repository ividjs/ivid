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

 
const _doubleDigits = (input) => (input > 9) ? `${input}` : `0${input}`;

/**
 * @param {Number} time 
 */
const secondsToHms = (time) => {
  let hms = '';
  let seconds = Math.floor(time);

  const hours = Math.floor(time / 3600);
  if (hours > 0) {
    seconds = (seconds - hours * 3600);
    hms += `${hours}:`;
  }

  const minutes = Math.floor(time / 60);
  if (minutes > 0) {
    seconds = (seconds - minutes * 60);
  }

  hms += `${minutes}:${_doubleDigits(seconds)}`;

  return hms;
}


export { secondsToHms };