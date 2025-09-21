export const helmetMainConfig = {
  contentSecurityPolicy: {
    directives: {
      defaultSrc: [
        "'self'",
        'https://res.cloudinary.com',
        'https://www.youtube.com',
        'https://www.instagram.com',
        'https://www.facebook.com'
      ],
      scriptSrc: ["'self'", "'unsafe-inline'", 'https://example.com'],
      styleSrc: ["'self'", "'unsafe-inline'", 'https://example.com'],
      imgSrc: [
        "'self'",
        'data:',
        'https://res.cloudinary.com' // Permite Cloudinary
      ],
      connectSrc: ["'self'"],
      fontSrc: ["'self'", 'data:', 'https://res.cloudinary.com'],
      objectSrc: ["'none'"], // Desactiva objetos (Flash, etc.)
      upgradeInsecureRequests: [], // Fuerza HTTPS
      frameAncestors: ["'none'"], // Esto impide que OTROS sitios te embezan
      frameSrc: [
        'https://www.youtube.com',
        'https://www.instagram.com',
        'https://www.facebook.com'
      ]
    }
  }
}
