import { AuthenticationError } from '@/domain/errors'
import { GithubAuthentication } from '@/domain/features'
import { LoadGithubTokenByCodeApi, LoadGithubUserByTokenApi } from '@/data/contracts/apis'

export class GithubAuthenticationService implements GithubAuthentication {
  constructor (
    private readonly loadGithubTokenByCodeApi: LoadGithubTokenByCodeApi,
    private readonly loadGithubUserByTokenApi: LoadGithubUserByTokenApi
  ) {}

  async perform (params: GithubAuthentication.Params): Promise<AuthenticationError> {
    const githubToken = await this.loadGithubTokenByCodeApi.loadTokenByCode(params)
    if (githubToken !== undefined) {
      await this.loadGithubUserByTokenApi.loadUserByToken(githubToken)
    }
    return new AuthenticationError()
  }
}
