<template xmlns="http://www.w3.org/1999/html">
  <div v-if="ticket">
    <a @click="$router.go(-1)">Назад</a>
    <v-btn @click="print" class="np-btn" v-if="ticket.swticketposts.length >50">Print as PDF </v-btn>
    <div v-else>
      <v-btn @click="generatePDF()" class="np-btn">Generate PDF</v-btn>
      <vue-html2pdf
          :show-layout="false"
          :float-layout="true"
          :enable-download="true"
          :preview-modal="false"
          :paginate-elements-by-height="100400"
          :filename="`ticket-${$route.params.pathMatch}`"
          :pdf-quality="2"
          :manual-pagination="false"
          pdf-format="a4"
          :pdf-margin="10"
          pdf-orientation="portrait"
          pdf-content-width="800px"
          @progress="onProgress($event)"
          ref="html2Pdf"
      >
        <TicketView slot="pdf-content" :ticket="ticket"/>
      </vue-html2pdf>
    </div>
    <TicketView :ticket="ticket"/>
  </div>
</template>

<script>
import TicketView from "~/components/TicketView";
import VueHtml2pdf from "vue-html2pdf";

export default {
  name: "viewId",
  components: {TicketView, VueHtml2pdf},
  data() {
    return {
      ticket: null
    }
  },
  computed: {
    id() {
      return this.$route.params.viewId;
    }
  },
  created() {
    this.$axios.$get('/ticket/view/' + this.id)
        .then(data => {
          this.ticket = data;
        })
  },
  methods: {
    print() {
      window.print()
    },
    onProgress(event) {
      console.log(`Processed: ${event} / 100`);
    },
    hasGenerated() {
      alert("PDF generated successfully!");
    },
    generatePDF() {
      this.$refs.html2Pdf.generatePdf();
    },
  },

}
</script>

<style scoped lang="sass">
</style>