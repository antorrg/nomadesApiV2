export default class HelperItem {
  static emptyItem () {
    return {
      id: 0,
      img: 'Not found',
      text: 'No data yet.',
      ProductId: 0,
      enable: true
    }
  }

  static itemCleaner (data, allText) {
    const trunc = allText ? data.text : truncateText(data.text, 12)
    return {
      id: data.id,
      img: data.img,
      text: trunc,
      ProductId: data.ProductId,
      enable: data.enable
    }
  }
}
function truncateText (text, wordLimit = 10) {
  const words = text.split(' ') // Ejemplo de uso
  if (words.length <= wordLimit) { //   const text = "Texto de ejemplo";
    return text
  } //   const ejemplo = truncateText(text, 12);
  const truncatedWords = words.slice(0, wordLimit)
  return truncatedWords.join(' ') + '...'
}
