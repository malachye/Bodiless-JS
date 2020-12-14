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

const {
  deserializeHtml,
  createLinkDeserializer,
  createHeader2Deserializer,
} = require('@bodiless/richtext/lib/serializers');

const inputHtml = `
 <div>
   <p>some test text</p>
   <a href="/testhref">TestHref</a>
   <p>additional text</p>
 </div>
`;

const deserializers = [
  createLinkDeserializer(),
  createHeader2Deserializer(),
];

const { JSDOM } = require('jsdom');
DOMParser = (new JSDOM()).window.DOMParser;
const domParser = new DOMParser();

const RTEData = deserializeHtml(inputHtml, deserializers, domParser);
require('fs').writeFileSync('RTE.json', JSON.stringify(RTEData, null, 2));
