import { AuthenticationError } from '@/domain/errors'
import { LoadGithubUserApi } from '../contracts/apis/github'

class GithubAuthenticationService {
  constructor (
    private readonly loadGithubTokenByCodeApi: LoadGithubTokenByCodeApi
  ) {}

  async perform (params: LoadGithubUserApi.Params): Promise<AuthenticationError> {
    await this.loadGithubTokenByCodeApi.loadTokenByCode(params)
    return new AuthenticationError()
  }
}

interface LoadGithubTokenByCodeApi {
  loadTokenByCode: (params: LoadGithubTokenByCodeApi.Params) => Promise<LoadGithubTokenByCodeApi.Result>
}

namespace LoadGithubTokenByCodeApi {
  export type Params = {
    code: string
  }

  export type Result = undefined
}

class LoadGithubTokenByCodeApiSpy implements LoadGithubTokenByCodeApi {
  code?: string
  result = undefined

  async loadTokenByCode (params: LoadGithubTokenByCodeApi.Params): Promise<LoadGithubTokenByCodeApi.Result> {
    this.code = params.code
    return this.result
  }
}

describe('GithubAuthenticationService', () => {
  it('should call LoadGithubTokenByCodeApi with correct params', async () => {
    const loadGithubTokenByCodeApi = new LoadGithubTokenByCodeApiSpy()
    const sut = new GithubAuthenticationService(loadGithubTokenByCodeApi)

    await sut.perform({ code: 'any_code' })

    expect(loadGithubTokenByCodeApi.code).toBe('any_code')
  })

  it('should return AuthenticationError when LoadGithubTokenByCodeApi returns undefined', async () => {
    const loadGithubTokenByCodeApi = new LoadGithubTokenByCodeApiSpy()
    loadGithubTokenByCodeApi.result = undefined
    const sut = new GithubAuthenticationService(loadGithubTokenByCodeApi)

    const authResult = await sut.perform({ code: 'any_code' })

    expect(authResult).toEqual(new AuthenticationError())
  })
})
