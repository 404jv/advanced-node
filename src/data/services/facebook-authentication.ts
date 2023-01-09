import { AuthenticationError } from '@/domain/errors'
import { FacebookAuthentication } from '@/domain/features'
import { LoadFacebookUserApi } from '@/data/contracts/apis'
import { LoadUserAccountRepository, CreateUserByFacebookAccountRepository, UpdateUserByFacebookAccountRepository } from '@/data/contracts/repositories'

export class FacebookAuthenticationService {
  constructor (
    private readonly facebookApi: LoadFacebookUserApi,
    private readonly userAccountRepo: LoadUserAccountRepository & CreateUserByFacebookAccountRepository & UpdateUserByFacebookAccountRepository
  ) {}

  async perform (params: FacebookAuthentication.Params): Promise<AuthenticationError> {
    const facebookData = await this.facebookApi.loadUser(params)

    if (facebookData !== undefined) {
      const account = await this.userAccountRepo.load({ email: facebookData.email })

      if (account?.name !== undefined) {
        const { id, name } = account

        await this.userAccountRepo.updateByFacebook({
          id,
          name,
          facebookId: facebookData.facebookId
        })
      } else {
        await this.userAccountRepo.createFromFacebook(facebookData)
      }
    }

    return new AuthenticationError()
  }
}
