export const landCreate = {
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
  info_header: {
    type: "string",
    sanitize: {
      trim: true,
      escape: true,
    }
  },
   description: {
    type: "string",
    sanitize: {
      trim: true,
      escape: true,
    }
  }
};

export const landUpdate = {
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
  info_header: {
    type: "string",
    sanitize: {
      trim: true,
      escape: true,
    }
  },
   description: {
    type: "string",
    sanitize: {
      trim: true,
      escape: true,
    }
  },
     saver: {
    type: "boolean",
  },
     useImg: {
    type: "boolean",
  }
};
