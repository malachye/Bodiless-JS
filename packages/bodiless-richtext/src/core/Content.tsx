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
import { Editable, DefaultElement, DefaultLeaf } from 'slate-react';
import { useSlateContext } from './SlateEditorContext';
import type { EditorContext } from '../Type';

type EditableProps = EditorContext['editorProps'];

const withWrapper = WrapperComponent => Component => ({children, ...rest}) => (
  <WrapperComponent {...rest}>
    <Component>{children}</Component>
  </WrapperComponent>
)


const renderLeaf = (props) => {
  const { leaf } = props;
  const editorContext = useSlateContext();
  const plugins = editorContext?.editorProps!.plugins;
  let renderLeaf$ = DefaultLeaf;
  plugins.forEach(plugin => {
    if (plugin.hasOwnProperty('renderLeaf') && leaf[plugin.type]) {
      renderLeaf$ = withWrapper(plugin.renderLeaf)(renderLeaf$);
    }
  });
  return renderLeaf$(props);
}

const renderElement = (props) => {
  const { element } = props;
  const editorContext = useSlateContext();
  const plugins = editorContext?.editorProps!.plugins;
  let renderElement$ = DefaultElement;
  plugins.forEach(plugin => {
    if (plugin.hasOwnProperty('renderElement') && element.type === plugin.type) {
      renderElement$ = plugin.renderElement;
    }
  });
  return renderElement$(props);
}

const Content = (props: EditableProps) => {
  const editorContext = useSlateContext();
  return (
    <Editable
      {...props}
      { ...editorContext!.editorProps}
      renderLeaf={renderLeaf}
      renderElement={renderElement}
    />
  );
};

export default Content;
