import User from './User'
export  default  class UserRepository {
    static exists (filters) {
        return new Promise((resolve, reject) => {
            User.find(filters)
                .then(restaurants => resolve(restaurants.length > 0))
                .catch(error => reject(error))
        }) }
}
