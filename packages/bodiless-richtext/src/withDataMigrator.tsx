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

const removeLeaves = nodes => {
  if (!nodes) {
    return [];
  }
  const cleanedNodes = nodes.reduce((acc, node) => {
    if (node.leaves) {
      // we don't need the node itself, as we exepct it to be a text node
      return [
        ...acc,
        ...node.leaves.map((leave) => ({
          ...leave,
          object: 'text',
        })),
      ];
    } else {
      const cleanedNode = node.nodes
        ? {
            ...node,
            nodes: removeLeaves(node.nodes),
          }
        : node;
      return [...acc, cleanedNode];
    }
  }, []);

  return cleanedNodes;
};

const migrateTextNode = (oldNode) => {
  const marks = oldNode.marks !== undefined ? oldNode.marks.reduce(
    (acc, mark) => ({
      ...acc,
      [mark.type]: !isEmpty(mark.data) ? mark.data : true,
    }),
    {}
  ) : {};
  return {
    text: oldNode.text,
    ...(marks ? marks : {}),
  };
};

const migrateElementNode = (node) => {
  const children = node.nodes.map(migrateNode);
  return {
    data: node.data ? node.data : {},
    type: node.type,
    children: children ? children : [],
  };
};
const migrateNode = (oldNode) => {
  if (oldNode.object === 'text') {
    return migrateTextNode(oldNode);
  } else {
    return migrateElementNode(oldNode);
  }
};

const withDataMigrator = (Component: any) => (
  ({ value, ...rest }: any) => {
    let newValue = value;
    if (value.document !== undefined) {
      const nodes = removeLeaves(value.document.nodes);
      newValue = nodes.map(migrateNode) || [];
    }
    const props = {
      ...rest,
      value: newValue,
    };

    return <Component {...props} />;
  }
);

export default withDataMigrator;
