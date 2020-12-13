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

type HTMLElementMatch = (element: HTMLElement) => boolean;
type HTMLElementMap = (element: HTMLElement) => object;

type Deserializer = {
  match: HTMLElementMatch,
  map: HTMLElementMap,
};

const deserializeElement = (
  element: HTMLElement,
  deserializers: Deserializer[],
) => {
  if (element.nodeType === Node.TEXT_NODE) return element.textContent;
  if (element.nodeType !== Node.ELEMENT_NODE) return null;

  const parent = element;

  const children = Array.from(parent.childNodes)
    .map((element$: HTMLElement) => deserializeElement(element$, deserializers))
    .flat();

  if (element.nodeName === 'BODY') {
    return jsx('fragment', {}, children);
  }

  const deserializer = deserializers.find(deserializer$ => deserializer$.match(element));
  if (deserializer) {
    return jsx('element', deserializer.map(element), children);
  }

  return children;
};

const deserializeHtml = (
  html: string,
  deserializers: Deserializer[],
) => {
  const parsed = new DOMParser().parseFromString(html, 'text/html');
  return deserializeElement(parsed.body, deserializers);
};

const createLinkDeserializer = () => ({
  match: (element: HTMLElement) => element.nodeName === 'A',
  map: (element: HTMLElement) => ({
    type: 'Link',
    data: { slatenode: { href: element.getAttribute('href') } },
  }),
});

const createHeader2Deserializer = () => ({
  match: (element: HTMLElement) => element.nodeName === 'H2',
  map: () => ({ type: 'H2' }),
});

export {
  deserializeElement,
  deserializeHtml,
  createLinkDeserializer,
  createHeader2Deserializer,
};
export type {
  HTMLElementMatch,
  HTMLElementMap,
  Deserializer,
};
