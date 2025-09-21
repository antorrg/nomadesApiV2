export default {
  password: {
    type: "string",
    sanitize: {
      trim: true,
      escape: true,
    }
  }
};
