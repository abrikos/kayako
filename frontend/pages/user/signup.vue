<template>
  <v-form
      ref="form"
      v-model="valid"
      lazy-validation
  >

    <v-card>
      <v-card-title>{{ $t('Sign up') }}</v-card-title>
      <v-card-text>
        <v-text-field v-model="form.email" :label="$t('Email')" outlined :rules="emailRules"/>
        <v-text-field v-model="form.password" type="password" :label="$t('Password')" outlined :rules="passwordRules"/>
        <v-text-field v-model="form.passwordConfirm" type="password" :label="$t('Confirm password')" outlined :rules="passwordRules"/>
      </v-card-text>
      <v-card-actions>
        <v-btn @click="registration">{{ $t('Send') }}</v-btn>
<!--        <v-btn @click="rnd">Random11</v-btn>-->
      </v-card-actions>
    </v-card>
  </v-form>
</template>

<script>

export default {
  name: "SignUp",
  auth: false,
  data() {
    return {
      valid: false,
      error: '',
      emailRules: [
        value => !!value || this.$t('Required'),
        v => !v || /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || this.$t('E-mail must be valid')
      ],
      passwordRules:[
          v => this.form.password === this.form.passwordConfirm || this.$t('Passwords do not match')
      ],
      form: {
        email:'abrikoz@gmail.com',
        password:'1',
        passwordConfirm:'1',
      },
    }
  },
  methods: {
    async registration() {
      if(!this.$refs.form.validate()) return      console.log('Not valid')
      this.$store.dispatch('auth/signup', this.form)
        .then(()=> {
          this.$router.push(this.$store.getters.getLoginRedirect)
        })
    },
    rnd() {
      this.form.username = Math.random();
      this.form.email = Math.random() + '@aaa.com';
      this.form.password = '123';
      this.form.passwordConfirm = '123';
      this.error = this.form.username;
    },
  }
}
</script>

<style scoped>
</style>
