const supertest = require('supertest')
import UserFactory from "../../src/factory/UserFactory";
import { UserRole } from "../../src/model/interfaces";
import AppApiResponse from "../../src/response/AppApiResponse";
import { clean, setup, stop } from "../testCase";

let app
let request
describe('User', () => {
  beforeAll(async () => {
    app = await setup()
    request = supertest(app)
  })

  afterAll(async () => {
    await stop()
    await app.close()
  })

  beforeEach(async () => {
    await clean()
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
      const count = 10
      const users = await UserFactory.createMany({}, count)
      const user = await UserFactory.create({ role: UserRole.ADMIN })
      const response = await request.get('/user')
        .set('Authorization', `Bearer ${user.token}`)
        .expect(200)
      const results = response.body.data
      expect(results.length).toEqual(count + 1)
      for (const user of users) {
        const found = results.findIndex(u => u.id === user.id) !== -1
        expect(found).toBe(true)
      }
    })
  })

  describe('show()', () => {
    it('should ban guest user', async () => {
      const user = await UserFactory.create()
      await request.get(`/user/${user.id}`)
        .expect(401)
    })
    it('should ban other that requested user', async () => {
      const authUser = await UserFactory.create()
      const user = await UserFactory.create()
      const response = await request.get(`/user/${user.id}`)
        .set('Authorization', `Bearer ${authUser.token}`)
        .expect(403)
    })
    it('should allow self user fetch', async () => {
      const authUser = await UserFactory.create()
      const user = authUser
      const response = await request.get(`/user/${user.id}`)
        .set('Authorization', `Bearer ${authUser.token}`)
        .expect(200)
      const apiResponse = AppApiResponse.from(response.body)
      expect(apiResponse.isSuccess()).toBe(true)
      const apiResponseData = apiResponse.getData()
      expect(apiResponseData).toHaveProperty('id')
      expect(apiResponseData.id).toEqual(user.id)
    })
    it('should allow admin to retrieve everyone', async () => {
      const authUser = await UserFactory.create({ role: UserRole.ADMIN })
      const user = await UserFactory.create()
      const response = await request.get(`/user/${user.id}`)
        .set('Authorization', `Bearer ${authUser.token}`)
        .expect(200)
      const apiResponse = AppApiResponse.from(response.body)
      expect(apiResponse.isSuccess()).toBe(true)
      const apiResponseData = apiResponse.getData()
      expect(apiResponseData).toHaveProperty('id')
      expect(apiResponseData.id).toEqual(user.id)
    })
  })
})
