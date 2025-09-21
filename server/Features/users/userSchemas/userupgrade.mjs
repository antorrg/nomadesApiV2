export default {
  role: {
    type: "string",
    sanitize: {
      trim: true,
      escape: true,
    }
  },
  enable: {
    type: "boolean"
  }
};
