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

import React, {
  useState,
  Fragment,
  ComponentType,
} from 'react';
import SlateEditorContext from './SlateEditorContext';
import '@material/react-material-icon/dist/material-icon.css';
import { EditorOnChange } from '../Type';

type Props = {
  initialValue: object;
} & EditorProps;

const withSlateEditor = <P extends object> (Component:ComponentType<P>) => (props:P & Props) => {
  const {
    initialValue, value, onChange, placeholder, plugins = [], ...rest
  } = props;
  // It is important to keep track of internal activeValue
  // state in case outer activeValue is not provided.
  // Value is used in plugins and buttons before Content is mounted and its activeValue is obtained.
  const [localValueState, setLocalValue] = useState<object>(
    value || initialValue
  );
  const internalOnChange: EditorOnChange = change => {
    const { value: valueFromChange } = change;
    if (typeof onChange === 'function') {
      onChange(change);
    } else if (typeof value !== 'undefined') {
      setLocalValue(valueFromChange);
    }

    return change;
  };

  const editorContextValue = {
    value: value || localValueState,
    editorProps: {
      ...rest,
      plugins,
      onChange: internalOnChange,
      value: value || localValueState,
    },
  };

  return (
    <SlateEditorContext.Provider value={editorContextValue}>
      <Component {...rest as P} />
    </SlateEditorContext.Provider>
  );
};
const SlateEditor = withSlateEditor(Fragment);

export default SlateEditor;
export { withSlateEditor };
