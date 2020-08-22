module.exports = {
  purge: ["./components/**/*.{js,ts,jsx,tsx}", "./pages/**/*.{js,ts,jsx,tsx}"],
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
