import { FileResource, UserResource, CarIdResource } from './resources'

export default {
  getCompanyInfo: function () {
    return UserResource.get({id: 'GetCompanyInfo'})
  },
  login: function (data) {
    return UserResource.save({id: 'Login'}, data)
  },
  uploadFile: function (data) {
    return FileResource.save({id: 'UploadFile'}, data)
  },
  submit: function (data) {
    return CarIdResource.save({id: 'Submit'}, data)
  }
}
