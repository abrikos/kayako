<template>
  <v-app>
    <v-app-bar
        fixed
        app
    >
      <v-tabs v-model="tab">
        <v-tab to="/" v-if="user">
          Поиск
        </v-tab>
        <v-tab to="/organisation" v-if="user">
          Организации
        </v-tab>
        <v-tab to="/article" v-if="user">
          Статьи
        </v-tab>
        <v-tabs-slider color="pink"></v-tabs-slider>
      </v-tabs>
      <v-spacer></v-spacer>
      <v-btn icon @click="switchTheme">
        <v-icon>mdi-theme-light-dark</v-icon>
      </v-btn>
      <v-btn v-if="!user" to="/user/login">Вход</v-btn>
      <v-btn v-if="user" @click="logout">Выход</v-btn>
    </v-app-bar>
    <v-main>
      <v-container>
      <nuxt/>
      </v-container>
    </v-main>
    <SnackBar/>
  </v-app>
</template>

<script>


export default {
  data(){
    return {
      tab: ''
    }
  },
  computed: {
    user() {
      return this.$store.getters.getLoggedUser
    }
  },
  methods:{
    switchTheme(){
      this.$vuetify.theme.isDark = !this.$vuetify.theme.isDark;
      localStorage.setItem('themeDark', this.$vuetify.theme.isDark)
    },
    logout() {
      this.$auth.logout()
      this.$router.push('/user/login')
    },

  },
  created() {
    this.$vuetify.theme.isDark = JSON.parse(localStorage.getItem('themeDark'))
    //this.$axios.$get('/build-date')        .then(res => this.buildDate = res.ctime)
    //this.$store.dispatch('auth/getUser')
  }
}
</script>

<style lang="sass">
h1
  border-bottom: 1px solid silver
  margin-bottom: 10px
</style>
