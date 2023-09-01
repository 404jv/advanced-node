export interface LoadGithubTokenByCodeApi {
  loadTokenByCode: (params: LoadGithubTokenByCodeApi.Params) => Promise<LoadGithubTokenByCodeApi.Result>
}

export namespace LoadGithubTokenByCodeApi {
  export type Params = {
    code: string
  }

  export type Result = undefined
}
