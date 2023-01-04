import { AuthenticationError } from '@/domain/errors'
import { FacebookAuthentication } from '@/domain/features'
import { LoadFacebookUserApi } from '@/data/contracts/apis'
import { LoadUserAccountRepository, CreateUserByFacebookAccountRepository } from '@/data/contracts/repositories'

export class FacebookAuthenticationService {
  constructor (
    private readonly loadFacebookUserApi: LoadFacebookUserApi,
    private readonly loadUserAccountRepo: LoadUserAccountRepository,
    private readonly createUserByFacebookAccountRepo: CreateUserByFacebookAccountRepository
  ) {}

  async perform (params: FacebookAuthentication.Params): Promise<AuthenticationError> {
    const facebookData = await this.loadFacebookUserApi.loadUser(params)
    if (facebookData !== undefined) {
      await this.loadUserAccountRepo.load({ email: facebookData.email })
      await this.createUserByFacebookAccountRepo.createFromFacebook(facebookData)
    }
    return new AuthenticationError()
  }
}
