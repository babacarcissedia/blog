import { clean, setup } from "../testCase";
const supertest = require('supertest')

let app
let request
describe('User', () => {
  // beforeAll(async (done) => {
  //   app = await setup()
  //   request = supertest.agent(app)
  //   done()
  // })
  // beforeEach(async (done) => {
  //   await clean()
  //   done()
  // })

  it('should work', () => {
    expect(1+1).toBe(2)
  })
})
