export const create = {
  title: {
    type: "string",
    sanitize: {
      trim: true,
      escape: true,
    }
  },
  image: {
    type: "string",
    sanitize: {
      trim: true,
    }
  },
  text: {
    type: "string",
    sanitize: {
      trim: true,
      escape: true,
    }
  },
  useImg: {
    type: "boolean"
  }
};
export const update = {
  title: {
    type: "string",
    sanitize: {
      trim: true,
      escape: true,
    }
  },
  image: {
    type: "string",
    sanitize: {
      trim: true,
    }
  },
  text: {
    type: "string",
    sanitize: {
      trim: true,
      escape: true,
    }
  },
  useImg: {
    type: "boolean"
  },
   enable: {
    type: "boolean"
  },
   saver: {
    type: "boolean"
  }
};