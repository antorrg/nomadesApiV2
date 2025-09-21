export default {
  email: {
    type: "string",
    sanitize: {
      trim: true,
      escape: true,
    }
  },
  password: {
    type: "string",
    sanitize: {
      trim: true,
      escape: true,
    }
  }
};
