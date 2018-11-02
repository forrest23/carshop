import { AuthResource } from './resources'

export default {
  login: function (data) {
    return AuthResource.save({id: 'Submit'}, data)
  }
}
