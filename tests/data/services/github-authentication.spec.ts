import { AuthenticationError } from '@/domain/errors'
import { LoadGithubTokenByCodeApi } from '@/data/contracts/apis'
import { GithubAuthenticationService } from '@/data/services'

import { mock } from 'jest-mock-extended'

describe('GithubAuthenticationService', () => {
  it('should call LoadGithubTokenByCodeApi with correct params', async () => {
    const loadGithubTokenByCodeApi = mock<LoadGithubTokenByCodeApi>()
    const sut = new GithubAuthenticationService(loadGithubTokenByCodeApi)

    await sut.perform({ code: 'any_code' })

    expect(loadGithubTokenByCodeApi.loadTokenByCode).toHaveBeenCalledWith({ code: 'any_code' })
    expect(loadGithubTokenByCodeApi.loadTokenByCode).toHaveBeenCalledTimes(1)
  })

  it('should return AuthenticationError when LoadGithubTokenByCodeApi returns undefined', async () => {
    const loadGithubTokenByCodeApi = mock<LoadGithubTokenByCodeApi>()
    loadGithubTokenByCodeApi.loadTokenByCode.mockResolvedValueOnce(undefined)
    const sut = new GithubAuthenticationService(loadGithubTokenByCodeApi)

    const authResult = await sut.perform({ code: 'any_code' })

    expect(authResult).toEqual(new AuthenticationError())
  })
})
