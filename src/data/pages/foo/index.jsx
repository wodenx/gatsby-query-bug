import React from 'react';
import { graphql } from 'gatsby';

import Layout from '../../../components/Layout';

const renderData = ({ data }) => (
  <pre>{JSON.stringify(data, null, 2)}</pre>
);

export default props => (
  <Layout>
    {renderData(props)}
  </Layout>
);

export const query = graphql`
  query($slug: String!) {
    allRawCode(filter: { fields: { slug: { eq: $slug } } }) {
      edges {
        node {
          name
          content
          fields {
            slug
          }
        }
      }
    }
  }
`;
