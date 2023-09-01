import { AuthenticationError } from '@/domain/errors'

export interface GithubAuthentication {
  perform: (params: GithubAuthentication.Params) => Promise<GithubAuthentication.Result>
}

export namespace GithubAuthentication {
  export type Params = {
    code: string
  }

  export type Result = AuthenticationError
}
