<template>
  <div>
    <v-app-bar
        fixed
        app
    >
      <v-tabs :hide-slider="true">

        <v-tab to="/">
          {{$t('Kayako')}}
        </v-tab>
        <v-spacer></v-spacer>
        <v-tab to="/user/cabinet" v-if="user">
          {{$t('Cabinet')}}
        </v-tab>
        <v-tab @click="logout" v-if="user">
          {{$t('Logout')}}
        </v-tab>
        <v-tab to="/user/login" v-if="!user">
          {{$t('Login')}}
        </v-tab>
        <v-tab to="/user/signup" v-if="!user">
          {{$t('Sign up')}}
        </v-tab>
      </v-tabs>
      <v-menu offset-y>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
              icon
              v-bind="attrs"
              v-on="on"
          >
            <v-icon>mdi-earth</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item
              v-for="(item, index) in availableLocales"
              :key="index"
          >
            <v-list-item-title>
              <v-btn @click="switchLocale(item.code)">{{ item.name }}</v-btn>

            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>
  </div>
</template>

<script>

export default {
  name: "AppBar",
  data() {
    return {
      tab: 0,
      buildDate:'',
    }
  },
  computed: {
    availableLocales() {
      return this.$i18n.locales.filter(l => l.code !== this.$i18n.locale)
    },
    localeName() {
      const locale = this.$i18n.locales.find(l => l.code === this.$i18n.locale)
      return locale.name
    },
    user(){
      return this.$store.getters.getLoggedUser
    }
  },

  methods: {
    switchLocale(code) {
      this.$i18n.setLocale(code)
    },
    async logout() {
      this.$store.dispatch('auth/logout', this.login)
      this.$saveDefaultRedirect()
      await this.$router.push('/user/login');
    },

  }

}
</script>

<style scoped lang="sass">
small#build-date
  color: red
  font-size: .6em !important
</style>
