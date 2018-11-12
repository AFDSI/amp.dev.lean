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

const { spawn, spawnSync, exec } = require('child_process');
const { Signale } = require('signale');
const stream = require('stream');
const config = require('../config.js');

const GROW_POD_PATH = '../pages';

/**
 * A wrapper class to simplify interactions with a Grow process
 * running in parallel to the JavaScript based pipeline
 */
class Grow {

  constructor() {
    this._command = '';
    this._log = new Signale({
      'interactive': true,
      'scope': 'Grow',
      'types': {
        // Just for goodliness, add custom logger as .watch is a bit off
        'running': {
          'badge': '…',
          'color': 'cyan',
          'label': 'running'
        }
      }
    });
  }

  /**
   * Handles output of the runinng Grow process
   * @param  {Buffer} data
   * @return {undefined}
   */
  _handleProcessOutput(data) {
    data = data.toString();
    this._log.running(data);
  }

  _spawn(command, args, options) {
    this._log.start('Spinning up Grow process ...');
    this._process = spawn(command, args, options);

    this._process.stdout.on('data', this._handleProcessOutput.bind(this));
    this._process.stderr.on('data', this._handleProcessOutput.bind(this));

    return this._process;
  }

  when(message) {
    let process = this._process;
    return new Promise((resolve, reject) => {
      // Listen for the specified message in the output streams
      function listen(data) {
        data = data.toString();

        if (data.indexOf(message) !== -1) {
          resolve();
          // If the message occured stop listening to the stream
          process.stdout.removeListener('data', listen);
          process.stderr.removeListener('data', listen);
        }
      }

      process.stdout.on('data', listen);
      process.stderr.on('data', listen);
    });
  }

  install() {
    let options = {
      'stdio': 'pipe',
      'cwd': GROW_POD_PATH
    };

    this._spawn('grow', ['install'], options);

    return this;
  }

  run() {
    let args = [
      'run', '--port', `${config.hosts.pages.port}`, '--no-preprocess'
    ];
    let options = {
      'stdio': 'pipe',
      'cwd': GROW_POD_PATH
    };

    this._spawn('grow', args, options);

    return this;
  }

  deploy() {
    let args = [
      'deploy', '--noconfirm'
    ];
    let options = {
      'stdio': 'pipe',
      'cwd': GROW_POD_PATH
    };

    this._spawn('grow', args, options);

    return this;
  }
}

module.exports = Grow;
