import UserFactory from "@/factory/UserFactory";
import UserRepository from "@/repository/UserRepository";
import { hash, hashCompare } from "../../../src/helper/app.helpers";
import { clean, start, stop } from "../../testCase";
import crypto from 'crypto'

describe('UserRepository', () => {

  beforeAll(async () => {
    await start()
  })

  afterAll(async () => {
    await stop()
  })

  beforeEach(async () => {
    await clean()
  })


  describe('count(filter)', () => {
    it('should return 0 when there is no document', async () => {
      const filters = {}
      let count = await UserRepository.count(filters)
      expect(count).toBe(0)
    })
    it('should return all documents count when filter={}', async () => {
      await UserFactory.createMany({}, 10)
      const filters = {}
      const count = await UserRepository.count(filters)
      expect(count).toBe(10)
    })
    it('should return documents count matching filter', async () => {
      await UserFactory.createMany({ last_name: 'dia' }, 2)
      await UserFactory.createMany({ last_name: 'fall' }, 3)
      await UserFactory.createMany({}, 7)
      expect(await UserRepository.count({ last_name: 'dia' })).toBe(2)
      expect(await UserRepository.count({ last_name: 'fall' })).toBe(3)
    })
  })


  describe('add(payload)', () => {
    it('should create document and hash password', async () => {
      const payload = await UserFactory.make()
      const user = await UserRepository.add(payload)
      expect(user.password).not.toEqual(payload.password)
      expect(await hashCompare(payload.password, user.password)).toBe(true)
    })
  })
})
