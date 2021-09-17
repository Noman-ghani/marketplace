export default {
  mode: 'spa',
  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: false,
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'ServU Marketplace',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  loading: { color: '#3B8070' },

  env: {
    BASE_URL: process.env.BASE_URL,
    API_URL: process.env.API_URL,
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    '~/assets/css/_variables.scss',
    '~/assets/css/auth.scss',
    '~/assets/css/theme.scss'
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    './plugins/bootstrap/bootstrap-vue.js',
    './plugins/helpers/index.js',
    './plugins/v-mask/v-mask.js',
    './plugins/vee-validate/vee-validate.js',
    './plugins/vue-scroll-to/scroll-to.js',
    './plugins/slick/slick.js',
    './plugins/vue-screen/index.js',
    './plugins/axios/index.js',
  ],
  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    '@nuxtjs/dotenv'
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/bootstrap
    'bootstrap-vue/nuxt',
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    // https://go.nuxtjs.dev/pwa
    '@nuxtjs/pwa',

    '@nuxtjs/auth',

    '@nuxtjs/style-resources',

  ],

  styleResources: {
    scss: ['./assets/scss/*.scss']
  },

  auth: {
    // plugins: [ '~/plugins/auth.js' ],
    strategies: {
      local: {
          scheme: 'refresh',
          token: {
              property: 'access_token',
              maxAge: 6000 * 6000, // Just set this at 1 minute to try the auto refresh
              type: 'Bearer',
          },
          endpoints: {
              login: { url: '/auth/login', method: 'post', propertyName: 'token' },
              logout: false,
              user: { url: '/user', method: 'get'},
          },
          user: {
            property: false, // <--- Default "user"
            autoFetch: true
          },
      },
    },
  },

  // PWA module configuration: https://go.nuxtjs.dev/pwa
  pwa: {
    manifest: {
      lang: 'en'
    }
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    cssSourceMap: true,
    extractCSS: true,
    extend(config, ctx) {},
    loaders:  {
      vue: {
        prettify: false
      }
    },
  },
  
}
