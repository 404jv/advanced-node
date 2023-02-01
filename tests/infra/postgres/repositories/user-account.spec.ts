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

  describe('save', () => {
    it('should create an account if id is undefined', async () => {
      const { id } = await sut.saveWithFacebook({
        email: 'awagesi@nito.fo',
        name: 'Connor Yates',
        facebookId: 'any_fb_id'
      })
      const pgUser = await pgUserRepo.findOne({ email: 'awagesi@nito.fo' })

      expect(pgUser?.id).toBe(1)
      expect(id).toBe('1')
    })

    it('should update an account if id is defined', async () => {
      await pgUserRepo.save({
        email: 'old_email',
        name: 'old_name',
        facebookId: 'any_fb_id'
      })

      const { id } = await sut.saveWithFacebook({
        id: '1',
        email: 'new_email',
        name: 'new_name',
        facebookId: 'new_fb_id'
      })
      const pgUser = await pgUserRepo.findOne({ id: 1 })

      expect(pgUser).toEqual({
        id: 1,
        email: 'old_email',
        name: 'new_name',
        facebookId: 'new_fb_id'
      })
      expect(id).toBe('1')
    })
  })
})
