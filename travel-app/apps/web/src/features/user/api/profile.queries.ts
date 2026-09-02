import { gql } from "@apollo/client";

export const MY_PROFILE_QUERY = gql`
  query MyProfile {
    myProfile {
      id
      username
      display_name
      avatar_url
      cover_url
      bio
      gender
      birthday
      location
      privacy
      created_at
      updated_at
    }
  }
`;

export const UPDATE_MY_PROFILE_MUTATION = gql`
  mutation UpdateProfile(
    $input: GatewayUpdateProfileInput!
  ) {
    updateProfile(input: $input) {
      id
      username
      display_name
      avatar_url
      cover_url
      bio
      gender
      birthday
      location
      privacy
      created_at
      updated_at
    }
  }
`;