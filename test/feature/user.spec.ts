const supertest = require('supertest')
import UserFactory from "../../src/factory/UserFactory";
import { UserRole } from "../../src/model/interfaces";
import AppApiResponse from "../../src/response/AppApiResponse";
import { setup, startDatabase } from "../testCase";

describe('User', () => {
  let database
  let app
  let request
  beforeAll(async () => {
    database = startDatabase()
    app = await setup(database)
    console.log({app})
    request = supertest(app)
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(async () => {
    await database.truncate()
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
    const assertEqual = (responseUser, user) => {
      expect(responseUser.id).toEqual(user.id)
      expect(responseUser.first_name).toEqual(user.first_name)
      expect(responseUser.last_name).toEqual(user.last_name)
      expect(responseUser.role).toEqual(user.role)
    }
    it('should ban guest user', async () => {
      const user = await UserFactory.create()
      await request.get(`/user/${user.id}`)
        .expect(401)
    })
    it('should ban other that requested user', async () => {
      const authUser = await UserFactory.create()
      const user = await UserFactory.create()
      await request.get(`/user/${user.id}`)
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
      const responseUser = apiResponse.getData()
      assertEqual(responseUser, user)
    })
    it('should allow admin to retrieve everyone', async () => {
      const authUser = await UserFactory.create({ role: UserRole.ADMIN })
      const user = await UserFactory.create()
      const response = await request.get(`/user/${user.id}`)
        .set('Authorization', `Bearer ${authUser.token}`)
        .expect(200)
      const apiResponse = AppApiResponse.from(response.body)
      expect(apiResponse.isSuccess()).toBe(true)
      const responseUser = apiResponse.getData()
      assertEqual(responseUser, user)
    })
  })

  describe.skip('update()', () => {
    const testAs = async ({ authUser, targetUser }) => {
      const payload = await UserFactory.make()
      const response = await request.put(`/user/${targetUser.id}`)
        .set('Authorization', `Bearer ${authUser.token}`)
        .send(payload)
        .expect(200)
      const apiResponse = AppApiResponse.from(response.body)
      expect(apiResponse.isSuccess()).toBe(true)
      const responseUser = apiResponse.getData()
      expect(responseUser.id).toEqual(targetUser.id)
      expect(responseUser.password).toEqual(targetUser.password)
      expect(responseUser.role).toEqual(targetUser.role)
      expect(responseUser.token).toEqual(targetUser.token)
      debugger
      expect(responseUser.email).toEqual(payload.email)
      expect(responseUser.first_name).toEqual(payload.first_name)
      expect(responseUser.last_name).toEqual(payload.last_name)
    }
    it('should ban guest user', async () => {
      const user = await UserFactory.create()
      const payload = await UserFactory.make()
      await request.put(`/user/${user.id}`)
        .send(payload)
        .expect(401)
    })
    it('should ban other that requested user', async () => {
      const authUser = await UserFactory.create()
      const user = await UserFactory.create()
      const payload = await UserFactory.make()
      await request.put(`/user/${user.id}`)
        .set('Authorization', `Bearer ${authUser.token}`)
        .send(payload)
        .expect(403)
    })
    it('should allow self user update', async () => {
      const authUser = await UserFactory.create()
      const targetUser = authUser
      await testAs({ authUser: authUser, targetUser })
    })
    it('should allow admin to retrieve everyone', async () => {
      const authUser = await UserFactory.create({ role: UserRole.ADMIN })
      const targetUser = await UserFactory.create()
      await testAs({ authUser: authUser, targetUser })
    })
  })
})
