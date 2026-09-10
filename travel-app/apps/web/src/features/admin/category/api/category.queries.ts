import { gql } from '@apollo/client';

export const ADMIN_CATEGORIES_QUERY = gql`
  query AdminCategories(
    $filter: CategoryFilterInput
  ) {
    categoryOptions(filter: $filter) {
      items {
        id
        name
        description
      }
      total
      page
      limit
      totalPages
      hasNextPage
    }
  }
`;

export const CREATE_CATEGORY_MUTATION = gql`
  mutation CreateCategory(
    $input: CreateCategoryInput!
  ) {
    createCategory(input: $input) {
      id
      name
      description
    }
  }
`;

export const UPDATE_CATEGORY_MUTATION = gql`
  mutation UpdateCategory(
    $input: UpdateCategoryInput!
  ) {
    updateCategory(input: $input) {
      id
      name
      description
    }
  }
`;

export const DELETE_CATEGORY_MUTATION = gql`
  mutation DeleteCategory(
    $id: ID!
  ) {
    deleteCategory(id: $id)
  }
`;