export const create = {
  title: {
    type: "string",
  },
  type: {
    type: "string",
  },
  text: {
    type: "string",

  },
  url: {
    type: "string",

  },
   enable: {
    type: "boolean"
  }
};
export const update = {
  title: {
    type: "string",
    sanitize: {
      trim: true,

    }
  },
  type: {
    type: "string",
    sanitize: {
      trim: true,

    }
  },
  text: {
    type: "string",
    sanitize: {
      trim: true,
 
    }
  },
  url: {
    type: "string",
    sanitize: {
      trim: true,
    }
  },
  enable: {
    type: "boolean"
  }
};

