import { gql } from '@apollo/client';

export const GET_ADMIN_INTERESTS = gql`
  query GetAdminInterests(
    $input: GatewayInterestPaginationInput!
  ) {
    getInterestTagsPaginated(
      input: $input
    ) {
      data {
        id
        name
        icon_url
        created_at
      }
      total
      page
      limit
      totalPages
    }
  }
`;

export const CREATE_ADMIN_INTEREST = gql`
  mutation CreateAdminInterest(
    $input: CreateInterestTagInput!
    $icon: Upload
  ) {
    createInterestTag(
      input: $input
      icon: $icon
    ) {
      id
      name
      icon_url
      created_at
    }
  }
`;

export const UPDATE_ADMIN_INTEREST = gql`
  mutation UpdateInterestTag(
    $id: ID!
    $input: UpdateInterestTagInput!
    $icon: Upload
  ) {
    updateInterestTag(
      id: $id
      input: $input
      icon: $icon
    ) {
      id
      name
      icon_url
      created_at
    }
  }
`;

export const DELETE_ADMIN_INTEREST = gql`
  mutation DeleteAdminInterest(
    $id: ID!
  ) {
    deleteInterestTag(id: $id)
  }
`;