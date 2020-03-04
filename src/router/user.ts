import * as express from 'express'
import User from "../api/user/User";
const router = express.Router()
const TYPE_ERROR = 'error'
const TYPE_SUCCESS: string = 'success'
// Get all users
router.get('/', async (req: express.Request,res: express.Response, next: express.NextFunction) => {
    try {
          const users: any =  await User.find({})
          res.json({
               type: TYPE_SUCCESS,
               message: '',
              data: users
          })
    }
    catch (error) {
      res.json({
          type: TYPE_ERROR,
          message: error.message,
          data: {}
      })
    }
})
