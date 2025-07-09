import env from './envConfig.js'
import ImgsService from '../Shared/Services/ImgsService.js'

export default async function ImageHandler () {
  if (env.Status === 'test') {
    const { default: mock } = await import('../../test/helperTest/mockImages.js')
    return mock
  }
  return ImgsService
}