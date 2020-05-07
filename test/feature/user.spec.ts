const supertest = require('supertest')
import UserFactory from "../../src/factory/UserFactory";
import { UserRole } from "../../src/model/interfaces";
import { clean, setup, stop } from "../testCase";

let app
let request
describe('User', () => {
  beforeAll(async (done) => {
    app = await setup()
    request = supertest(app)
    done()
  })

  afterAll(async (done) => {
    stop()
    done()
  })

  beforeEach(async (done) => {
    await clean()
    done()
  })


  describe('index()', () => {
    it('should ban guest user', async () => {
      await request.get('/user')
        .expect(401)
    })
    it('should ban customer user', async () => {
      const user = await UserFactory.create({ role: UserRole.CUSTOMER })
      await request.get('/user')
        .set('Authorization', `Bearer ${user.token}`)
        .expect(403)
    })
    it('should allow admin user and return all results', async () => {
      const users = await UserFactory.createMany({}, 10)
      const user = await UserFactory.create({ role: UserRole.ADMIN })
      const results = await request.get('/user')
        .set('Authorization', `Bearer ${user.token}`)
        .expect(200)
      expect(results.length).toEqual(users.length)
      for (const user of users) {
        const found = results.findIndex(u => u.id === user.id) !== -1
        expect(found).toBe(true)
      }
    })
  })
})
