import { LoadGithubUserApi } from '../contracts/apis/github'

class GithubAuthenticationService {
  constructor (
    private readonly loadGithubTokenByCodeApi: LoadGithubTokenByCodeApi
  ) {}

  async perform (params: LoadGithubUserApi.Params): Promise<void> {
    await this.loadGithubTokenByCodeApi.loadTokenByCode(params)
  }
}

interface LoadGithubTokenByCodeApi {
  loadTokenByCode: (params: LoadGithubTokenByCodeApi.Params) => Promise<void>
}

namespace LoadGithubTokenByCodeApi {
  export type Params = {
    code: string
  }
}

class LoadGithubTokenByCodeApiSpy implements LoadGithubTokenByCodeApi {
  code?: string
  async loadTokenByCode (params: LoadGithubTokenByCodeApi.Params): Promise<void> {
    this.code = params.code
  }
}

describe('GithubAuthenticationService', () => {
  it('should call LoadGithubTokenByCodeApi with correct params', async () => {
    const loadGithubTokenByCodeApi = new LoadGithubTokenByCodeApiSpy()
    const sut = new GithubAuthenticationService(loadGithubTokenByCodeApi)

    await sut.perform({ code: 'any_code' })

    expect(loadGithubTokenByCodeApi.code).toBe('any_code')
  })
})
