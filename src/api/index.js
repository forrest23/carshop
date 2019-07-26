import { FileResource, UserResource, CarIdResource, MemberResource,
  MemberBalanceResource, WtsResource, NaireResource } from './resources'

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
  },
  updateOpenId: function (data) {
    return MemberResource.save({id: 'UpdateOpenId'}, data)
  },
  getMember: function (params) {
    return MemberResource.get(params)
  },
  getMemberBalance: function (params) {
    return MemberBalanceResource.get(params)
  },
  getWts: function (params) {
    return WtsResource.get(params)
  },
  SaveCl: function (data) {
    return WtsResource.save({id: 'SaveCl'}, data)
  },
  SaveWts: function (data) {
    return WtsResource.save({id: 'SaveWts'}, data)
  },
  SaveNaire: function (data) {
    return NaireResource.save({id: 'SaveNaire'}, data)
  },
  GetNaire: function (params) {
    return NaireResource.get(params)
  },
  FillNaire: function (data) {
    return NaireResource.save({id: 'FillNaire'}, data)
  }
}
