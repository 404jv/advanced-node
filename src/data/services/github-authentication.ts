import { AuthenticationError } from '@/domain/errors'
import { GithubAuthentication } from '@/domain/features'
import { LoadGithubTokenByCodeApi, LoadGithubUserByTokenApi } from '@/data/contracts/apis'

export class GithubAuthenticationService implements GithubAuthentication {
  constructor (
    private readonly githubApi: LoadGithubTokenByCodeApi & LoadGithubUserByTokenApi
  ) {}

  async perform (params: GithubAuthentication.Params): Promise<AuthenticationError> {
    const githubToken = await this.githubApi.loadTokenByCode(params)
    if (githubToken !== undefined) {
      await this.githubApi.loadUserByToken(githubToken)
    }
    return new AuthenticationError()
  }
}
