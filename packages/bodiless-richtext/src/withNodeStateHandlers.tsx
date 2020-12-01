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
import { observer } from 'mobx-react-lite';
import { EditorProps } from 'slate-react';
import { Value } from 'slate';
import { useEditContext } from '@bodiless/core';
import useNodeStateHandlers from './useNodeStateHandlers';

export interface SlateEditorProps extends EditorProps {
  children?: any;
  initialValue: object;
}

type NodeStateHandlers = {
  onChange: Function; // (change: Change) => void;
  value: Value;
};

export type Props = Pick<
SlateEditorProps,
Exclude<keyof SlateEditorProps, 'value'>
>;

const withNodeStateHandlers = (Editor: React.FC<SlateEditorProps>) => (
  observer(({ value: originalValue, onChange: originalOnChange, ...rest }: Props) => {
    const { value, onChange }: NodeStateHandlers = useNodeStateHandlers({
      initialValue: originalValue,
      onChange: originalOnChange,
    });
    const { isEdit } = useEditContext();
    const finalEditorProps = {
      ...rest,
      value,
      onChange,
      readOnly: !isEdit,
    } as SlateEditorProps;

    return <Editor {...finalEditorProps} />;
  })
);

export default withNodeStateHandlers;
