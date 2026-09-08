declare module "apollo-upload-client/UploadHttpLink.mjs" {
  import { ApolloLink } from "@apollo/client";

  interface UploadHttpLinkOptions {
    uri?: string;
    credentials?: RequestCredentials;
    headers?: Record<string, string>;
  }

  export default class UploadHttpLink extends ApolloLink {
    constructor(options?: UploadHttpLinkOptions);
  }
}