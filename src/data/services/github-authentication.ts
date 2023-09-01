import { AuthenticationError } from '@/domain/errors'
import { GithubAuthentication } from '@/domain/features'
import { LoadGithubTokenByCodeApi } from '@/data/contracts/apis'

export class GithubAuthenticationService implements GithubAuthentication {
  constructor (
    private readonly loadGithubTokenByCodeApi: LoadGithubTokenByCodeApi
  ) {}

  async perform (params: GithubAuthentication.Params): Promise<AuthenticationError> {
    await this.loadGithubTokenByCodeApi.loadTokenByCode(params)
    return new AuthenticationError()
  }
}
