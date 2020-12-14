/**
 * Copyright 2018 The AMP HTML Authors. All Rights Reserved.
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

const {pagePath} = require('@lib/utils/project');
const {setMaxAge} = require('../utils/cacheHelpers.js');
const AmpOptimizer = require('@ampproject/toolbox-optimizer');
const {readFileSync} = require('fs');
const {join} = require('path');
const FourOhFour = readFileSync(join(pagePath(), '404.html'), 'utf-8');

const optimizer = AmpOptimizer.create();

// eslint-disable-next-line no-unused-vars
module.exports = (req, res, next) => {
  setMaxAge(res, 60 * 10); // ten minutes
  if (req.headers.accept && req.headers.accept.includes('text/html')) {
    optimizer.transformHtml(FourOhFour).then((optimized) => {
      res.status(404).send(optimized);
    });
  } else {
    res.status(404).send('404').end();
  }
};
