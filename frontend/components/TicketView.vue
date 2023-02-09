<template>
  <v-card v-if="ticket">
    <v-card-title>
      {{ ticket.ticketid }}: {{ ticket.subject }}
    </v-card-title>
    <v-card-subtitle>
      <strong>Департамент:</strong> {{ ticket.swdepartment.title }} <br/>
      <strong>Устройство:</strong> {{ ticket.swcustomfieldvalue?.fieldvalue }} <br/>
      <strong>Ответственный:</strong> {{ ticket.ownerstaffname }} <br/>
      <strong>Тип:</strong> {{ ticket.swtickettype.title }} <br/>
      <strong>Статус:</strong> {{ ticket.swticketstatus.title }} <br/>
      <strong>Приоритет:</strong> {{ ticket.swticketpriority.title }} <br/>
      <strong>Дата:</strong> {{ $fromUnixTimestamp(ticket.dateline) }} <br/>
    </v-card-subtitle>
    <hr/>
    <v-card-text>
      <h4>Сообщения</h4>
      <v-row v-for="post of ticket.swticketposts" :key="post.ticketpostid" class="post">
        <v-col>
          <strong>{{ post.ticketpostid }}</strong>
          {{ $fromUnixTimestamp(post.dateline) }}
          <strong>{{ post.fullname }}</strong>
          <a :href="`mailto:${post.email}`">{{ post.email }}</a>
          <br/>
          <div v-if="post.subject">
            Subject:
            <strong>
              {{ post.subject }}
            </strong>
          </div>
          <span v-html="post.contents.replaceAll('\n', '<br/>')"></span>
        </v-col>
        <v-col>
          <img v-for="file of ticket.swattachments.filter(a=>a.linktypeid===post.ticketpostid)" :key="file.attachmentid"
               v-if="file.filetype.match('image')"
               :src="`/files/${file.storefilename}.png`" width="300"/>
          <div v-for="file of ticket.swattachments.filter(a=>a.linktypeid===post.ticketpostid)" :key="file.attachmentid"
               v-if="!file.filetype.match('image')"
               class="link" @click="saveFile(`/files/${file.storefilename}`, file.filename)">{{ file.filename }}
          </div>
        </v-col>
      </v-row>


    </v-card-text>
  </v-card>
</template>

<script>
import moment from "moment"

export default {
  name: "TicketView",
  props:['ticket'],

  methods: {
    saveFile(url, filename) {
      const xhr = new XMLHttpRequest();
      xhr.open("GET", url);
      xhr.responseType = "blob";
      xhr.overrideMimeType("octet/stream");
      xhr.onload = function () {
        if (xhr.status === 200) {
          const blob = xhr.response
          const url = URL.createObjectURL(blob);

          // Create a new anchor element
          const a = document.createElement('a');

          // Set the href and download attributes for the anchor element
          // You can optionally set other attributes like `title`, etc
          // Especially, if the anchor element will be attached to the DOM
          a.href = url;
          a.download = filename || 'download';

          // Click handler that releases the object URL after the element has been clicked
          // This is required for one-off downloads of the blob content
          const clickHandler = () => {
            setTimeout(() => {
              URL.revokeObjectURL(url);
              this.removeEventListener('click', clickHandler);
            }, 150);
          };

          // Add the click event listener on the anchor element
          // Comment out this line if you don't want a one-off download of the blob content
          a.addEventListener('click', clickHandler, false);

          // Programmatically trigger a click on the anchor element
          // Useful if you want the download to happen automatically
          // Without attaching the anchor element to the DOM
          // Comment out this line if you don't want an automatic download of the blob content
          a.click();
          //window.location = (URL || webkitURL).createObjectURL(xhr.response);
        }
      };
      xhr.send();
    }
  }
}
</script>

<style scoped lang="sass">
.link
  text-decoration: underline
  cursor: pointer
  color: #1976d2

.post
  margin-bottom: 10px
  padding: 5px
  border-bottom: 1px solid silver
</style>