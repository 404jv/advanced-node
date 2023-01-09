import { LoadFacebookUserApi } from '@/data/contracts/apis'
import {
  CreateUserByFacebookAccountRepository,
  LoadUserAccountRepository,
  UpdateUserByFacebookAccountRepository
} from '@/data/contracts/repositories'
import { FacebookAuthenticationService } from '@/data/services'
import { AuthenticationError } from '@/domain/errors'

import { mock, MockProxy } from 'jest-mock-extended'

describe('FacebookAuthenticationService', () => {
  let sut: FacebookAuthenticationService
  let facebookApi: MockProxy<LoadFacebookUserApi>
  let userAccountRepo: MockProxy<LoadUserAccountRepository & CreateUserByFacebookAccountRepository & UpdateUserByFacebookAccountRepository>
  const token = 'any_token'

  beforeEach(() => {
    facebookApi = mock()
    facebookApi.loadUser.mockResolvedValue({
      name: 'Mathilda Owens',
      email: 'mathilda@email.com',
      facebookId: 'any_fb_id'
    })
    userAccountRepo = mock()
    userAccountRepo.load.mockResolvedValue(undefined)
    sut = new FacebookAuthenticationService(
      facebookApi,
      userAccountRepo
    )
  })

  it('should call LoadFacebookUserApi with correct params', async () => {
    await sut.perform({ token })

    expect(facebookApi.loadUser).toHaveBeenCalledWith({ token })
    expect(facebookApi.loadUser).toHaveBeenCalledTimes(1)
  })

  it('should return AuthenticationError when LoadFacebookUserApi returns undefined', async () => {
    const authResult = await sut.perform({ token })

    expect(authResult).toEqual(new AuthenticationError())
  })

  it('should call LoadUserAccountRepo when LoadFacebookUserApi returns data', async () => {
    await sut.perform({ token })

    expect(userAccountRepo.load).toHaveBeenCalledWith({ email: 'mathilda@email.com' })
    expect(userAccountRepo.load).toHaveBeenCalledTimes(1)
  })

  it('should call CreateUserByFacebookAccountRepo when LoadUserAccountRepo returns undefined', async () => {
    await sut.perform({ token })

    expect(userAccountRepo.createFromFacebook).toHaveBeenCalledWith({
      name: 'Mathilda Owens',
      email: 'mathilda@email.com',
      facebookId: 'any_fb_id'
    })
    expect(userAccountRepo.createFromFacebook).toHaveBeenCalledTimes(1)
  })

  it('should call UpdateUserByFacebookAccountRepo when LoadUserAccountRepo returns data', async () => {
    userAccountRepo.load.mockResolvedValueOnce({
      id: 'any_id',
      name: 'Sylvia Goodman'
    })

    await sut.perform({ token })

    expect(userAccountRepo.updateByFacebook).toHaveBeenCalledWith({
      id: 'any_id',
      name: 'Sylvia Goodman',
      facebookId: 'any_fb_id'
    })
    expect(userAccountRepo.updateByFacebook).toHaveBeenCalledTimes(1)
  })

  it('should update account name', async () => {
    userAccountRepo.load.mockResolvedValueOnce({
      id: 'any_id'
    })

    await sut.perform({ token })

    expect(userAccountRepo.updateByFacebook).toHaveBeenCalledWith({
      id: 'any_id',
      name: 'Mathilda Owens',
      facebookId: 'any_fb_id'
    })
    expect(userAccountRepo.updateByFacebook).toHaveBeenCalledTimes(1)
  })
})
