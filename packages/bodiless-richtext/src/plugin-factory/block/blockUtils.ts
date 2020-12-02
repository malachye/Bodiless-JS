/**
 * Copyright © 2019 Johnson & Johnson
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

import { Editor, Transforms } from 'slate';
import { DataJSON } from '../../Type';

// leveraging https://github.com/ianstormtaylor/slate/issues/3481#issuecomment-581670722
const isBlockActive = (editor: Editor, format: string) => {
  let match = false
  for (const [node, paths] of Editor.nodes(editor, {
    match: n => n.type === format,
  })) {
    if (node.type === format) match = true
    break
  }
  return !!match
}

export const hasBlock = (format: string, editor: Editor) => isBlockActive(editor, format);

export const createIsActive = (format: string) => (editor: Editor) => isBlockActive(editor, format);

const DEFAULT_NODE = 'paragraph';

export const createBlock = (blockType: string, data: DataJSON) => ({
  data,
  type: blockType,
});

export type ToggleBlockOptions = {
  editor: Editor;
  blockType: string;
};

export type createToggleBlockOptions = {
  editor: Editor,
};

export const toggleBlock = ({
  editor,
  blockType,
}: ToggleBlockOptions) => {
  const isActive = isBlockActive(editor, blockType)

  Transforms.setNodes(editor, {
    type: isActive ? DEFAULT_NODE : blockType,
  })
};

export const createToggleBlock = (blockType: string) => (
  { editor }:createToggleBlockOptions,
) => (
  toggleBlock({
    editor,
    blockType,
  })
);
