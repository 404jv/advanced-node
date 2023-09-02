import { AuthenticationError } from '@/domain/errors'
import { LoadGithubTokenByCodeApi, LoadGithubUserByTokenApi } from '@/data/contracts/apis'
import { GithubAuthenticationService } from '@/data/services'

import { mock, MockProxy } from 'jest-mock-extended'

describe('GithubAuthenticationService', () => {
  let loadGithubTokenByCodeApi: MockProxy<LoadGithubTokenByCodeApi>
  let loadGithubUserByTokenApi: MockProxy<LoadGithubUserByTokenApi>
  let sut: GithubAuthenticationService
  const code = 'any_code'

  beforeEach(() => {
    loadGithubTokenByCodeApi = mock()
    loadGithubTokenByCodeApi.loadTokenByCode.mockResolvedValue('any_token')
    loadGithubUserByTokenApi = mock()
    sut = new GithubAuthenticationService(loadGithubTokenByCodeApi, loadGithubUserByTokenApi)
  })

  it('should call LoadGithubTokenByCodeApi with correct params', async () => {
    await sut.perform({ code })

    expect(loadGithubTokenByCodeApi.loadTokenByCode).toHaveBeenCalledWith({ code })
    expect(loadGithubTokenByCodeApi.loadTokenByCode).toHaveBeenCalledTimes(1)
  })

  it('should return AuthenticationError when LoadGithubTokenByCodeApi returns undefined', async () => {
    loadGithubTokenByCodeApi.loadTokenByCode.mockResolvedValueOnce(undefined)

    const authResult = await sut.perform({ code })

    expect(authResult).toEqual(new AuthenticationError())
  })

  it('should call LoadGithubUserByTokenApi when LoadGithubTokenByCodeApi returns data', async () => {
    await sut.perform({ code })

    expect(loadGithubUserByTokenApi.loadUserByToken).toHaveBeenCalledWith('any_token')
    expect(loadGithubUserByTokenApi.loadUserByToken).toHaveBeenCalledTimes(1)
  })
})
