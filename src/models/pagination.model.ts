import database from 'src/config/database'

const PaginationSchema = new database.Schema(
  {
    account: {
      type: String,
      required: true,
    },
    perPage: {
      type: Number,
      default: 10,
      required: true,
    },
    component: String,
    count: Number,
    pageNumber: Number,
    previous: database.Schema.Types.Mixed,
    next: database.Schema.Types.Mixed,
  },
  {
    timestamps: true,
  }
)

const PaginationModel = database.model('Pagination', PaginationSchema)

export default PaginationModel
