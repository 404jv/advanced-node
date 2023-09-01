import { AuthenticationError } from '@/domain/errors'
import { LoadGithubTokenByCodeApi } from '@/data/contracts/apis'
import { GithubAuthenticationService } from '@/data/services'

import { mock, MockProxy } from 'jest-mock-extended'

describe('GithubAuthenticationService', () => {
  let loadGithubTokenByCodeApi: MockProxy<LoadGithubTokenByCodeApi>
  let sut: GithubAuthenticationService
  const code = 'any_code'

  beforeEach(() => {
    loadGithubTokenByCodeApi = mock<LoadGithubTokenByCodeApi>()
    sut = new GithubAuthenticationService(loadGithubTokenByCodeApi)
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
})
