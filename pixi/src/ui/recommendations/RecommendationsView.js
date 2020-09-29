// Copyright 2020 The AMPHTML Authors
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import i18n from '../I18n.js';
import RecommendationItem from './RecommendationItem.js';

export default class RecommendationsView {
  constructor(doc) {
    this.container = doc.getElementById('recommendations');

    this.filter = this.container.querySelector(
      '.ap-o-pixi-recommendations-filter'
    );
    this.pill = this.filter.querySelector('.ap-a-pill');

    this.recommendation = this.container.querySelector(
      '.ap-m-pixi-recommendations-item'
    );
    this.tag = this.recommendation.querySelector('span');
  }

  resetView() {
    this.container.classList.add('pristine');
    const items = this.container.querySelectorAll(
      '.ap-m-pixi-recommendations-item'
    );
    for (let i = 1; i < items.length; i++) {
      this.container.removeChild(items[i]);
    }

    const length = this.filter.children.length;
    for (let i = 1; i < length; i++) {
      this.filter.removeChild(this.filter.lastChild);
    }
  }

  setIssueUrl(url) {
    this.issueUrl = url;
  }

  render(recommendationList, pageUrl, metricUis) {
    this.container.classList.remove('pristine');
    const recommendations = i18n.getSortedRecommendations(recommendationList);
    const tagIdCounts = {};

    this.recommendationItems = [];
    this.filterPills = [];

    for (const [i, content] of recommendations.entries()) {
      const recommendationItem = new RecommendationItem(
        content,
        pageUrl,
        this.recommendation.cloneNode(true)
      );

      const previousRecommendation = this.recommendationItems[i - 1];
      if (previousRecommendation) {
        previousRecommendation.next = recommendationItem;
      }

      if (i == 0 || !content.body) {
        recommendationItem.expanded = true;
      }

      // Keep track of the counts for each tag to be able to show recommendation
      // count per CWV
      for (const tagId of content.tags) {
        const count = tagIdCounts[tagId] || 0;
        tagIdCounts[tagId] = count + 1;
      }

      this.recommendationItems.push(recommendationItem);
      this.container.appendChild(recommendationItem.element);
    }

    for (const tagId of Object.keys(tagIdCounts)) {
      const pill = this.pill.cloneNode(true);
      pill.textContent = i18n.getText(`tags.${tagId}`);
      pill.id = `filter-pill-${tagId}`;
      pill.className = 'ap-a-pill';
      pill.setAttribute('aria-pressed', 'false');

      pill.addEventListener('click', () => {
        this.toggleFilter(tagId);
      });

      this.filterPills.push(pill);
      this.filter.appendChild(pill);
    }

    for (const key of Object.keys(metricUis)) {
      const metricUi = metricUis[key];
      const metricToUse = metricUi.metric === 'tbt' ? 'fid' : metricUi.metric;
      const count = tagIdCounts[metricToUse];
      metricUi.setRecommendationStatus(count, this.issueUrl);
    }

    this.pill.classList.add('filtered');
    this.pill.addEventListener('click', () => {
      this.resetFilter();
    });
  }

  resetFilter() {
    this.pill.classList.add('filtered');
    pill.setAttribute('aria-pressed', 'true');
    this.container.className = this.container.className.split(' ')[0];

    for (const pill of this.filterPills) {
      pill.classList.remove('filtered');
      pill.setAttribute('aria-pressed', 'false');
      for (const recommendation of this.recommendationItems) {
        recommendation.hidden = false;
      }
    }
  }

  toggleFilter(tagId) {
    this.container.classList.toggle(tagId);
    this.pill.classList.remove('filtered');
    this.pill.setAttribute('aria-pressed', 'false');
    const pill = this.container.querySelector(`#filter-pill-${tagId}`);
    const isFiltered = pill.classList.toggle('filtered');
    pill.setAttribute('aria-pressed', isFiltered);

    const activeFilter = this.container.className.split(' ');
    if (activeFilter.length == 1) {
      this.resetFilter();
      return;
    }

    for (const recommendation of this.recommendationItems) {
      const matchingTags = activeFilter.filter((value) => {
        return recommendation.classList.contains(value);
      });

      recommendation.hidden = !matchingTags.length;
    }
  }
}
