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

const {format} = require('util');
const config = require('../config.js');
const nodeFetch = require('node-fetch');

// Logs are hosted on cdn.ampproject.org
// TODO: replace with final URL
const LOG_HOST = `${config.hosts.platform.base}/static/files/log-messages-v%s.json`;

/**
 * Fetches and caches the runtime log.
 */
class LogProvider {
  constructor(fetch=nodeFetch) {
    this.fetch_ = fetch;
    this.cache_ = new Map();
  }

  /**
   * Returns a message object.
   *
   * @param {Object} logRequest The log request object.
   * @returns {Promise<Object>} the log object
   */
  async get(logRequest) {
    const version = logRequest.version;
    let messages = this.cache_.get(version);
    if (!messages) {
      messages = await this.fetchLogs_(version);
      this.cache_.set(version, messages);
    }
    const result = messages[logRequest.id];
    if (!result) {
      throw new Error(`Unknown message id: ${logRequest.id}`);
    }
    return result;
  }

  async fetchLogs_(version) {
    const url = format(LOG_HOST, version);
    const response = await this.fetch_(url);
    if (!response.ok) {
      throw new Error(`Request failed ${url} with status ${response.status}`);
    }
    return response.json();
  }
}

module.exports = LogProvider;
