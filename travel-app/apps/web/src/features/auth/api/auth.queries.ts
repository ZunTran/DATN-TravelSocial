import { gql } from "@apollo/client";

export const LOGIN_MUTATION = gql`
  mutation Login($input: GatewayLoginInput!) {
    login(input: $input) {
      accessToken
    }
  }
`;

export const REGISTER_MUTATION = gql`
  mutation Register( $input: GatewayRegisterInput! ) {
    register(input: $input) { accessToken }
  }
`;

export const LOGOUT_MUTATION = gql`
  mutation Logout {
    logout
  }
`;

export const LOGOUT_ALL_MUTATION = gql`
  mutation LogoutAll {
    logoutAll
  }
`;

export const REFRESH_TOKEN_MUTATION = gql`
  mutation RefreshToken {
    refreshToken {
      accessToken
    }
  }
`;