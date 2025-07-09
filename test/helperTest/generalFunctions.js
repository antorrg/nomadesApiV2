const throwError = (message, status) => {
  const error = new Error(message)
  error.status = status
  throw error
}
export class MockDeleteImagesTrue {
  static #saveImageInDb = async (url) => {
    return {
      success: true,
      message: `ImageUrl ${url} saved succesfully`
    }
  }

  static #deletFunctionTrue = (url) => {
  // console.log('probando deleteFunction: ', url);
    return {
      success: true,
      message: `ImageUrl ${url} deleted succesfully`
    }
  }

  static oldImagesHandler = (imageUrl, isRedirect) => {
    return isRedirect ? this.#saveImageInDb(imageUrl) : this.#deletFunctionTrue(imageUrl)
  }

  static deleteImageFromDb = async (url) => {
    return {
      success: true,
      message: `ImageUrl ${url} deleted from db succesfully`
    }
  }
}
export class MockDeleteImagesFalse {
  static #saveImageInDb = async (url) => {
    throwError(`Error saving ImageUrl: ${url}`, 500)
  }

  static #deletFunctionTrue = (url) => {
    throwError(`Error deleting ImageUrl: ${url}`, 500)
  }

  static oldImagesHandler = (imageUrl, isRedirect) => {
    return isRedirect ? this.#saveImageInDb(imageUrl) : this.#deletFunctionTrue(imageUrl)
  }

  static deleteImageFromDb = async (url) => {
    throwError(`Error deleting from db ImageUrl: ${url}`, 500)
  }
}
