export default class HelperProduct {
  static cleanerProduct (cont) {
    return {
      id: cont.id,
      title: cont.title,
      landing: cont.landing,
      logo: cont.logo,
      infoHeader: cont.info_header,
      infoBody: cont.info_body,
      url: cont.url,
      show: cont.to_show,
      enable: cont.enable
    }
  };
}
