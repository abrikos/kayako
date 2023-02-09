import colors from 'vuetify/es5/util/colors'
const isDev = process.env.NODE_ENV !== 'production'
require('dotenv').config();

export default {
  //loading: '~/components/LoadingBar.vue',
  loading: {
    continuous: true,
    color: 'orange',
    height: '10px'
  },
  ssr: false,
  target: 'static',
  // Global page headers: https://go.nuxtjs.dev/config-head
  router: {
    middleware: ['auth'],
    extendRoutes(routes, resolve) {
      routes.push(
          {
            name: 'articleView',
            path: '/article/view/*',
            component: resolve(__dirname, 'pages/article-view.vue'),
          },
          {
            name: 'ticketViewPdf',
            path: '/ticket/viewpdf/*',
            component: resolve(__dirname, 'pages/ticket/viewpdf.vue'),
          },
          {
            name: 'search',
            path: '/search/*',
            component: resolve(__dirname, 'pages/search.vue'),
          },
          {
            name: 'search',
            path: '/search',
            component: resolve(__dirname, 'pages/search.vue'),
          },
      )
    }
  },
  head: {
    title: 'Kayako',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      {charset: 'utf-8'},
      {name: 'viewport', content: 'width=device-width, initial-scale=1'},
      {hid: 'description', name: 'description', content: ''},
      {name: 'format-detection', content: 'telephone=no'}
    ],
    link: [
      {rel: 'icon', type: 'image/x-icon', href: '/favicon.ico'}
    ],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '~/plugins/common',
    '~/plugins/axios',
    //'~/plugins/websocket',
    '~/plugins/redirection',
    '~/plugins/vuex-persistedstate',
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    '@nuxtjs/vuetify',
  ],
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: false,
      themes: {
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3
        }
      }
    }
  },  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/i18n',
    '@nuxtjs/auth-next',
    'cookie-universal-nuxt',
  ],
  auth:{
    strategies: {
      local: {
        scheme: 'refresh',
        token: {
          property: 'access_token2222',
          maxAge: 1800,
          global: true,
          // type: 'Bearer'
        },
        refreshToken: {
          property: 'refresh_token3333',
          data: 'refresh_token',
          maxAge: 60 * 60 * 24 * 30
        },
        user: {
          property: ''
        },
        endpoints: {
          login: { url: '/auth/login', method: 'post' },
          refresh: { url: '/auth/refresh', method: 'post' },
          logout: { url: '/auth/logout', method: 'post' },
          user: { url: '/auth/user', method: 'get' }
        }
      },
    },
    redirect: {
      login: "/user/login",//this example of the path of login page in your project
      logout: "/user/login", //this will redirect to your home after logout
      home: "/cabinet/settings222", //this example will redirect to the path of user account page in your project.
      callback: '/zzz/login',
    }
  },
  i18n: {
    locales: [
      {
        code: 'en',
        file: 'en.js',
        name: 'English'
      },
      {
        code: 'ru',
        name: 'Русский',
        file: 'ru.js',
      }
    ],
    strategy: 'no_prefix',
    defaultLocale: 'en',
    lazy: true,
    langDir: 'lang/',
  },
  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    baseURL: "/api",
  },
  publicRuntimeConfig: {
    apiPort: process.env.API_PORT,
    googleId: process.env.GOOGLE_ID
  },
  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {}
}
