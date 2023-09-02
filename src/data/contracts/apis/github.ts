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
  loadUserByToken: (params: LoadGithubUserByTokenApi.Params) => Promise<LoadGithubUserByTokenApi.Result>
}

export namespace LoadGithubUserByTokenApi {
  export type Params = {
    token: string
  }

  export type Result = undefined | {
    name: string
    email: string
    githubId: string
  }
}
