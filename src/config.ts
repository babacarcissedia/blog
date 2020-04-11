import dotenv from 'dotenv'
dotenv.config()

export const DEBUG = process.env.DEBUG === 'true'
export const NODE_ENV = String(process.env.NODE_ENV)
export const IN_TEST = NODE_ENV === 'test'
export const IN_PRODUCTION = NODE_ENV === 'production'
export const IN_DEVELOPMENT = NODE_ENV === 'development'
export const MONGO_URI = String(process.env.MONGO_URI)
export const PORT = String(process.env.PORT || 4000)

