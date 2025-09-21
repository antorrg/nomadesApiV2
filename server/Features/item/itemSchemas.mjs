export const itemCreate = {
  text: {
    type: "string",
    sanitize: {
      trim: true,
      escape: true,
    }
  },
  img: {
    type: "string",
    sanitize: {
      trim: true,
    }
  },
  ProductId: {
    type: "int"
  },
  useImg: {
    type: "boolean"
  }
};
export const itemUpdate = {
  text: {
    type: "string",
    sanitize: {
      trim: true,
      escape: true,
    }
  },
  img: {
    type: "string",
    sanitize: {
      trim: true,
    }
  },
  enable: {
    type: "boolean"
  },
  saver: {
    type: "boolean"
  },
  useImg: {
    type: "boolean"
  }
};
