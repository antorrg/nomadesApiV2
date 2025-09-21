export default {
  id: {
    type: "string",
    sanitize: {
      trim: true,
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
