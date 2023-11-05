import database from 'src/config/database'

export interface IFaq {
  creator: string
  question: string
  answer: string
}

const FaqSchema = new database.Schema(
  {
    question: String,
    answer: String,
    creator: String
  },
  {
    timestamps: true,
  }
)

const FaqModel = database.model('Faq', FaqSchema)

export default FaqModel
