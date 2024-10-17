import type { Models } from '../types'
import { Schema, model } from 'mongoose'
import { nanoId } from '../utils/index'

const schema: Schema = new Schema<Models.User>(
  {
    _id: {
      type: String,
      default: null
    },
    firstName: {
      type: String,
      required: true,
      trim: true
    },
    lastName: {
      type: String,
      required: false,
      trim: true,
      default: null
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true
    },
    password: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: false,
      trim: true,
      default: null
    },
    picture: {
      type: String,
      required: false,
      trim: true,
      default: null
    },
    role: {
      type: String,
      required: true,
      enum: ['super', 'admin', 'user']
    },
    verified: {
      type: Boolean,
      required: false,
      default: false
    },
    suspended: {
      type: Boolean,
      required: false,
      default: false
    },
    tokens: [
      {
        _id: false,
        type: {
          type: String,
          required: true,
          enum: ['login', 'verification', 'reset']
        },
        token: {
          type: String,
          required: true
        },
        metadata: {
          type: Map,
          of: String,
          required: false,
          default: {}
        },
        expireAt: {
          type: Date,
          required: true
        },
        createdAt: {
          type: Date,
          required: true
        }
      }
    ],
  },
  {
    timestamps: true
  }
)

schema.pre('save', async function (this, next) {
  if (!this._id) {
    this._id = await nanoId(8)
  }
  next()
})

const User = model<Models.User>('User', schema)
export default User
