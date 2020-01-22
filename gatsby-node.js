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

/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 *
 */
const pathUtil = require('path');
const slash = require('slash');
const fs = require('fs');

const { createFilePath } = require('gatsby-source-filesystem');

const findFilesystemNode = ({ node, getNode }) => {
  // Find the filesystem node.
  const types = ['File', 'Directory'];
  let fsNode = node;
  let whileCount = 0;

  while (
    !types.includes(fsNode.internal.type)
    && fsNode.parent
    && getNode(fsNode.parent) !== undefined
    && whileCount < 101
  ) {
    fsNode = getNode(fsNode.parent);
    whileCount += 1;

    if (whileCount > 100) {
      console.warn('Cannot find a directory node for ', fsNode);
    }
  }
  return fsNode;
};

// Adapted from create-file-path.
const createSlug = ({ node, getNode }) => {
  // Find the filesystem node
  const fsNode = findFilesystemNode({ node, getNode });
  if (!fsNode) return undefined;
  const relativePath = pathUtil.posix.relative(
    slash('pages'),
    slash(fsNode.relativePath),
  );
  const { dir, name } = pathUtil.parse(relativePath);
  const dirFragment = dir || '';
  const nameFragment = fsNode.internal.type === 'Directory' ? name : '';
  const slug = pathUtil.posix.join('/', dirFragment, nameFragment, '/');
  const finalSlug = relativePath.startsWith('..') ? `..${slug}` : slug;
  return finalSlug;
};

/**
 * Helper function to find page component.
 * @param  {...any} pathSegments Path to component directory.
 */
const findComponentPath = (...pathSegments) => {
  let componentPath;
  // Allowed component extentions are jsx, tsx and json.
  ['index.jsx', 'index.tsx', 'index.json'].some(item => {
    const path = pathUtil.resolve(...pathSegments, item);
    if (fs.existsSync(path)) {
      componentPath = path;
      return true;
    }
    return false;
  });
  return componentPath || null;
};

exports.onCreateNode = ({ node, getNode, actions }) => {
  const { createNodeField } = actions;
  if (node.internal.type === 'RawCode') {
    createNodeField({
      node,
      name: 'slug',
      value: createSlug({ node, getNode }),
    });
  }
};

const createPagesFromFS = async ({ actions, graphql, getNode }) => {
  const { createPage } = actions;

  const result = await graphql(`
    {
      allDirectory(filter: { relativePath: { regex: "/^pages/" } }) {
        edges {
          node {
            absolutePath
            relativePath
            relativeDirectory
            internal {
              type
            }
          }
        }
      }
    }
  `);
  if (result.errors) {
    console.log(result.errors);
    return;
  }
  result.data.allDirectory.edges.forEach(({ node }) => {
    const dataBasePath = ['.', 'src', 'data'];
    const slug = '/foo/'; // createSlug({ node, getNode });
    try {
      const indexPath = findComponentPath(...dataBasePath, node.relativePath);
      const pageData = {
        path: slug,
        component: indexPath,
        context: {
          slug,
        },
      };
      console.log('Creating page ', slug, pageData.path, pageData.component);
      createPage(pageData);
    } catch (exception) {
      console.warn(`Error trying to create ${pageData.path}`, exception);
    }
  });
};

exports.createPages = async ({ actions, graphql, getNode }) => {
  await createPagesFromFS({ actions, graphql, getNode });
};
