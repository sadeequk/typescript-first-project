


export namespace Models {
  type Token = {
    type: 'login' | 'verification' | 'reset'
    token: string
    metadata?: KeyValuePair<string>
    expireAt: Date
    createdAt: Date
  }

  type User = {
    _id: string
    firstName: string
    lastName: string | null
    email: string
    password: string
    phone: string | null
    picture: string | null
    role: 'super' | 'admin' | 'user'
    verified: boolean
    suspended: boolean
    tokens: Token[]
    stripe: {
      id: string | null
    }
    createdAt: Date
    updatedAt: Date
  }}

  type ControllerError = {
  name: string
  code: number
  message: string
  fileName?: string
  lineNumber?: string
}