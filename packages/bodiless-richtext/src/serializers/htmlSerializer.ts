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

type Element = HTMLElement | ChildNode;

type HTMLElementMatch = (element: Element) => boolean;
type HTMLElementMap = (element: Element) => object;
enum TagName {
  Element = 'element',
  Text = 'text',
  Fragment = 'fragment',
};

type Deserializer = {
  match: HTMLElementMatch,
  map: HTMLElementMap,
  tagName: TagName,
};

type DeserializeElementParams = {
  element: Element,
  deserializers: Deserializer[],
};
type DeserializeElement = (params: DeserializeElementParams) => SlateNode[] | null;

const deserializeElement: DeserializeElement = ({
  element,
  deserializers,
}) => {
  if (element.nodeType === Node.TEXT_NODE) return element.textContent;
  if (element.nodeType !== Node.ELEMENT_NODE) return null;

  const children = Array.from(element.childNodes)
    .map((element$: ChildNode) => deserializeElement({
      element: element$,
      deserializers: deserializers,
    }))
    .flat();

  if (element.nodeName === 'BODY') {
    return jsx(TagName.Fragment, {}, children);
  }

  const elementDeserializer = deserializers.find(
    deserializer$ => deserializer$.tagName === TagName.Element && deserializer$.match(element)
  );
  if (elementDeserializer) {
    return jsx(TagName.Element, elementDeserializer.map(element), children);
  }

  const textDeserializer = deserializers.find(
    deserializer$ => deserializer$.tagName === TagName.Text && deserializer$.match(element)
  );
  if (textDeserializer) {
    return children.map(child => jsx(TagName.Element, textDeserializer.map(element), child));
  }

  return children;
};

const deserializeHtml = (
  html: string,
  deserializers: Deserializer[],
) => {
  const parsed = new DOMParser().parseFromString(html, 'text/html');
  return deserializeElement({
    element: parsed.body,
    deserializers,
  });
};

type CreateDeserializerSettings = {
  nodeName: string,
  tagName: string,
};

const createDeserializer = ({
  nodeName,
  tagName,
}: CreateDeserializerSettings) => ({
  match: (element: Element) => element.nodeName === nodeName,
  map: () => ({ type: nodeName }),
  tagName: tagName,
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

const createHeader2Deserializer = () => ({
  ...createDeserializer({
    nodeName: 'H2',
    tagName: TagName.Element,
  }),
});

export {
  deserializeElement,
  deserializeHtml,
  createLinkDeserializer,
  createHeader2Deserializer,
  createDeserializer,
};
export type {
  HTMLElementMatch,
  HTMLElementMap,
  Deserializer,
};
