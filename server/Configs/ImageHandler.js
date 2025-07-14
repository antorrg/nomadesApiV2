import env from './envConfig.js'
import ImgsService from '../Shared/Services/ImgsService.js'

export default async function ImageHandler () {
  if (env.Status !== 'production') {
    const { default: MockImgsService } = await import('../../test/helperTest/mockImages.js')
    return MockImgsService
  }
  return ImgsService
}
