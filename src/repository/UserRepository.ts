import User from '../model/User'
export  default  class UserRepository {
    static exists (filters) {
        return new Promise((resolve, reject) => {
            User.countDocuments(filters)
                .then(restaurants => resolve(restaurants))
                .catch(error => reject(error))
        }) }
}
