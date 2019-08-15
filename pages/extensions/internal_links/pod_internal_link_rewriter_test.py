"""Tests for the source code exporter."""

import unittest
import sys
import os
from grow.common.urls import Url
from grow.cache.object_cache import ObjectCache

sys.path.extend([os.path.join(os.path.dirname(__file__), '.')])

from pod_internal_link_rewriter import PodInternalLinkRewriter


class PodInternalLinkRewriterTestCase(unittest.TestCase):

  def test_a_href_relative(self):
    link_map = {
      '/content/test/folder1/page.md': '/test/folder_1/page1.html',
      '/content/test/folder2/page2.md': '/test/folder_2/page2.html',
    }
    doc = MockPod(link_map).get_doc('/content/test/folder1/page.md')
    content = '<a href="../folder2/page2.md">test</a>'

    link_rewriter = PodInternalLinkRewriter(doc, ObjectCache())
    result = link_rewriter.rewrite_pod_internal_links(content)

    self.assertEquals('<a href="/test/folder_2/page2.html">test</a>', result)

  def test_a_href_pod_path(self):
    link_map = {
      '/content/test/folder1/page.md': '/test/folder_1/page1.html',
      '/content/test/folder2/page2.md': '/test/folder_2/page2.html',
    }
    doc = MockPod(link_map).get_doc('/content/test/folder1/page.md')
    content = '<a href="/content/test/folder2/page2.md">test</a>'

    link_rewriter = PodInternalLinkRewriter(doc, ObjectCache())
    result = link_rewriter.rewrite_pod_internal_links(content)

    self.assertEquals('<a href="/test/folder_2/page2.html">test</a>', result)


  def test_a_href_none_existing(self):
    link_map = {
      '/content/test/folder1/page.md': '/test/folder_1/page1.html',
    }
    doc = MockPod(link_map).get_doc('/content/test/folder1/page.md')
    content = '<a href="../folder2/page2.md">test</a>'

    link_rewriter = PodInternalLinkRewriter(doc, ObjectCache())
    result = link_rewriter.rewrite_pod_internal_links(content)

    self.assertEquals(content, result)

  def test_multiple_href_none_existing_with_anchors(self):
    link_map = {
      '/content/test/folder1/page.md': '/test/folder_1/page1.html',
    }
    doc = MockPod(link_map).get_doc('/content/test/folder1/page.md')
    # two times the same url and different anchor to test possible cache problems
    content = '<a href="../folder2/page2.md#test">test</a><br>' \
              '<a href="../folder2/page2.md#other">test2</a>'

    link_rewriter = PodInternalLinkRewriter(doc, ObjectCache())
    result = link_rewriter.rewrite_pod_internal_links(content)

    self.assertEquals(content, result)

  def test_a_href_with_protocol(self):
    link_map = {
      '/content/test/folder1/page.md': '/test/folder_1/page1.html',
    }
    doc = MockPod(link_map).get_doc('/content/test/folder1/page.md')
    content = '<a href="http://amp.dev/test/folder2/page2.md">test</a>'

    link_rewriter = PodInternalLinkRewriter(doc, ObjectCache())
    result = link_rewriter.rewrite_pod_internal_links(content)

    self.assertEquals(content, result)

  def test_a_href_relative_with_anchor(self):
    link_map = {
      '/content/test/folder1/page.md': '/test/folder_1/page1.html',
      '/content/test/folder2/page2.md': '/test/folder_2/page2.html',
    }
    doc = MockPod(link_map).get_doc('/content/test/folder1/page.md')
    # two times the same url and different anchor to test possible cache problems
    content = '<a href="../folder2/page2.md#test">test</a><br>' \
              '<a href="../folder2/page2.md#other">test2</a>'

    link_rewriter = PodInternalLinkRewriter(doc, ObjectCache())
    result = link_rewriter.rewrite_pod_internal_links(content)

    self.assertEquals('<a href="/test/folder_2/page2.html#test">test</a><br>' \
                      '<a href="/test/folder_2/page2.html#other">test2</a>', result)

  def test_a_href_relative_with_params(self):
    link_map = {
      '/content/test/folder1/page.md': '/test/folder_1/page1.html',
      '/content/test/folder2/page2.md': '/test/folder_2/page2.html',
    }
    doc = MockPod(link_map).get_doc('/content/test/folder1/page.md')
    content = '<a href="../folder2/page2.md?format=ads">test</a>'

    link_rewriter = PodInternalLinkRewriter(doc, ObjectCache())
    result = link_rewriter.rewrite_pod_internal_links(content)

    self.assertEquals('<a href="/test/folder_2/page2.html?format=ads">test</a>', result)

  def test_a_href_relative_with_params_and_anchor(self):
    link_map = {
      '/content/test/folder1/page.md': '/test/folder_1/page1.html',
      '/content/test/folder2/page2.md': '/test/folder_2/page2.html',
    }
    doc = MockPod(link_map).get_doc('/content/test/folder1/page.md')
    content = '<a href="../folder2/page2.md?format=ads#test">test</a>'

    link_rewriter = PodInternalLinkRewriter(doc, ObjectCache())
    result = link_rewriter.rewrite_pod_internal_links(content)

    self.assertEquals('<a href="/test/folder_2/page2.html?format=ads#test">test</a>', result)

  def test_multiple_relative_href(self):
    link_map = {
      '/content/test/test.md': '/test/test.html',
      '/content/test/folder1/page.md': '/test/folder_1/page1.html',
      '/content/test/folder2/page2.md': '/test/folder_2/page2.html',
      '/content/test/page3.md': '/test/page3.html',
      '/content/page4.md': '/page4.html',
    }
    doc = MockPod(link_map).get_doc('/content/test/test.md')
    content = '<p><a  class="link" href="folder2/page2.md">test</a><br>' \
              '<a href="./page3.md" class="link">page3</a><br>' \
              '<a href="../page4.md">page4</a><br>' \
              '<a href = "./folder1/page.md">page</a></p>'

    link_rewriter = PodInternalLinkRewriter(doc, ObjectCache())
    result = link_rewriter.rewrite_pod_internal_links(content)

    self.assertEquals('<p><a  class="link" href="/test/folder_2/page2.html">test</a><br>' \
                      '<a href="/test/page3.html" class="link">page3</a><br>' \
                      '<a href="/page4.html">page4</a><br>' \
                      '<a href = "/test/folder_1/page1.html">page</a></p>', result)


class MockPod:

  def __init__(self, link_map):
    self.link_map = link_map

  def get_doc(self, path, locale=None):
    site_path = self.link_map.get(path)
    return MockDoc(self, path, site_path)


class MockDoc:

  def __init__(self, pod, pod_path, site_path):
    self.pod = pod
    self.pod_path = pod_path
    self.url = None
    if site_path:
      self.url = Url(site_path)
    self.locale = None

  @property
  def exists(self):
    if self.url:
      return True
    return False

