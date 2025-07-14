export class WorkHelp {
  static cleaner (data) {
    return {
      id: data.id,
      title: data.title,
      image: data.image,
      text: data.text,
      enable: data.enable
    }
  }

  static dataEmptyWork () {
    return {
      id: false,
      title: 'aun no hay datos',
      image: 'aun no hay datos',
      text: 'aun no hay datos',
      enable: true
    }
  }
}
