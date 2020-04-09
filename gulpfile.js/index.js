/**
 * Copyright 2019 The AMP HTML Authors. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';
require('module-alias/register');

const search = require('recursive-search');

// DON'T ADD GULP TASKS TO THIS FILE!
// CREATE A NEW FILE IN THIS DIRECTORY INSTEAD

// load gulp tasks from files in this directory
search.recursiveSearch(
  /.js/,
  __dirname,
  (err) => {
    if (err) throw err;
  },
  (results) => {
    console.log(results);
    results.map(require);
    results.forEach((module) => {
      Object.assign(exports, module);
    });
  }
);
