const prependFile = require('prepend-file');
const packageInfo = require('./package.json');
const filesToLicense = ['./dist/ivid.min.js', './dist/ivid.min.css'];
const license = `/**
 * ${packageInfo.name} - v${packageInfo.version}
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
`;


/**
 * Appends License notice to the top of minified files
 */
for (let file of filesToLicense) {
  prependFile(file, license, (err) => {  
    if (err) throw err;
    console.log(`${file} -> licensed!`);
  });
}
