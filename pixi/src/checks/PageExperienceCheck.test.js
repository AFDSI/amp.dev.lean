/**
 * @jest-environment jsdom
 */

import PageExperienceCheck from './PageExperienceCheck.js';
import {dummyApiResponse} from '../../backend/constants.js';
const expectedReportData = {"coreWebVitals":{"fieldData":{"lcp":{"unit":{"name":"sec","conversion":1000},"data":{"percentile":3100,"distributions":[{"min":0,"max":2500,"proportion":0.6472574979735206},{"min":2500,"max":4000,"proportion":0.2092677654687922},{"min":4000,"proportion":0.14347473655768708}],"category":"AVERAGE"}},"fid":{"unit":{"name":"ms","conversion":1},"data":{"percentile":289,"distributions":[{"min":0,"max":100,"proportion":0.09960294951786727},{"min":100,"max":300,"proportion":0.6889393079977311},{"min":300,"proportion":0.21145774248440163}],"category":"AVERAGE"}},"cls":{"unit":{"name":"","conversion":100},"data":{"percentile":7,"distributions":[{"min":0,"max":10,"proportion":0.816381257056831},{"min":10,"max":25,"proportion":0.15609710199473087},{"min":25,"proportion":0.02752164094843808}],"category":"FAST"}}},"labData":{"lcp":{"id":"lcp","unit":{"name":"sec","conversion":1000},"data":{"id":"largest-contentful-paint","title":"Largest Contentful Paint","description":"Largest Contentful Paint marks the time at which the largest text or image is painted. [Learn More](https://web.dev/lighthouse-largest-contentful-paint/)","score":0.67,"scoreDisplayMode":"numeric","displayValue":"3.4 s","numericValue":3395.517406396801}},"fid":{"id":"fid","unit":{"name":"ms","conversion":1},"data":{"id":"interactive","title":"Time to Interactive","description":"Time to interactive is the amount of time it takes for the page to become fully interactive. [Learn more](https://web.dev/interactive/).","score":0.83,"scoreDisplayMode":"numeric","displayValue":"4.5 s","numericValue":4455.760415752422}},"cls":{"id":"cls","unit":{"name":"","conversion":100},"data":{"id":"cumulative-layout-shift","title":"Cumulative Layout Shift","description":"Cumulative Layout Shift measures the movement of visible elements within the viewport. [Learn more](https://web.dev/cls/).","score":1,"scoreDisplayMode":"numeric","displayValue":"0","details":{"items":[{"finalLayoutShiftTraceEventFound":true}],"type":"debugdata"},"numericValue":0}}}}};

beforeAll(() => {
  jest.spyOn(PageExperienceCheck.prototype, 'fetchJson').mockImplementation(() => {
    return dummyApiResponse
  });
});

describe('Page experience check', () => {
  test('create report data for url', async () => {
    const pageExperienceCheck = new PageExperienceCheck();
    const reportData = await pageExperienceCheck.run('https://example.com/');
    expect(reportData).toMatchObject(expectedReportData);
  });
});
