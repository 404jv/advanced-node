import { AuthenticationError } from '@/domain/errors'
import { FacebookAuthentication } from '@/domain/features'
import { LoadFacebookUserApi } from '@/data/contracts/apis'
import { LoadUserAccountRepository, SaveFacebookAccountRepository } from '@/data/contracts/repositories'

export class FacebookAuthenticationService {
  constructor (
    private readonly facebookApi: LoadFacebookUserApi,
    private readonly userAccountRepo: LoadUserAccountRepository & SaveFacebookAccountRepository
  ) {}

  async perform (params: FacebookAuthentication.Params): Promise<AuthenticationError> {
    const facebookData = await this.facebookApi.loadUser(params)

    if (facebookData !== undefined) {
      const account = await this.userAccountRepo.load({ email: facebookData.email })

      await this.userAccountRepo.saveWithFacebook({
        id: account?.id,
        name: account?.name ?? facebookData.name,
        email: facebookData.email,
        facebookId: facebookData.facebookId
      })
    }

    return new AuthenticationError()
  }
}
