import { AuthResource, FileResource } from './resources'

export default {
  login: function (data) {
    return AuthResource.save({id: 'Submit'}, data)
  },
  uploadFile: function (data) {
    return FileResource.save({id: 'UploadFile'}, data)
  }
}
