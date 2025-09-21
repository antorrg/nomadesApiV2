export const create = {
  title: {
    type: "string",
    sanitize: {
      trim: true,
      escape: true
    }
  },
  landing: {
    type: "string",
    sanitize: {
      trim: true
    }
  },
  info_header: {
    type: "string",
    sanitize: {
      trim: true,
      escape: true
    }
  },
  info_body: {
    type: "string",
    sanitize: {
      trim: true,
      escape: true
    }
  },
  useImg: {
    type: "boolean"
  },
  items: [{
    img: {type: "string"},
    text: {type: "string"}
  }]
};

export const update = {
  title: {
    type: "string",
    sanitize: {
      trim: true,
      escape: true
    }
  },
  landing: {
    type: "string",
    sanitize: {
      trim: true
    }
  },
  info_header: {
    type: "string",
    sanitize: {
      trim: true,
      escape: true
    }
  },
  info_body: {
    type: "string",
    sanitize: {
      trim: true,
      escape: true
    }
  },
  enable: {
    type: "boolean",
  },
  useImg: {
    type: "boolean"
  },
  saver: {
    type: "boolean"
  }
};
