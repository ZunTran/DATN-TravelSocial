import { Injectable, BadGatewayException} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { SERVICE_URLS } from '../config/service-url.config';

@Injectable()
export class AuthGatewayService {
  constructor(
    private readonly httpService: HttpService,
  ) {}

private async execute<T>(
  query: string,
  variables?: Record<string, any>,
  authorization?: string,
): Promise<T> {
  try {
    const response = await firstValueFrom(
      this.httpService.post(
        SERVICE_URLS.AUTH,
        {
          query,
          variables,
        },
        {
          headers: {
            'Content-Type': 'application/json',

            ...(authorization
              ? {
                  Authorization: authorization,
                }
              : {}),
          },
        },
      ),
    );

    const result = response.data;

    if (result.errors?.length) {
      throw new BadGatewayException(result.errors);
    }

    return result.data;
  } catch (error: any) {
    if (error instanceof BadGatewayException) {
      throw error;
    }

    throw new BadGatewayException(
      error?.response?.data ||
        'Auth Service không phản hồi',
    );
  }
}

async register(input: any) {
  const result = await this.execute<{
      register: {
        accessToken: string;
        refreshToken: string;
      };
    }>(
      `
      mutation Register( $input: RegisterInput!) {
        register(input: $input) {
          accessToken
          refreshToken
        }
      }
      `,
      { input },
    );

  return result.register;
}


async login(input: any) {
  const result = await this.execute<{
    login: {
      accessToken: string;
      refreshToken: string;
    };
  }>(
    `
    mutation Login($input: LoginInput!) {
      login(input: $input) {
        accessToken
        refreshToken
      }
    }
    `,
    { input },
  );

  return result.login;
}

  async forgotPassword(input: any) {
    return this.execute(
      `
      mutation ForgotPassword($input: ForgotPasswordInput!) {
        forgotPassword(input: $input)
      }
      `,
      {
        input,
      },
    );
  }

  async resetPassword(input: any) {
    return this.execute(
      `
      mutation ResetPassword($input: ResetPasswordInput!) {
        resetPassword(input: $input)
      }
      `,
      {
        input,
      },
    );
  }

async refreshToken(refreshToken: string) {
  const result = await this.execute<{
    refreshToken: {
      accessToken: string;
      refreshToken: string;
    };
  }>(
    `
    mutation RefreshToken(
      $input: RefreshTokenInput!
    ) {
      refreshToken(input: $input) {
        accessToken
        refreshToken
      }
    }
    `,
    {
      input: {
        refreshToken,
      },
    },
  );

  return result.refreshToken;
}

  async verifyEmail(token: string) {
    return this.execute(
      `
      mutation VerifyEmail($token: String!) {
        verifyEmail(token: $token)
      }
      `,
      {
        token,
      },
    );
  }

  async resendVerifyEmail(email: string) {
    return this.execute(
      `
      mutation ResendVerifyEmail($email: String!) {
        resendVerifyEmail(email: $email)
      }
      `,
      {
        email,
      },
    );
  }

  async oauthLogin(
    input: any,
    authorization?: string,
  ) {
    return this.execute(
      `
      mutation OauthLogin($input: OauthLoginInput!) {
        oauthLogin(input: $input) {
          accessToken
          refreshToken
        }
      }
      `,
      {
        input,
      },
      authorization,
    );
  }

  async getMyProfile(authorization?: string) {
    return this.execute(
      `
      query GetMyProfile {
        getMyProfile
      }
      `,
      undefined,
      authorization,
    );
  }

  async logout(
    refreshToken: string,
    authorization?: string,
  ) {
    return this.execute(
      `
      mutation Logout($refreshToken: String!) {
        logout(refreshToken: $refreshToken)
      }
      `,
      {
        refreshToken,
      },
      authorization,
    );
  }

  async logoutAll(authorization?: string) {
    return this.execute(
      `
      mutation LogoutAll {
        logoutAll
      }
      `,
      undefined,
      authorization,
    );
  }

  async changePassword(
    input: any,
    authorization?: string,
  ) {
    return this.execute(
      `
      mutation ChangePassword($input: ChangePasswordInput!) {
        changePassword(input: $input)
      }
      `,
      {
        input,
      },
      authorization,
    );
  }

async getActiveSessions(authorization?: string) {
  const result = await this.execute<{
    getActiveSessions: any[];
  }>(
    `
    query GetActiveSessions {
      getActiveSessions {
        id
        deviceName
        browser
        os
        ipAddress
        lastActiveAt
        isActive
      }
    }
    `,
    undefined,
    authorization,
  );

  return result.getActiveSessions;
}

  async terminateSession(
    sessionId: string,
    authorization?: string,
  ) {
    return this.execute(
      `
      mutation TerminateSession($sessionId: ID!) {
        terminateSession(sessionId: $sessionId)
      }
      `,
      {
        sessionId,
      },
      authorization,
    );
  }
}