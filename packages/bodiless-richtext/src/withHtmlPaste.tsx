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

import { Transforms } from 'slate';
import { ReactEditor } from 'slate-react';
import { jsx } from 'slate-hyperscript';
import { getDeserializers } from './RichTextItemGetters';
import type { RichTextComponents } from './Type';


export const deserialize = (element: HTMLElement, deserializers: Deserializer[]) => {
  if (element.nodeType === 3) {
    return element.textContent
  } else if (element.nodeType !== 1) {
    return null;
  }

  let parent = element;

  const children = Array.from(parent.childNodes)
    .map((element$: HTMLElement) => deserialize(element$, deserializers))
    .flat()

  if (element.nodeName === 'BODY') {
    return jsx('fragment', {}, children)
  }

  const deserializer = deserializers.find(deserializer => deserializer.htmlElementMatcher(element));
  if (deserializer) {
    return jsx('element', deserializer.htmlElementToNodeMapper(element), children);
  }
  
  return children
}

const withHtmlPaste = (components: RichTextComponents) => (editor: ReactEditor) => {
  const { insertData } = editor;

  const deserializers = getDeserializers(components);
  
  editor.insertData = (data: DataTransfer) => {
    const html = data.getData('text/html')

    if (html) {
      const parsed = new DOMParser().parseFromString(html, 'text/html');
      const fragment = deserialize(parsed.body, deserializers);
      Transforms.insertFragment(editor, fragment);
      return;
    }

    insertData(data);
  }

  return editor;
}

export default withHtmlPaste;
