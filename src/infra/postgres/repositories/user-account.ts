import { LoadUserAccountRepository, SaveFacebookAccountRepository } from '@/data/contracts/repositories'
import { PgUser } from '@/infra/postgres/entities'

import { getRepository } from 'typeorm'

type LoadParams = LoadUserAccountRepository.Params
type LoadResult = LoadUserAccountRepository.Result
type SaveParams = SaveFacebookAccountRepository.Params
type SaveResult = SaveFacebookAccountRepository.Result

export class PgUserAccountRepository implements LoadUserAccountRepository {
  private readonly pgUserRepo = getRepository(PgUser)

  async load (params: LoadParams): Promise<LoadResult> {
    const pgUser = await this.pgUserRepo.findOne({ email: params.email })
    if (pgUser !== undefined) {
      return {
        id: pgUser.id.toString(),
        name: pgUser.name ?? undefined
      }
    }
  }

  async saveWithFacebook ({ email, facebookId, name, id }: SaveParams): Promise<SaveResult> {
    if (id === undefined) {
      const pgUser = await this.pgUserRepo.save({ name, email, facebookId })
      return { id: pgUser.id.toString() }
    }
    await this.pgUserRepo.update({ id: parseInt(id) }, { name, facebookId })
    return { id }
  }
}
