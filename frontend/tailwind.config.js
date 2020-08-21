module.exports = {
  purge: [
    "src/**/*.js",
    "src/**/*.jsx",
    "src/**/*.ts",
    "src/**/*.tsx",
    "public/**/*.html",
  ],
  theme: {
    extend: {
      width: {
        "max-content": "max-content",
      },
      colors: {
        // https://coolors.co/fbfcff-274156-ee7674-8789c0-6b2737
        first: "#FBFCFF",
        second: "#274156",
        third: "#EE7674",
        fourth: "#8789c0",
        fifth: "#6B2737",
      },
    },
  },
  variants: {},
  plugins: [],
};
