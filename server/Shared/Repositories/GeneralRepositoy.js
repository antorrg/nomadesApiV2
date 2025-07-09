import BaseRepository from './BaseRepository.js'

export default class GeneralRepository extends BaseRepository {
  constructor (Model, dataEmpty = null) {
    super(Model, dataEmpty)
  }
}
