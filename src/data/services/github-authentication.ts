import { AuthenticationError } from '@/domain/errors'
import { GithubAuthentication } from '@/domain/features'
import { LoadGithubTokenByCodeApi, LoadGithubUserByTokenApi } from '@/data/contracts/apis'
import { LoadUserAccountRepository, SaveGithubAccountRepository } from '@/data/contracts/repositories'

export class GithubAuthenticationService implements GithubAuthentication {
  constructor (
    private readonly githubApi: LoadGithubTokenByCodeApi & LoadGithubUserByTokenApi,
    private readonly userAccountRepo: LoadUserAccountRepository & SaveGithubAccountRepository
  ) {}

  async perform (params: GithubAuthentication.Params): Promise<AuthenticationError> {
    const githubToken = await this.githubApi.loadTokenByCode(params)
    if (githubToken !== undefined) {
      const user = await this.githubApi.loadUserByToken({ token: githubToken })
      if (user !== undefined) {
        await this.userAccountRepo.load({ email: user.email })
        await this.userAccountRepo.saveWithGithub(user)
      }
    }
    return new AuthenticationError()
  }
}
