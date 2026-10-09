export const CATEGORY_OPTIONS_QUERY = `
  query CategoryOptions(
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

export const CATEGORIES_QUERY = `
  query Categories {
    categories {
      id
      name
      description
    }
  }
`;

export const ADMIN_CREATE_CATEGORY_MUTATION = `mutation CreateCategory(
          $input: CreateCategoryInput!
        ) {
          createCategory(input: $input) {
            id
            name
            description
          }
        }
        `


export const ADMIN_UPDATE_CATEGORY_MUTATION = `
    mutation UpdateCategory(
            $input: UpdateCategoryInput!
            ) {
            updateCategory(input: $input) {
                id
                name
                description
            }
            }
            `

export const ADMIN_DELETE_CATEGORY_MUTATION = `
    mutation DeleteCategory(
          $id: ID!
        ) {
          deleteCategory(id: $id)
        }
        `
