<template>
  <div>
    <v-row>
      <v-col cols="3">
        <v-list dense>
          <v-text-field label="Фильтр организаций" v-model="search"/>
          <v-list-item-group
              v-model="selectedItem"
              color="primary"
          >
            <v-list-item

                v-for="(item, i) in orgs.filter(l=>search ? l.organizationname.match(search) : l)"
                @click="loadUsers(item)"
                :key="i"
            >
              <v-list-item-content>
                <v-list-item-title class="text-wrap" v-text="item.organizationname"></v-list-item-title>
              </v-list-item-content>
              <v-list-item-action>
                {{ item.swusers.length }}
              </v-list-item-action>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-col>
      <v-col cols="3">
        <v-list dense  v-if="users.length">
          <v-text-field label="Фильтр юзеров" v-model="searchUser"/>
          <v-btn @click="copyToBuffer">Копировать в буфер</v-btn>
          <v-list-item-group
              v-model="userListItem"
              color="primary"
          >
            <v-list-item
                v-for="(item, i) in users.filter(l=>searchUser ? l.fullname.match(searchUser) : l)"
                @click="loadTickets(item)"
                :key="i"
            >
              <v-list-item-content>
                <v-list-item-title v-text="item.fullname"></v-list-item-title>
                <v-list-item-subtitle>
                  {{ item.phone }}
                  <div v-for="email of item.swuseremails.map(e=>e.email)" :key="email">
                    <a :href="`mailto:${email}`">{{ email }}</a>
                  </div>
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list-item-group>
        </v-list>
        <div id="users-list" style="display: none">
          <div
              v-for="(item, i) in users.filter(l=>searchUser ? l.fullname.match(searchUser) : l)"
              @click="loadTickets(item)"
              :key="i"
          >
            <div v-text="item.fullname"></div>
            <div>
              {{ item.phone }}
              <div v-for="email of item.swuseremails.map(e=>e.email)" :key="email">
                <a :href="`mailto:${email}`">{{ email }}</a>
              </div>
            </div>
          </div>
        </div>

      </v-col>
      <v-col>
        <v-data-table
            v-if="typeof userListItem !== 'undefined'"
            @click:row="handleClick"
            :headers="headers"
            :items="tickets"
            :items-per-page="15"
            class="row-pointer"
            style="cursor: pointer"
        >
          <template v-slot:no-data>
            Ни чего не найдено
          </template>
          <template v-slot:item.dateline="{ item }">
            {{ $fromUnixTimestamp(item.dateline) }}
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  name: "organisation",
  data() {
    return {
      selectedItem: null,
      search: null,
      searchUser: null,
      orgs: [],
      tickets: [],
      users: [],
      userListItem: null,
      headers: [
        {text: '#', value: 'ticketid'},
        {text: 'Дата', value: 'dateline', width: "110px"},
        {text: "Тема", value: 'subject'},
        {text: 'Имя', value: 'fullname'},
        //{text: "Посты", value: 'swticketposts', width: 90},
      ]
    }
  },
  created() {
    this.$axios.$get('/organisation/list')
        .then(data => {
          this.orgs = data;
        })
  },
  methods: {
    copyToBuffer(){
      const range = document.createRange();
      const element = document.getElementById("users-list")
      element.style.display = 'block';
      range.selectNode(element);
      console.log(range)
      window.getSelection().removeAllRanges(); // clear current selection
      window.getSelection().addRange(range); // to select text
      document.execCommand("copy");
      //window.getSelection().removeAllRanges();
      element.style.display = 'none';
    },
    handleClick(item) {
      //this.$router.push('/ticket/view/' + item.ticketid)
      window.open('/ticket/view/' + item.ticketid, '_blank');
    },
    loadUsers(e) {
      this.users = e.swusers
      this.$axios.$get('/ticket/organisation/' + e.userorganizationid)
          .then(data => {
            this.tickets = data;
          })
    },
    loadTickets(e) {
      this.$axios.$get('/ticket/users/' + e.userid)
          .then(data => {
            this.tickets = data;
          })

    }
  }
}
</script>

<style scoped>

</style>