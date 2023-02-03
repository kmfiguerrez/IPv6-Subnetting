const purgecss = require('@fullhuman/postcss-purgecss');

module.exports = {
    plugins: [
      [
        purgecss({
            content: ['./**/*.html'],
            safelist: {
              standard: [
                /offcanvas/, /modal/, /alert/, /popover/, /valid/, /collapsing/, /tooltip/, 
                /visible/, /invisible/, /border-success/
              ],
              deep: [/offcanvas/, /modal/, /popover/, /tooltip/],
              greedy: [/popover$/]              
            }           
        })
      ],
    ],
  };