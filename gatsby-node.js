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
      value: 'pages', // Set to a single value to simplify demo of bug.
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
    try {
      const dataBasePath = ['.', 'src', 'data'];
      const slug = node.relativePath;
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
