<template>
  <v-card>
    <v-form @submit="goToSearch" v-on:submit.prevent>
      <v-card-text>
        <v-row>
          <v-col
              md="4"
          >
            <v-text-field
                v-model="form.ticketid"
                @keydown.enter="goToSearch"
                label="Номер тикета"
                outlined
            />
          </v-col
          >
          <v-col
                 md="4">
            <v-text-field
                v-model="form.text"
                @keydown.enter="goToSearch"
                label="Текст"
                outlined
            />
          </v-col>
          <v-col
                 md="4">
            <v-text-field
                v-model="form.textAttach"
                @keydown.enter="goToSearch"
                label="Название вложения"
                outlined
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-text-field
                v-model="form.email"
                @keydown.enter="goToSearch"
                label="Email"
                outlined
            />
          </v-col>
          <v-col>
            <v-select
                v-model="form.department"
                :items="departments"
                @keydown.enter="goToSearch"
                label="Департамент"
                outlined
            />
          </v-col>
          <v-col>
            <v-text-field
                v-model="form.model"
                @keydown.enter="goToSearch"
                label="Устройство"
                outlined
            />
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-btn type="submit" color="primary">Поиск</v-btn>
        <v-spacer/>
        <v-btn @click="clear" color="warning">Сбросить</v-btn>
      </v-card-actions>
      <TicketsList :form="form"/>
    </v-form>
  </v-card>

</template>

<script>

import TicketsList from "~/components/TicketsList";

export default {
  components: {TicketsList},
  data() {
    return {
      form: {},
      list: [],
      departments: []
    }
  },

  methods: {
    clear() {
      this.form = {}
      this.$router.push('/')
    },
    goToSearch() {
      let path = '/search'
      Object.keys(this.form).forEach(key => (path += this.form[key] ? `/${key}/${this.form[key]}` : ''));
      this.$router.push(path)
    }
  },
  created() {
    this.$axios.$get('/departments/list')
        .then(res => {
          this.departments = [''].concat(res);
        });
    if (!this.$route.params.pathMatch) return;
    const path = this.$route.params.pathMatch.split('/');
    for (let i = 0; i < path.length; i += 2) {
      this.form[path[i]] = path[i + 1]
    }
  },
}
</script>
