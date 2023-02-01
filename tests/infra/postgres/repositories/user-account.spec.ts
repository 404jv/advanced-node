import { PgUser } from '@/infra/postgres/entities'
import { PgUserAccountRepository } from '@/infra/postgres/repositories'
import { makeFakeDb } from '@/tests/infra/postgres/mocks'

import { IBackup } from 'pg-mem'
import { getRepository, Repository, getConnection } from 'typeorm'

describe('PgUserAccountRepository', () => {
  let sut: PgUserAccountRepository
  let pgUserRepo: Repository<PgUser>
  let backup: IBackup

  beforeAll(async () => {
    const db = await makeFakeDb([PgUser])
    backup = db.backup()
    pgUserRepo = getRepository(PgUser)
  })

  afterAll(async () => {
    await getConnection().close()
  })

  beforeEach(() => {
    backup.restore()
    sut = new PgUserAccountRepository()
  })

  describe('load', () => {
    it('should return an account if email exists', async () => {
      await pgUserRepo.save({ email: 'awagesi@nito.fo' })

      const account = await sut.load({ email: 'awagesi@nito.fo' })

      expect(account).toEqual({ id: '1' })
    })

    it('should return an account if email does not exist', async () => {
      const account = await sut.load({ email: 'awagesi@nito.fo' })

      expect(account).toBeUndefined()
    })
  })
})
