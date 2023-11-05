import database from 'src/config/database'

export const ProductSchema = new database.Schema({
  id: String,
  cacheId: {
    type: Number,
    required: true,
  },
  account: {
    type: String,
    required: true,
  },
  product_id: Number,
  category: {
    category_id: Number,
    category_name: String,
    parent: Number,
    picture: String,
  },
  sub_category: {
    category_id: Number,
    category_name: String,
    parent: Number,
    picture: String,
  },
  rating: database.Schema.Types.Mixed,
  rating_count: Number,
  images: [
    {
      image_id: Number,
      created: String,
      modified: String,
      voided: Boolean,
      voidedby: database.Schema.Types.Mixed,
      voided_reason: database.Schema.Types.Mixed,
      voided_remarks: database.Schema.Types.Mixed,
      name: String,
      image: String,
      product: Number,
    },
  ],
  promo: database.Schema.Types.Mixed,
  discount: database.Schema.Types.Mixed,
  attributes: [database.Schema.Types.Mixed],
  created: String,
  modified: String,
  voided: Boolean,
  voidedby: database.Schema.Types.Mixed,
  voided_reason: database.Schema.Types.Mixed,
  voided_remarks: database.Schema.Types.Mixed,
  sku: database.Schema.Types.Mixed,
  name: String,
  description: String,
  brand: String,
  delivery_method: String,
  unit_price: String,
  quantity_per_unit: Number,
  in_stock: Boolean,
  low_stock_warning: Number,
  quantity: Number,
  vendor: Number,
})

const ProductModel = database.model('Product', ProductSchema)

export default ProductModel
