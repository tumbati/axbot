// Extend the global String interface to add custom methods
declare global {
  interface String {
    /**
     * Converts the string to lowercase.
     * @returns The lowercase version of the string.
     */
    lowercase(): string

    /**
     * Converts the string to uppercase.
     * @returns The uppercase version of the string.
     */
    uppercase(): string
  }
}

String.prototype.lowercase = function () {
  return this.toLowerCase()
}

String.prototype.uppercase = function () {
  return this.toUpperCase()
}
