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

import React from 'react';

type Props = {
  Component: React.ComponentType<any>,
};


type HTMLElementMapper = (element: HTMLElement) => boolean;
type HTMLElementToSlateNodeMapper = (element: HTMLElement) => object;

type Deserializer = {
  htmlElementMapper: HTMLElementMapper,
  htmlElementToNode: HTMLElementToSlateNodeMapper,
};

const createDeserializerPlugin = ({
  Component,
}: Props) => {
  const plugin: Deserializer = {
    htmlElementMapper: Component.htmlElement,
    htmlElementToNode: Component.htmlElementToNode,
  };
  return plugin;
};

export { createDeserializerPlugin };
export type {
  HTMLElementMapper,
  HTMLElementToSlateNodeMapper,
};
