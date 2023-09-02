import { AuthenticationError } from '@/domain/errors'
import { LoadGithubTokenByCodeApi, LoadGithubUserByTokenApi } from '@/data/contracts/apis'
import { GithubAuthenticationService } from '@/data/services'

import { mock, MockProxy } from 'jest-mock-extended'

describe('GithubAuthenticationService', () => {
  let githubApi: MockProxy<LoadGithubTokenByCodeApi & LoadGithubUserByTokenApi>
  let sut: GithubAuthenticationService
  const code = 'any_code'

  beforeEach(() => {
    githubApi = mock()
    githubApi.loadTokenByCode.mockResolvedValue('any_token')
    sut = new GithubAuthenticationService(githubApi)
  })

  it('should call LoadGithubTokenByCodeApi with correct params', async () => {
    await sut.perform({ code })

    expect(githubApi.loadTokenByCode).toHaveBeenCalledWith({ code })
    expect(githubApi.loadTokenByCode).toHaveBeenCalledTimes(1)
  })

  it('should return AuthenticationError when LoadGithubTokenByCodeApi returns undefined', async () => {
    githubApi.loadTokenByCode.mockResolvedValueOnce(undefined)

    const authResult = await sut.perform({ code })

    expect(authResult).toEqual(new AuthenticationError())
  })

  it('should call LoadGithubUserByTokenApi when LoadGithubTokenByCodeApi returns data', async () => {
    await sut.perform({ code })

    expect(githubApi.loadUserByToken).toHaveBeenCalledWith('any_token')
    expect(githubApi.loadUserByToken).toHaveBeenCalledTimes(1)
  })

  it('should return AuthenticationError when LoadGithubUserByTokenApi returns undefined', async () => {
    githubApi.loadUserByToken.mockResolvedValueOnce(undefined)

    const authResult = await sut.perform({ code })

    expect(authResult).toEqual(new AuthenticationError())
  })
})
