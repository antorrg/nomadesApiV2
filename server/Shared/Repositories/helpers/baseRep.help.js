export const createData = {

  title: 'Titulo de la landing',
  info_header: 'landing1',
  description: 'descripcion',
  image: 'https://metalogo.com.ar'
}
export const createSecondData = {
  title: 'Titulo de la landing2',
  info_header: 'landing1',
  description: 'descripcion',
  image: 'https://metalogo.com.ar'
}

export const cleanData = (data) => {
  return {
    id: data.id,
    title: data.title,
    image: data.image,
    description: data.description,
    enable: data.enable
  }
}
export const responseData = {
  id: 1,
  title: 'Titulo de la landing',
  image: 'https://metalogo.com.ar',
  description: 'descripcion',
  enable: true
}
export const responseData2 = [{
  id: 1,
  title: 'Titulo de la landing',
  image: 'https://metalogo.com.ar',
  description: 'descripcion',
  enable: true
},
{
  id: 2,
  title: 'Titulo de la landing2',
  image: 'https://metalogo.com.ar',
  description: 'descripcion',
  enable: false
}]
export const responseData3 = {
  id: 2,
  title: 'Titulo de la landing2',
  image: 'https://metalogo.com.ar',
  description: 'descripcion',
  enable: false
}
export const responseDataImg = {
  id: 1,
  title: 'Titulo de la landing',
  image: 'https://imagen.com.ar',
  description: 'descripcion',
  enable: true
}
export const responseUpdData = {
  id: 1,
  title: 'landing3',
  image: 'https://metalogo.com.ar',
  description: 'descripcion',
  enable: true
}
export const dataEmpty = {
  id: false,
  title: 'Titulo de la landing',
  image: 'https://metalogo.com.ar',
  description: 'descripcion',
  enable: true
}
