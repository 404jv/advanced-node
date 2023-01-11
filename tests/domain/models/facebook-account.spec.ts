import { FacebookAccount } from '@/domain/models'

describe('FacebookAccount', () => {
  const facebookData = {
    name: 'Gilbert Burke',
    email: 'gilbert@email.com',
    facebookId: 'any_facebook_id'
  }

  it('should create with facebook data only', () => {
    const sut = new FacebookAccount(facebookData)

    expect(sut).toEqual({
      name: 'Gilbert Burke',
      email: 'gilbert@email.com',
      facebookId: 'any_facebook_id'
    })
  })

  it('should update name if its empty', () => {
    const accountData = { id: 'any_id' }

    const sut = new FacebookAccount(facebookData, accountData)

    expect(sut).toEqual({
      id: 'any_id',
      name: 'Gilbert Burke',
      email: 'gilbert@email.com',
      facebookId: 'any_facebook_id'
    })
  })

  it('should update name if its not empty', () => {
    const accountData = { id: 'any_id', name: 'Gilbert B.' }

    const sut = new FacebookAccount(facebookData, accountData)

    expect(sut).toEqual({
      id: 'any_id',
      name: 'Gilbert B.',
      email: 'gilbert@email.com',
      facebookId: 'any_facebook_id'
    })
  })
})
