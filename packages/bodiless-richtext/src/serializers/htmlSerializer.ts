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

type HTMLElementMatcher = (element: HTMLElement) => boolean;
type HTMLElementToSlateNodeMapper = (element: HTMLElement) => object;

type Deserializer = {
  htmlElementMatcher: HTMLElementMatcher,
  htmlElementToNodeMapper: HTMLElementToSlateNodeMapper,
};

const deserializeElement = (
  element: HTMLElement,
  deserializers: Deserializer[],
) => {
  if (element.nodeType === 3) {
    return element.textContent
  } else if (element.nodeType !== 1) {
    return null;
  }

  let parent = element;

  const children = Array.from(parent.childNodes)
    .map((element$: HTMLElement) => deserializeElement(element$, deserializers))
    .flat();

  if (element.nodeName === 'BODY') {
    return jsx('fragment', {}, children);
  }

  const deserializer = deserializers.find(deserializer => deserializer.htmlElementMatcher(element));
  if (deserializer) {
    return jsx('element', deserializer.htmlElementToNodeMapper(element), children);
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
  htmlElementMatcher: (element: HTMLElement) => element.nodeName === 'A',
  htmlElementToNodeMapper: (element: HTMLElement) => ({
    type: 'Link',
    data: { slatenode: { href: element.getAttribute('href') } },
  }),
});

const createHeader2Deserializer = () => ({
  htmlElementMatcher: (element: HTMLElement) => element.nodeName === 'H2',
  htmlElementToNodeMapper: () => ({ type: 'H2' }),
});

export {
  deserializeElement,
  deserializeHtml,
  createLinkDeserializer,
  createHeader2Deserializer,
};
export type {
  HTMLElementMatcher,
  HTMLElementToSlateNodeMapper,
  Deserializer,
};
