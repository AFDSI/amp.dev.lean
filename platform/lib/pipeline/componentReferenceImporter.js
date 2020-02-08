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
require('module-alias/register');

const DEFAULT_VERSION = '0.1';
const LATEST_VERSION = 'latest';
const VERSION_PATTERN = /\d.\d/;

const {GitHubImporter, DEFAULT_REPOSITORY} = require('./gitHubImporter');
const path = require('path');
const validatorRules = require('@ampproject/toolbox-validator-rules');

const ComponentReferenceDocument = require('./componentReferenceDocument.js');

const {Signale} = require('signale');

const config = require(__dirname +
  '/../../config/imports/componentReference.json');

const log = new Signale({
  'interactive': false,
  'scope': 'ComponentReferenceImporter',
});

// Where to save the documents/collection to
const DESTINATION_BASE_PATH =
  __dirname +
  '/../../../pages/content/amp-dev/documentation/components/reference';
// Names of the built-in components that need to be fetched from ...
const BUILT_INS = ['amp-img', 'amp-pixel', 'amp-layout'];

// Formats
const FORMATS = ['AMP', 'AMP4ADS', 'AMP4EMAIL'];

// ... this path
const BUILT_IN_PATH = 'builtins';
const AMPSTORY_PATH_PREFIX = 'amp-story';

class ComponentReferenceImporter {
  constructor(githubImporter = new GitHubImporter()) {
    this.githubImporter_ = githubImporter;
  }

  async import() {
    log.start('Beginning to import extension docs ...');
    this.validatorRules = await validatorRules.fetch();

    await this._importExtensions();
    log.complete('Finished importing extension docs ...');
  }

  /**
   * Collects all needed documents from across the repository that should
   * be downloaded and put into collections
   * @return {Promise}
   */
  async _importExtensions() {
    // Gives the contents of ampproject/amphtml/extensions
    let extensions = await this.githubImporter_.fetchJson('extensions');
    const imports = [];

    // As inside /extensions each component has its own folder, filter
    // down by directory
    extensions = extensions[0].filter(file => {
      if (!config.only.length) {
        return file.type === 'dir';
      }

      return file.type === 'dir' && config.only.includes(file.name);
    });

    for (const extension of extensions) {
      imports.push(this._importExtension(extension));
    }

    // Add built-in components to list to fetch them all in one go
    for (const builtIn of BUILT_INS) {
      imports.push(this._importBuiltIn(builtIn));
    }

    await Promise.all(imports);
  }

  async _importBuiltIn(name) {
    return this._createGrowDoc({
      name: name,
      version: DEFAULT_VERSION,
      versions: [DEFAULT_VERSION],
      githubPath: path.join(BUILT_IN_PATH, `${name}.md`),
    });
  }

  async _importExtension(extension) {
    extension.files = await this._listExtensionFiles(extension);

    const versions = this._getExtensionMetas(extension);
    return versions.map(version => {
      return this._createGrowDoc(version);
    });
  }

  /**
   * Fetches all paths inside an extension directory to be able to check
   * file existance before downloading without doing an extra request
   * @param  {Object}  extension
   * @return {Promise}
   */
  async _listExtensionFiles(extension) {
    const root = await this.githubImporter_.listDirectory(extension.path);
    let tree = root.map(file => {
      if (file.match(VERSION_PATTERN)) {
        return this.githubImporter_.listDirectory(file);
      }

      return Promise.resolve([file]);
    });

    tree = await Promise.all(tree);
    return tree.reduce((acc, val) => acc.concat(val), []);
  }

  _getExtensionMetas(extension) {
    let spec;
    for (const format of FORMATS) {
      spec = this.validatorRules.getExtension(format, extension.name);
      if (spec) {
        break;
      }
    }
    if (!spec) {
      log.warn('No extension meta found for:', extension.name);
      return [];
    }

    const tag =
      this.validatorRules.raw.tags.find(tag => {
        return tag.tagName.toLowerCase() == extension.name;
      }) || {};
    const script =
      this.validatorRules.raw.tags.find(script => {
        if (!script.extensionSpec || script.tagName != 'SCRIPT') {
          return false;
        }
        return extension.name == script.extensionSpec.name;
      }) || {};

    spec.version = spec.version.filter(version => {
      return version != LATEST_VERSION;
    });
    spec.version = spec.version.sort((version1, version2) => {
      return parseFloat(version1) > parseFloat(version2);
    });

    const latestVersion = spec.version[spec.version.length - 1];
    const extensionMetas = [];
    for (const version of spec.version) {
      extensionMetas.push({
        name: extension.name,
        spec: spec,
        script: script,
        tag: tag,
        version: version,
        versions: spec.version,
        githubPath: this._getGitHubPath(extension, version, latestVersion),
      });
    }

    return extensionMetas;
  }

  /**
   * Tries to find the documentation markdown file for a certain component
   * @param  {Object} extension
   * @param  {String} version
   * @param  {String} latestVersion
   * @return {String|null}
   */
  _getGitHubPath(extension, version, latestVersion) {
    let gitHubPath;
    const fileName = `${extension.name}.md`;

    if (extension.name.startsWith(AMPSTORY_PATH_PREFIX)) {
      gitHubPath = path.join(extension.path, AMPSTORY_PATH_PREFIX, fileName);
      if (extension.files.includes(gitHubPath)) {
        return gitHubPath;
      }
    }

    // Best guess: if the version equals the latest version the documentation
    // is located in the root of the extension directory
    if (version == latestVersion) {
      gitHubPath = path.join(extension.path, fileName);
      if (extension.files.includes(gitHubPath)) {
        return gitHubPath;
      }
    }

    // The documentation for other versions is most likely located in
    // its version directory
    gitHubPath = path.join(extension.path, version, fileName);
    if (extension.files.includes(gitHubPath)) {
      return gitHubPath;
    }

    // If no file can be found at the first location it means the extension
    // doesn't follow the pattern in which the latest version documented
    // is in the root of the extension
    log.warn(`No document found for ${extension.name} v${version}`);
    return null;
  }

  /**
   * The last step in the importing process: uses all data gathered before
   * (GitHub path, extension name, version) to load the actual document.
   * @param  {Object}  extension
   * @return {Promise}
   */
  async _createGrowDoc(extension) {
    if (!extension.githubPath) {
      // It's safe to return here without informing the user as non existing
      // documents had been reported before
      return;
    }

    let fileContents;
    try {
      const fetchFromMaster = config.fetchFromMaster.includes(extension.name);
      if (fetchFromMaster) {
        log.warn(`Fetching ${extension.githubPath} from master`);
      }

      fileContents = await this.githubImporter_.fetchFile(
        extension.githubPath,
        DEFAULT_REPOSITORY,
        fetchFromMaster
      );
    } catch (e) {
      log.error(`Failed to fetch ${extension.githubPath}`, e);
      return;
    }

    let fileName;
    if (extension.version) {
      fileName = `${extension.name}-v${extension.version}.md`;
    } else {
      fileName = `${extension.name}.md`;
    }

    const docPath = path.join(DESTINATION_BASE_PATH, fileName);

    try {
      const doc = new ComponentReferenceDocument(
        docPath,
        fileContents,
        extension
      );
      await doc.save(docPath);
    } catch (e) {
      log.error('Could not create doc for: ', extension.name, e);
    }
  }
}

// If not required, run directly
if (!module.parent) {
  const importer = new ComponentReferenceImporter();
  importer.import().catch(err => console.log(err));
}

module.exports = ComponentReferenceImporter;
