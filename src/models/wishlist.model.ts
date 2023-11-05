import database from 'src/config/database'

const WishlistSchema = new database.Schema(
  {
    id: {
      type: String,
      required: true,
    },
    wishlistId: {
      type: String,
      required: true
    },
    account: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    discountPercentage: {
      type: Number,
      default: 0, // Set a default value if needed
    },
    rating: {
      type: Number,
      default: 0,
    },
    stock: {
      type: Number,
      required: true,
    },
    brand: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    thumbnail: {
      type: String,
      required: true,
    },
    images: {
      type: [String], // An array of image URLs
      required: true,
    },
  },
  {
    timestamps: true,
  }
)
const WishlistModel = database.model('Wishlist', WishlistSchema)

export default WishlistModel
