import AppException from '@/exception/AppException'
import { hash, hashCompare } from '@/helper/app.helpers'
import { IUser } from '@/model/interfaces'
import User from '@/model/User'

export default class UserRepository {
  static findAll (query: { [key: string]: string} = {}): Promise<IUser[]> {
    if (query.id) {
      query._id = query.id
      delete query.id
    }
    return new Promise((resolve, reject) => {
      User.find(query).populate('subscription')
        .then((users) => resolve(users))
        .catch((error: Error) => reject(error))
    })
  }

  static find (query: { [key: string]: string} = {}): Promise<IUser> {
    return new Promise((resolve, reject) => {
      this.findAll(query)
        .then((users) => {
          const { 0: user } = users
          if (!user) {
            throw new AppException({
              status: 404,
              message: 'Aucun utilisateur ne correspond aux critères.'
            })
          }
          resolve(user)
        })
        .catch((error: Error) => reject(error))
    })
  }

  static count (filters): Promise<number> {
    return new Promise((resolve, reject) => {
      User.countDocuments(filters)
        .then(user => resolve(user))
        .catch(error => reject(error))
    })
  }

  static add (data): Promise<IUser> {
    return new Promise(async (resolve, reject) => {
      data.password = await hash(data.password)
      const user = new User(data)
      user.save()
        .then(async (userSaved) => {
          if (!userSaved) {
            throw new AppException({
              message: 'Erreur lors de l\'ajout de l\'utilisateur.'
            })
          }
          resolve(userSaved)
        })
        .catch((error: Error) => reject(error))
    })
  }

  static exists (filters): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.count(filters)
        .then(count => resolve(count > 0))
        .catch(error => reject(error))
    })
  }

  static update (id, data): Promise<IUser> {
    return new Promise((resolve, reject) => {
      if (Object.keys(data).length === 0) {
        return reject(new Error('[UserRepository::update] No key value pair given to update'))
      }
      User.findByIdAndUpdate(id, data, { new: false })
        .then((user) => {
          if (!user) {
            throw new AppException({
              message: `Error while updating user ${id}`
            })
          }
          resolve(Object.assign({}, user.toJSON(), data))
        })
        .catch((error: Error) => reject(error))
    })
  }

  static delete (id): Promise<IUser> {
    return new Promise((resolve, reject) => {
      User.findByIdAndDelete(id)
        .then((result) => {
          if (!result) {
            throw new AppException({
              message: `Error lors de la suppression de l'utilisateur ${id}`
            })
          }
          resolve(result)
        })
        .catch((error: Error) => reject(error))
    })
  }

  static truncate (): Promise<any> {
    return new Promise((resolve, reject) => {
      User.deleteMany({})
        .then((result) => {
          if (!result) {
            throw new AppException({
              message: 'Error lors du vidage des données utilisateurs'
            })
          }
          resolve(result)
        })
        .catch((error: Error) => reject(error))
    })
  }

  static login (data) : Promise<IUser> {
      return new Promise( async(resolve, reject) => {
          try {
              const errorMessage = 'Email or Password do not match any account'
              const users = await this.findAll({ email: data.email})
              const {0: user} = users
              if(!user) {
                  throw new AppException({
                      status: 401,
                      message: errorMessage
                  })
              }
              if(!await hashCompare(data.password, user.password)) {
                  throw new AppException({
                      status: 401,
                      message: errorMessage
                  })
              }
              const updateUser = UserRepository.update(user.id, {
                  token: await hash(Date.now().toString())
              })
              resolve(updateUser)
          }catch (error) {
              reject(error)

          }
      })
    /*return new Promise(async (resolve, reject) => {
      this.findAll({email: data.email})
        .then(async (users) => {
          const {0: user} = users
          if(!user) {
            throw new AppException({
              status: 401,
              message: 'Email or Password do not match any account'
            })
          }
          if(!await hashCompare(data.password, user.password)) {
            throw new AppException({message: 'Password do not match any account'})
          }
          user.token = await hash(Date.now().toString())
          const updateUser = await new User(user).save()
          resolve(updateUser)
        })
        .catch((error: Error) => {
          reject(error)
        })
    })*/
  }
  static logout (id: string) : Promise<IUser> {
        return new Promise(async (resolve, reject) => {
            try {
                const user = await UserRepository.update(id, {
                    token: null
                })
                resolve(user)
            }catch (error) {
                reject(error)
            }
           /* this.findAll({id: id})
                .then(async (users) => {
                    const {0: user} = users
                    if(!user) {
                        throw new AppException({
                            status: 404,
                            message: 'User not found'
                        })
                    }
                     user.token = ''
                    const saveUser = await new User(user).save()
                    resolve(saveUser)
                })
                .catch((error: Error) => {
                    reject(error)
                })*/
        })
    }
  static async resetPassword (data) : Promise<IUser> {
       return new Promise((resolve, reject) => {


       })
    }
    static forgetPassword (data) : Promise<IUser> {
        return new Promise(async (resolve, reject) => {
            this.findAll({email: data.email})
                .then(async (users) => {
                    const {0: user} = users
                    if(!user) {
                        throw new AppException({
                            status: 401,
                            message: 'Email do not match any account'
                        })
                    }
                    user.token = await hash(Date.now().toString())
                    const updateUser = await new User(user).save()
                    resolve(updateUser)
                })
                .catch((error: Error) => {
                    reject(error)
                })
        })
    }
}
