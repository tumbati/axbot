import database from 'src/config/database';

export const ProductSchema = new database.Schema({
  id: { type: Number, required: true },
  cacheId: { type: Number, required: true },
  account: { type: String, required: true },
  title: { type: String, required: true },
  description: String,
  price: Number,
  discountPercentage: Number,
  rating: Number,
  stock: Number,
  brand: String,
  category: String,
  thumbnail: String,
  images: [String],
});

const ProductModel = database.model('Product', ProductSchema);

export default ProductModel;