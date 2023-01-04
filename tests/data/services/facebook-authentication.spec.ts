import { LoadFacebookUserApi } from '@/data/contracts/apis'
import { CreateUserByFacebookAccountRepository, LoadUserAccountRepository } from '@/data/contracts/repositories'
import { FacebookAuthenticationService } from '@/data/services'
import { AuthenticationError } from '@/domain/errors'

import { mock, MockProxy } from 'jest-mock-extended'

describe('FacebookAuthenticationService', () => {
  let sut: FacebookAuthenticationService
  let loadFacebookUserApi: MockProxy<LoadFacebookUserApi>
  let loadUserAccountRepo: MockProxy<LoadUserAccountRepository>
  let createUserByFacebookAccountRepo: MockProxy<CreateUserByFacebookAccountRepository>
  const token = 'any_token'

  beforeEach(() => {
    loadFacebookUserApi = mock()
    loadFacebookUserApi.loadUser.mockResolvedValue({
      name: 'Mathilda Owens',
      email: 'mathilda@email.com',
      facebookId: 'any_id'
    })
    loadUserAccountRepo = mock()
    createUserByFacebookAccountRepo = mock()
    sut = new FacebookAuthenticationService(
      loadFacebookUserApi,
      loadUserAccountRepo,
      createUserByFacebookAccountRepo
    )
  })

  it('should call LoadFacebookUserApi with correct params', async () => {
    await sut.perform({ token })

    expect(loadFacebookUserApi.loadUser).toHaveBeenCalledWith({ token })
    expect(loadFacebookUserApi.loadUser).toHaveBeenCalledTimes(1)
  })

  it('should return AuthenticationError when LoadFacebookUserApi returns undefined', async () => {
    loadFacebookUserApi.loadUser.mockResolvedValueOnce(undefined)

    const authResult = await sut.perform({ token })

    expect(authResult).toEqual(new AuthenticationError())
  })

  it('should call LoadUserAccountRepo when LoadFacebookUserApi returns data', async () => {
    await sut.perform({ token })

    expect(loadUserAccountRepo.load).toHaveBeenCalledWith({ email: 'mathilda@email.com' })
    expect(loadUserAccountRepo.load).toHaveBeenCalledTimes(1)
  })

  it('should call CreateUserAccountRepo when LoadUserAccountRepo returns undefined', async () => {
    loadUserAccountRepo.load.mockResolvedValueOnce(undefined)

    await sut.perform({ token })

    expect(createUserByFacebookAccountRepo.createFromFacebook).toHaveBeenCalledWith({
      name: 'Mathilda Owens',
      email: 'mathilda@email.com',
      facebookId: 'any_id'
    })
    expect(createUserByFacebookAccountRepo.createFromFacebook).toHaveBeenCalledTimes(1)
  })
})
