import database from 'src/config/database'

const AccountSchema = new database.Schema({
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
    unique: true,
  },
  address: {
    type: String,
    required: true,
  },
})

const AccountModel = database.model('Account', AccountSchema)

export default AccountModel
