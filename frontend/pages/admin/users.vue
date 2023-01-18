<template>
  <div>
    <v-row>
      <v-col><v-text-field v-model="email" placeholder="email"/></v-col>
      <v-col><v-text-field v-model="password" placeholder="пароль"/></v-col>
      <v-col><v-btn @click="createUser">Создать юзера</v-btn> </v-col>
    </v-row>


    <v-data-table
        :headers="headers"
        :items="users"
        :items-per-page="15"
        class="row-pointer"
        style="cursor: pointer"
    >
      <template v-slot:no-data>
        Ни чего не найдено
      </template>
      <template v-slot:item.description="{ item }">
        {{ item.component.description }}
      </template>
      <template v-slot:item.controls="{item}">
        <v-btn @click="chPassword(item)" small>Сменить пароль</v-btn>
        <v-btn class="mx-2" small :color="item.isAdmin ? 'red' : 'silver' " @click="switchRole(item)">
          {{ item.isAdmin ? 'Revoke admin' : 'Make admin' }}
        </v-btn>
        <v-btn class="mx-2" small :color="item.blocked ? 'warning' : 'silver' " @click="block(item)">
          {{ item.blocked ? 'Заблокирован' : 'Блокировать' }}
        </v-btn>
        <v-btn class="mx-2" small @click="deleteUser(item)">
          Удалить
        </v-btn>
      </template>
      <template v-slot:header="props">
        <tr>
          <td>
            <v-text-field
                hide-details
                label="Фильтр e-mail"
                outlined flat dense class="table-filter"
                v-model="filter"
            />
          </td>
          <td></td>
          <td>
            <v-radio-group
                dense
                v-model="userFilter"
                row
            >
              <v-radio
                  label="Все"
                  value="all"
              />
              <v-radio
                  label="Заблокированные"
                  value="blocked"
              />
              <v-radio
                  label="Не заблокированные"
                  value="valid"
              />
              <v-radio
                  label="Админы"
                  value="admin"
              />
            </v-radio-group>
          </td>
        </tr>
      </template>
    </v-data-table>
  </div>
</template>

<script>
export default {
  name: "users",
  data() {
    return {
      email:'',
      password:'',
      filter:'',
      userFilter:'all',
      usersFound: [],
      headers: [
        {text: 'e-mail', value: 'email'},
        {text: 'Зарегистрирован', value: 'createdAt'},
        {text: '', value: 'controls'},
      ]
    }
  },
  computed:{
    users(){
      return this.usersFound
          .filter(u=>u.email ? u.email.match(this.filter) : true)
          .filter(u=>this.userFilter ==='all' ? true : this.userFilter==='admin' ? u.isAdmin : this.userFilter==='blocked' ? u.blocked : !u.blocked )
    }
  },
  created() {
    this.reloadList()
  },
  methods: {
    async chPassword(user){
      const password = window.prompt('Новый пароль для ' + user.email)
      if(!password) return
      await this.$axios.$post(`/admin/user/${user.useremailid}/change-password`, { password} )
    },
    async createUser(){
      await this.$axios.$post('/admin/user/create', {email:this.email, password: this.password} )
      this.email = this.password = ''
      await this.reloadList()
    },
    async reloadList() {
      this.usersFound = await this.$axios.$get('/admin/users')

    },
    handleClick(e) {
      console.log(e)
    },
    switchRole(user) {
      this.$axios.$get('/admin/switch-role/' + user.useremailid)
          .then(this.reloadList)
    },
    block(user) {
      this.$axios.$get(`/admin/user/${user.useremailid}/block`)
          .then(this.reloadList)
    },
    deleteUser(user) {
      if(!confirm(`Удалить пользователя ${user.email}`)) return
      this.$axios.$get(`/admin/user/${user.useremailid}/delete`)
          .then(this.reloadList)
    }
  }
}
</script>

<style scoped>

</style>