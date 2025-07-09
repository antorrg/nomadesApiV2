import dotenv from 'dotenv'

const configEnv = {
  development: '.env.development',
  production: '.env.production',
  test: '.env.test'
}
const envFile = configEnv[process.env.NODE_ENV] || '.env.development'
dotenv.config({ path: envFile })

const Status = process.env.NODE_ENV
const { PORT, DATABASE_URL, JWT_SECRET, JWT_EXPIRES_IN, USER_IMG, S_USER_EMAIL, S_USER_PASS, DEFAULT_PASS, LOCAL_BASE_URL, CLOUD_API_KEY, CLOUD_API_SECRET, CLOUD_NAME } = process.env

export default {
  Port: parseInt(PORT),
  DatabaseUrl: DATABASE_URL,
  optionRender: process.env.NODE_ENV === 'production',
  Status,
  Secret: JWT_SECRET,
  ExpiresIn: JWT_EXPIRES_IN,
  UserImg: USER_IMG,
  RootEmail: S_USER_EMAIL,
  RootPass: S_USER_PASS,
  DefaultPass: DEFAULT_PASS,
  LocalBaseUrl: LOCAL_BASE_URL,
  CloudName: CLOUD_NAME,
  CloudApiKey: CLOUD_API_KEY,
  CloudApiSecret: CLOUD_API_SECRET

}
