export default {
  email: {
    type: "string",
    sanitize: {
      trim: true,
      escape: true,
      lowercase: true
    }
  }
};
