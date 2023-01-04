export interface LoadUserAccountRepository {
  load: (params: LoadUserAccountRepository.Params) => Promise<LoadUserAccountRepository.Result>
}

export namespace LoadUserAccountRepository {
  export type Params = {
    email: string
  }

  export type Result = undefined
}

export interface CreateUserByFacebookAccountRepository {
  createFromFacebook: (params: CreateUserByFacebookAccountRepository.Params) => Promise<void>
}

export namespace CreateUserByFacebookAccountRepository {
  export type Params = {
    name: string
    email: string
    facebookId: string
  }
}
