import { AuthenticationError } from '@/domain/errors'
import { LoadGithubTokenByCodeApi } from '@/data/contracts/apis'
import { GithubAuthenticationService } from '@/data/services'

class LoadGithubTokenByCodeApiSpy implements LoadGithubTokenByCodeApi {
  code?: string
  result = undefined
  callsCount = 0

  async loadTokenByCode (params: LoadGithubTokenByCodeApi.Params): Promise<LoadGithubTokenByCodeApi.Result> {
    this.code = params.code
    this.callsCount++
    return this.result
  }
}

describe('GithubAuthenticationService', () => {
  it('should call LoadGithubTokenByCodeApi with correct params', async () => {
    const loadGithubTokenByCodeApi = new LoadGithubTokenByCodeApiSpy()
    const sut = new GithubAuthenticationService(loadGithubTokenByCodeApi)

    await sut.perform({ code: 'any_code' })

    expect(loadGithubTokenByCodeApi.code).toBe('any_code')
    expect(loadGithubTokenByCodeApi.callsCount).toBe(1)
  })

  it('should return AuthenticationError when LoadGithubTokenByCodeApi returns undefined', async () => {
    const loadGithubTokenByCodeApi = new LoadGithubTokenByCodeApiSpy()
    loadGithubTokenByCodeApi.result = undefined
    const sut = new GithubAuthenticationService(loadGithubTokenByCodeApi)

    const authResult = await sut.perform({ code: 'any_code' })

    expect(authResult).toEqual(new AuthenticationError())
  })
})
