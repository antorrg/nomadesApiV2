export default class HelperProduct {
  static cleanerProduct (cont) {
    return {
      id: cont.id,
      title: cont.title,
      landing: cont.landing,
      info_header: cont.info_header,
      info_body: cont.info_body,
      enable: cont.enable
    }
  };

  static emptyProduct () {
    return {
      id: false,
      title: 'No hay datos aun',
      landing: 'No hay datos aun',
      info_header: 'No hay datos aun',
      info_body: 'No hay datos aun',
      enable: false
    }
  }
}
