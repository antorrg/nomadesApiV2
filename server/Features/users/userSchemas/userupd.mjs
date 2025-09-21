export default {
  email: {
    type: "string",
    sanitize: {
      trim: true,
      escape: true,
      lowercase: true
    }
  },
  given_name: {
    type: "string",
    sanitize: {
      trim: true,
      escape: true,
    }
  },
  picture: {
    type: "string",
    sanitize: {
      trim: true,
    }
  },
  country: {
    type: "string",
    sanitize: {
      trim: true,
      escape: true,
    }
  }
};
