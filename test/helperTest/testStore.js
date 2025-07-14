let userToken = ''
let adminToken = ''
let userId = ''
let adminId = ''

export const setUserToken = (newToken) => {
  userToken = newToken
}

export const getUserToken = () => {
  return userToken
}

export const setAdminToken = (newToken) => {
  adminToken = newToken
}

export const getAdminToken = () => {
  return adminToken
}

export const setId = (newid) => {
  userId = newid
}

export const getId = () => {
  return userId
}
export const setAdminId = (newId) => {
  adminId = newId
}

export const getAdminId = () => {
  return adminId
}
