/**
 * Copyright 2020 The AMP HTML Authors. All Rights Reserved.
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

const config = require('@lib/config');

/**
 * Adds the desired image width to a URL as query paramter.
 * This URL gets resolved to a thumbor compatible URL
 * in platform/lib/routers/thumbor.js
 *
 * @param {String} src - the original img's src URL
 * @param {Integer} width  - the target width
 */
function imageOptimizer(src, width) {
  const imageUrl = new URL(src, config.hosts.platform.base);
  imageUrl.searchParams.set('width', width);
  return imageUrl.href;
}

module.exports = imageOptimizer;
