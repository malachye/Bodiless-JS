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

import React from 'react';
import { Plugin, EventHook, RenderMarkProps } from 'slate-react';
import { hasMark, createToggleMark, toggleMark } from './markUtils';

//
// External
//
import createMarkButton from './createMarkButton';

type MarkOptions = {
  keyboardKey?: string;
};

type CreateMarkPlugin = (
  Mark: React.ComponentType<RenderMarkProps>,
  markType: string,
  options: MarkOptions,
) => Plugin;

const createMarkPlugin: CreateMarkPlugin = (Mark, markType, options = {}) => {
  const plugin: Plugin = {
    renderMark: (props, editor, next) => {
      switch (props.mark.type) {
        case markType:
          return <Mark {...props} />;
        default:
          return next();
      }
    },
  };

  if (options.keyboardKey) {
    const onKeyDown: EventHook = (event, editor, next) => MarkKeyboardShortcut(
      options.keyboardKey!,
      createToggleMark(markType),
      event as KeyboardEvent,
      editor,
      next,
    );
    plugin.onKeyDown = onKeyDown;
  }

  return plugin;
};

export {
  createMarkPlugin,
  createMarkButton,
  hasMark,
  createToggleMark,
  toggleMark,
};
