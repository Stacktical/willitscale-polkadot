module.exports = {
  css: {
    loaderOptions: {
      sass: {
        data: `
            @import "@/style/bulma.variables.scss";
        `
      }
    }
  },
  devServer: {
    disableHostCheck: true
  }
};
