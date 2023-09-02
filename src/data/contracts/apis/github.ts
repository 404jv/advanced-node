export interface LoadGithubTokenByCodeApi {
  loadTokenByCode: (params: LoadGithubTokenByCodeApi.Params) => Promise<LoadGithubTokenByCodeApi.Result>
}

export namespace LoadGithubTokenByCodeApi {
  export type Params = {
    code: string
  }

  export type Result = undefined | string
}

export interface LoadGithubUserByTokenApi {
  loadUserByToken: (token: string) => Promise<void>
}

export namespace LoadGithubUserByTokenApi {
  export type Params = {
    token: string
  }
}
