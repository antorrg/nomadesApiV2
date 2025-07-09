export const userCreate = [{ name: 'email', type: 'string' }]
export const userLogin = [{ name: 'email', type: 'string' }, { name: 'password', type: 'string' }]
export const userUpd = [{ name: 'email', type: 'string' }, { name: 'given_name', type: 'string' }, { name: 'picture', type: 'string' }, { name: 'country', type: 'string' }]
export const userUpgrade = [{ name: 'role', type: 'string' }, { name: 'enable', type: 'boolean' }]
export const changePassword = [{ name: 'password', type: 'string' }]
export const verifyPassword = [{ name: 'id', type: 'string' }, { name: 'password', type: 'string' }]
export const email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
export const password = /^(?=.*[A-Z]).{8,}$/
export const uuid = /^[0-9a-fA-F]{8}-([0-9a-fA-F]{4}-){3}[0-9a-fA-F]{12}$/ // Formato flexible sin versionado
export const uuidv4 = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/
