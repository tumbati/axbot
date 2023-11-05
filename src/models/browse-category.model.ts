import database from 'src/config/database'

const CategorySchema = new database.Schema({
  category_id: Number,
  category_name: String,
  parent: database.Schema.Types.Mixed,
  picture: database.Schema.Types.Mixed,
})

const BrowseCategorySchema = new database.Schema(
  {
    account: {
      type: String,
      required: true,
    },
    categories: [CategorySchema],
  },
  {
    timestamps: true,
  }
)

const BrowseCategoryModel = database.model('Browse_Category', BrowseCategorySchema)

export default BrowseCategoryModel
