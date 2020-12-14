/**
 * Copyright © 2020 Johnson & Johnson
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { jsx } from 'slate-hyperscript';
import type { Node as SlateNode } from 'slate';

type Element = HTMLElement;

type HTMLElementMatch = (element: Element) => boolean;
type HTMLElementMap = (element: Element) => object;
enum TagName {
  Element = 'element',
  Text = 'text',
  Fragment = 'fragment',
}

type Deserializer = {
  match: HTMLElementMatch,
  map: HTMLElementMap,
  tagName: TagName,
};

type DeserializeElementParams = {
  element: Element,
  deserializers: Deserializer[],
};
type DeserializeElement = (params: DeserializeElementParams) => SlateNode[];
type Deserializers = {
  [key: string]: Deserializer,
};

const NODE_TEXT_NODE = 3;
const NODE_ELEMENT_NODE = 1;

// @ts-ignore todo: resolve types
const deserializeElement: DeserializeElement = ({
  element,
  deserializers,
}) => {
  if (element.nodeType === NODE_TEXT_NODE) return element.textContent;
  if (element.nodeType !== NODE_ELEMENT_NODE) return [];

  const children = Array.from(element.childNodes)
    .map((element$: ChildNode) => deserializeElement({
      element: element$ as Element,
      deserializers,
    }))
    .flat();

  if (element.nodeName === 'BODY') {
    return jsx(TagName.Fragment, {}, children);
  }

  const elementDeserializer = deserializers.find(
    deserializer$ => deserializer$.tagName === TagName.Element && deserializer$.match(element),
  );
  if (elementDeserializer) {
    const attrs = elementDeserializer.map(element);
    return jsx(TagName.Element, attrs, children);
  }

  const textDeserializer = deserializers.find(
    deserializer$ => deserializer$.tagName === TagName.Text && deserializer$.match(element),
  );
  if (textDeserializer) {
    return children.map(child => jsx(TagName.Text, textDeserializer.map(element), child));
  }

  return children;
};

const deserializeHtml = (
  html: string,
  deserializers: Deserializers,
  domParser?: DOMParser,
) => {
  const domParser$ = domParser || new DOMParser();
  const parsed = domParser$.parseFromString(html, 'text/html');
  return deserializeElement({
    element: parsed.body,
    deserializers: Object.values(deserializers),
  });
};

type CreateDeserializerSettings = {
  nodeName: string,
  tagName: TagName,
};

const createDeserializer = ({
  nodeName,
  tagName,
}: CreateDeserializerSettings) => ({
  match: (element: Element) => element.nodeName === nodeName,
  map: () => ({ type: nodeName }),
  tagName,
});

const createBoldDeserializer = () => ({
  ...createDeserializer({
    nodeName: 'B',
    tagName: TagName.Text,
  }),
  map: () => ({ Bold: true }),
});

const createItalicDeserializer = () => ({
  ...createDeserializer({
    nodeName: 'I',
    tagName: TagName.Text,
  }),
  map: () => ({ Italic: true }),
});

const createLinkDeserializer = () => ({
  ...createDeserializer({
    nodeName: 'A',
    tagName: TagName.Element,
  }),
  map: (element: Element) => ({
    type: 'Link',
    data: { slatenode: { href: element.getAttribute('href') } },
  }),
});

const createStrikeDeserializer = () => ({
  ...createDeserializer({
    nodeName: 'STRIKE',
    tagName: TagName.Text,
  }),
  map: () => ({ StrikeThrough: true }),
});

const createHeader1Deserializer = () => ({
  ...createDeserializer({
    nodeName: 'H1',
    tagName: TagName.Element,
  }),
});

const createHeader2Deserializer = () => ({
  ...createDeserializer({
    nodeName: 'H2',
    tagName: TagName.Element,
  }),
});

const createHeader3Deserializer = () => ({
  ...createDeserializer({
    nodeName: 'H3',
    tagName: TagName.Element,
  }),
});

const createDefaultDeserializers = () => ({
  Bold: createBoldDeserializer(),
  Italic: createItalicDeserializer(),
  Link: createLinkDeserializer(),
  StrikeThrough: createStrikeDeserializer(),
  Header1: createHeader1Deserializer(),
  Header2: createHeader2Deserializer(),
  Header3: createHeader3Deserializer(),
});

export {
  deserializeElement,
  deserializeHtml,
  createDeserializer,
  createBoldDeserializer,
  createItalicDeserializer,
  createLinkDeserializer,
  createStrikeDeserializer,
  createHeader1Deserializer,
  createHeader2Deserializer,
  createHeader3Deserializer,
  createDefaultDeserializers,
};

export type {
  HTMLElementMatch,
  HTMLElementMap,
  Deserializer,
};
