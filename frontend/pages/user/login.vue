<template>
  <v-card>
    <v-card-title>{{ $t('Login') }}</v-card-title>
    <v-card-text>
      <v-text-field
          outlined
          v-model="login.email"
          :label="$t('Email')"
          :rules="rules"
      />
      <v-text-field
          outlined
          v-model="login.password"
          :label="$t('Password')"
          :rules="rules"
      />

    </v-card-text>
    <v-card-actions>
      <v-btn @click="submit" class="my-4">{{ $t('Send') }}</v-btn>
      <v-spacer/>
    </v-card-actions>

  </v-card>
</template>

<script>

export default {
  name: "login",
  auth: false,
  data() {
    return {
      valid: false,
      rules: [
        value => !!value || this.$t('Required'),
        //value => (value && value.length >= 3) || 'Min 3 characters',
      ],
      login: {
        email: 'user@test.com',
        password: '123',
      }
    }
  },
  computed: {
    user() {
      return this.$store.getters.getLoggedUser
    }
  },
  methods: {
    async submit() {
      await this.$auth.login({data:this.login}).catch(e=>console.log('Login problem', e))
      if(this.$store.getters.getLoggedUser)
        await this.$router.push(this.$store.getters.getLoginRedirect)
    }
  }
}
</script>

<style scoped lang="sass">
u
  cursor: pointer
</style>
