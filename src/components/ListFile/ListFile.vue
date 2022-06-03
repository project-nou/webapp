<template>
  <div class="list_file_content">
    <!-- PDF FILE -->
    <v-row class="mt-6">
      <div class="file_content">
        <div v-for="file in filesPdf" :key="file.note_id" class="mr-4 pa-2 one_file_content">
          <p class="title_file">{{ file.filename }}</p>
          <v-img
            src="@/assets/icons/pdf-file.png"
            class="img_file"
            height="60"
            width="40"/>
          <!-- Action -->
          <div class="file_action">
            <v-btn
              class="btn_action_download"
              icon
              @click="downloadFile(file.url, file.filename)">
              <v-icon small>
                mdi-download
              </v-icon>
            </v-btn>
            <v-btn
              class="btn_action_delete"
              icon
              @click="deleteFile(file.id, 'pdf')">
              <v-icon small>
                mdi-delete-outline
              </v-icon>
            </v-btn>
          </div>
        </div>
      </div>
    </v-row>
    <!-- IMAGE FILE -->
    <v-row class="mt-6">
      <div class="file_content">
        <div v-for="file in filesImage" :key="file.note_id" class="mr-4 pa-2 one_file_content">
          <p class="title_file">{{ file.filename }}</p>
          <v-img
            lazy-src="@/assets/icons/picture.png"
            :src="file.url"
            class="img_file"
            height="60"
            width="60"/>
          <!-- Action -->
          <div class="file_action">
            <v-btn
              class="btn_action_download"
              icon
              @click="downloadFile(file.url, file.filename)">
              <v-icon small>
                mdi-download
              </v-icon>
            </v-btn>
            <v-btn
              class="btn_action_delete"
              icon
              @click="deleteFile(file.id, 'img')">
              <v-icon small>
                mdi-delete-outline
              </v-icon>
            </v-btn>
          </div>
        </div>
      </div>
    </v-row>
  </div>
</template>

<script>
import "./ListFile.css";
import axios from 'axios';

export default {
  name: "ListFile",
  props: {
    groupData: {
      type: Array,
      required: true,
    },
  },
  data(){
    return{
      group : this.groupData,
      filesImage: [],
      filesPdf: [],
    }
  },
  mounted() {
    // this.getAllNotesText();
    this.getAllNotesFile();
  },
  methods : {
    // Get file type : IMAGE / PDF
    getAllNotesFile() {
      axios.get('http://localhost:8000/notes/' + this.$route.params.id + '/file')
        .then((response) => {
          response.data.notes.forEach(el => {
            let extensionFiles = el.content.split('.').pop();
            let fileInformation = {
              filename: el.content,
              id: el.note_id,
              author: el.author,
              url: 'https://res.cloudinary.com/doekqrsf4/image/upload/v1644856207/' + this.group[0].name + '/' + this.group[0].id + '/' + el.content
            }
            // Push to different array (unshift -> add value to the first position in array)
            if (extensionFiles !== 'pdf') {
              this.filesImage.unshift(fileInformation);
            } else {
              this.filesPdf.unshift(fileInformation);
            }
          });
        });
    },
    downloadFile(url, filename) {
      axios({
        url: url,
        method: 'GET',
        responseType: 'blob',
      })
        .then((response) => {
          let fileURL = window.URL.createObjectURL(new Blob([response.data]));
          let fURL = document.createElement('a');
          fURL.href = fileURL;
          fURL.setAttribute('download', filename);
          document.body.appendChild(fURL);
          fURL.click();
        });
    },
    // Delete file to Cloud
    deleteFile(noteId, typeFile) {
      let arrayToMap;
      typeFile === 'pdf' ? arrayToMap = this.filesPdf : arrayToMap = this.filesImage;
      // Counter equal array index value
      let count = 0;
      arrayToMap.map(el => {
        if (el.id === noteId) {
          axios.delete(`http://127.0.0.1:8000/note/${this.group[0].id}/${noteId}`)
            .then((response) => {
              this.snackbarMessageException('success', `Le fichier a bien été supprimé.`);
            })
          // Remove value in array
          arrayToMap.splice(count, 1);
        }
        count ++;
      })
    },
  }
}
</script>

<style scoped>

</style>
