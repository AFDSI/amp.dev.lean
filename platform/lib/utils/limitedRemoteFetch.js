/**
 * Copyright 2020 The AMPHTML Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const fetch = require('node-fetch');
const url = require('url');
const LRU = require('lru-cache');
const config = require('@lib/config.js');

/**
 * The time in milliseconds in which HOST_RATE_LIMIT requests can
 * happen before the user needs to wait
 * @type {Number}
 */
const RATE_LIMIT_TIME_FRAME = 10 * 1000;

/**
 * The number of times a certain host can be requested in RATE_LIMIT_TIME_FRAME
 * @type {Number}
 */
const HOST_RATE_LIMIT = 10;

/**
 * The maximum count of limits that is tracked.
 * @type {Number}
 */
const MAX_LIMITS = 500;

const limits = new LRU({
  max: MAX_LIMITS,
  maxAge: RATE_LIMIT_TIME_FRAME,
});

class RemoteFetchError extends Error {
  constructor(errorCode, message) {
    super(message);
    this.errorCode = errorCode;
  }
}

class LimitedRemoteFetch {
  constructor({requestHeaders}) {
    this.requestHeaders = requestHeaders || {};
  }

  /**
   * Fetches a user-defined remote URL and returns the response,
   * verifies that the returned response is a proper HTML document
   *
   * @param  {String} urlString
   * @return {Response}
   */
  async fetchResponse(urlString) {
    if (!urlString) {
      throw new RemoteFetchError(400, 'No URL provided.');
    }

    const fetchUrl = url.parse(urlString);
    if (!fetchUrl.protocol || !fetchUrl.host) {
      throw new RemoteFetchError(400, `${fetchUrl} is not a valid URL.`);
    }

    // Verify that this URL is currently allowed to be fetched
    // and is not rate-limited
    if (this.exceedsRateLimit(fetchUrl)) {
      throw new RemoteFetchError(
        429,
        `${fetchUrl.host} has been requested too many times. ` +
          'Please wait a few seconds and then try again.'
      );
      return;
    }

    const response = await fetch(fetchUrl.href, {
      headers: {
        'Accept': 'text/html',
        'x-requested-by': 'playground',
        'User-Agent':
          'Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5X Build/MTC19V) ' +
          'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.81 Mobile ' +
          'Safari/537.36 (compatible; amp.dev/playground)',
        'Referer': 'https://amp.dev/playground',
        ...this.requestHeaders,
      },
    });

    if (!response.ok) {
      throw new RemoteFetchError(
        502,
        `Request to ${fetchUrl} could not complete successfully.`
      );
    }

    const contentType = response.headers.get('content-type');
    if (!contentType.includes('text/html')) {
      throw new RemoteFetchError(502, `${fetchUrl} is no HTML document.`);
    }

    return response;
  }

  /**
   * Fetches a user-defined remote URL and returns the response body,
   * @see fetchResponse
   *
   * @param  {String} urlString
   * @return {Response}
   */
  async fetchDocument(urlString) {
    return this.fetchResponse(urlString).text();
  }

  /**
   * Verifies that the host to a certain URL has not been called
   * more than HOST_RATE_LIMIT
   * @param  {URL} fetchUrl
   * @return {Boolean}
   */
  exceedsRateLimit(fetchUrl) {
    const host = fetchUrl.host;

    // Requests to amp.dev are not affected by rate limiting
    if (config.hostNames.has(host)) {
      return false;
    }

    const count = (limits.peek(host) || 0) + 1;
    if (count > HOST_RATE_LIMIT) {
      return true;
    }

    limits.set(host, count);
    limits.prune();
    return false;
  }
}

module.exports = LimitedRemoteFetch;
