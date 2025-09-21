export default class LandingHelper {
  static landingParser (data) {
    return {
      id: data.id,
      image: data.image,
      title: data.title,
      info_header: data.info_header,
      description: data.description,
      enable: data.enable
    }
  }

  static dataEmptyLanding () {
    return {
      id: false,
      title: 'Pagina web con ejemplos ',
      info_header: 'Nomades web site.',
      image: 'https://img.freepik.com/fotos-premium/naturaleza-natural-paisajes-naturales_1417-70.jpg',
      description: 'Esta es una descripcion del producto mostrado hecha para exhibir el contenido de la pagina',
      enable: true
    }
  };
}
