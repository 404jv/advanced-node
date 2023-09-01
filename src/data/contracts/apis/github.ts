export interface LoadGithubUserApi {
  loadUser: (params: LoadGithubUserApi.Params) => Promise<LoadGithubUserApi.Result>
}

export namespace LoadGithubUserApi {
  export type Params = {
    code: string
  }

  export type Result = undefined | {
    access_token: string
  }
}
