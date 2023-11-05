declare global {
  interface Array<T> {
    /**
     * Array.prototype.first - Custom extension method for arrays.
     *
     * This method retrieves the first element of the array.
     *
     * @returns The first element of the array or undefined if the array is empty.
     */
    first: T | undefined

    /**
     * Array.prototype.last - Custom extension method for arrays.
     *
     * This method retrieves the last element of the array.
     *
     * @returns The last element of the array or undefined if the array is empty.
     */
    last: T | undefined

    /**
     * Array.prototype.size - Custom extension property for arrays.
     *
     * This property retrieves the number of elements in the array.
     */
    size: number
  }
}

Object.defineProperty(Array.prototype, 'first', {
  get: function () {
    return this[0]
  },
  enumerable: false,
  configurable: false,
})

Object.defineProperty(Array.prototype, 'last', {
  get: function () {
    return this.length > 0 ? this[this.length - 1] : undefined
  },
  enumerable: false,
  configurable: false,
})

Object.defineProperty(Array.prototype, 'size', {
  get: function () {
    return this.length
  },
  enumerable: false,
  configurable: false,
})
