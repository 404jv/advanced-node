import { AuthenticationError } from '@/domain/errors'
import { LoadGithubTokenByCodeApi, LoadGithubUserByTokenApi } from '@/data/contracts/apis'
import { GithubAuthenticationService } from '@/data/services'
import { LoadUserAccountRepository } from '@/data/contracts/repositories'

import { mock, MockProxy } from 'jest-mock-extended'

describe('GithubAuthenticationService', () => {
  let githubApi: MockProxy<LoadGithubTokenByCodeApi & LoadGithubUserByTokenApi>
  let loadUserAccountRepo: MockProxy<LoadUserAccountRepository>

  let sut: GithubAuthenticationService
  const code = 'any_code'

  beforeEach(() => {
    githubApi = mock()
    githubApi.loadTokenByCode.mockResolvedValue('any_token')
    githubApi.loadUserByToken.mockResolvedValue({
      name: 'any_gh_name',
      email: 'any_gh_email',
      githubId: 'any_gh_id'
    })
    loadUserAccountRepo = mock()
    sut = new GithubAuthenticationService(githubApi, loadUserAccountRepo)
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

    expect(githubApi.loadUserByToken).toHaveBeenCalledWith({ token: 'any_token' })
    expect(githubApi.loadUserByToken).toHaveBeenCalledTimes(1)
  })

  it('should return AuthenticationError when LoadGithubUserByTokenApi returns undefined', async () => {
    githubApi.loadUserByToken.mockResolvedValueOnce(undefined)

    const authResult = await sut.perform({ code })

    expect(authResult).toEqual(new AuthenticationError())
  })

  it('should call LoadUserAccountRepo when LoadGithubUserByTokenApi returns data', async () => {
    await sut.perform({ code })

    expect(loadUserAccountRepo.load).toHaveBeenCalledWith({ email: 'any_gh_email' })
    expect(loadUserAccountRepo.load).toHaveBeenCalledTimes(1)
  })
})
