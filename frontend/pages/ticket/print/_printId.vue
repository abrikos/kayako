<template xmlns="http://www.w3.org/1999/html">
  <div v-bind:class="{ touch: touched}">
    <TicketView :ticket="ticket"/>
  </div>
</template>

<script>
import TicketView from "~/components/TicketView";

export default {
  name: "ticketPrint",
  layout:'print',
  components: {TicketView},
  data(){
    return {
      ticket: null,
      touched: null,
    }
  },
  computed: {
    id() {
      return this.$route.params.printId;
    }
  },
  created() {
    console.log('fffffff', process)
    if (process.browser) {
      window.onNuxtReady((app) => {
        console.log('Nuxt ready!zzzzzzzzzzzzzzzzzzzzzzzzzzzz')
      })
    }
    document.addEventListener('touchstart',this.touchStart);
    this.$axios.$get('/ticket/view/' + this.id)
        .then(data => {
          this.ticket = data;
          //window.print();
        })
  },
  methods:{
    touchStart(){
      console.log('zzzzzzzzzzzzz')
    }
  }
}
</script>

<style scoped lang="sass">
</style>