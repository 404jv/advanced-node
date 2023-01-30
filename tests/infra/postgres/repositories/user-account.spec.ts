import { LoadUserAccountRepository } from '@/data/contracts/repositories'

import { IBackup, newDb } from 'pg-mem'
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  getRepository,
  Repository,
  getConnection
} from 'typeorm'

class PgUserAccountRepository implements LoadUserAccountRepository {
  async load (params: LoadUserAccountRepository.Params): Promise<LoadUserAccountRepository.Result> {
    const pgUserRepo = getRepository(PgUser)
    const pgUser = await pgUserRepo.findOne({ email: params.email })
    if (pgUser !== undefined) {
      return {
        id: pgUser.id.toString(),
        name: pgUser.name ?? undefined
      }
    }
  }
}

@Entity({ name: 'usuarios' })
class PgUser {
  @PrimaryGeneratedColumn()
    id!: number

  @Column({ nullable: true, name: 'nome' })
    name?: string

  @Column()
    email!: string

  @Column({ nullable: true, name: 'id_facebook' })
    facebookId?: string
}

describe('PgUserAccountRepository', () => {
  describe('load', () => {
    let sut: PgUserAccountRepository
    let pgUserRepo: Repository<PgUser>
    let backup: IBackup

    beforeAll(async () => {
      const db = newDb()
      const connection = await db.adapters.createTypeormConnection({
        type: 'postgres',
        entities: [PgUser]
      })
      await connection.synchronize()
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
