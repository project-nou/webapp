<template>
  <div class="drop_file_content">
    <div v-if="!file" id="content_drag_and_drop">
      <div :class="['dropZone', dragging ? 'dropZone-over' : '']" @dragenter="dragging = true" @dragleave="dragging = false">
        <div class="dropZone-info" @drag="onChange">
          <span class="fa fa-cloud-upload dropZone-title"></span>
          <div class="icon_upload"><v-icon x-large>mdi-cloud-upload-outline</v-icon></div>
          <span class="dropZone-title">Drop ton fichier ou clique dans la zone</span>
          <div class="dropZone-upload-limit-info">
            <div>extension supportées: PDF, JPG, JPEG, PNG</div>
            <div>taille fichier max: 5 MB</div>
          </div>
        </div>
        <input type="file" @change="onChange">
      </div>
    </div>
    <div v-else class="dropZone-uploaded">
      <div class="dropZone-uploaded-info">
        <v-row>
          <v-col class="uploadedFile-info font-weight-thin ml-2 col-md-6">
            <div class="detail_create_file_content">
              <div class="mb-4">Nom du fichier: {{ file.name }}</div>
              <div class="mb-4">Taille(bytes): {{ file.size }}</div>
              <div class="mb-4">Extension：{{ extension }}</div>
            </div>

          </v-col>
          <v-col class="col-md-5 column_action_file">
            <div class="action_create_file_content">
              <button type="button" class="btn btn-primary uploadFile font-weight-thin" @click="uploadFile">Envoyer le fichier</button>
              <button type="button" class="dropZone-title btn btn-primary removeFile font-weight-thin" @click="removeFile">Supprimer le fichier</button>
            </div>
          </v-col>
        </v-row>
      </div>
    </div>

    <SnackbarSuccess :message="snackbarMessage" :color="color"/>
    <SnackbarFailed :message="snackbarMessage" :color="color"/>
  </div>
</template>

<script>
import "./DropFile.css";
import axios from 'axios';
import SnackbarSuccess from '@/components/Snackbar/SnackbarSuccess.vue';
import SnackbarFailed from '@/components/Snackbar/SnackbarFailed.vue';


export default {
  name: 'DropFile',
  components : {
    SnackbarFailed,
    SnackbarSuccess,
  },
  props: {
    groupData: {
      type: Array,
      required: true,
    }
  },
  data(){
    return{
      file: '',
      filesImage: [],
      filesPdf: [],
      dragging: false,
      username : localStorage.getItem('username'),
      group : this.groupData,
      snackbarMessage: undefined,
      color: undefined,
    }
  },
  computed: {
    extension() {
      return (this.file) ? this.file.name.split('.')
        .pop() : '';
    },
  },
  methods : {
    // Get event drag
    onChange(e) {
      let files = e.target.files || e.dataTransfer.files;
      if (!files.length) {
        this.dragging = false;
        return;
      }
      this.createFile(files[0]);
    },
    // Create file send by drag and drop
    createFile(file) {
      // Authorized type file | plain -> txt type
      const authorizedTypeFile = ['png', 'jpg', 'jpeg', 'pdf'];
      // Get type
      let typeFileSend = file.type.split('/')[1]
      // Verify if type exist in our array
      if (!authorizedTypeFile.includes(typeFileSend)) {
        this.snackbarMessageException('error', 'Fichier non pris en charge (pdf, jpg ou png)');
        this.dragging = false;
        return;
      }
      // Verify size file
      if (file.size > 5000000) {
        this.snackbarMessageException('error', 'Fichié trop volumineux (max 5 MB).');
        this.dragging = false;
        return;
      }

      this.file = file;
      this.dragging = false;
    },
    // Register file to cloud
    uploadFile() {
      const formdata = new FormData();
      formdata.append('group', this.group[0].name);
      formdata.append('author', this.username);
      formdata.append('format', 'file');
      formdata.append('content', 'file');
      formdata.append('group_id', this.group[0].id);
      formdata.append('file', this.file);

      axios.post('http://127.0.0.1:8000/note', formdata)
        .then((response) => {
          let extensionFiles = response.data.content.split('.').pop();
          let fileInformation = {
            filename: response.data.content,
            id: response.data.note_id,
            author: response.data.author,
            url: 'https://res.cloudinary.com/doekqrsf4/image/upload/v1644856207/' + this.groupeName + '/' + this.idGroup + '/' + response.data.content
          };
          // Push to different array (unshift -> add value to the first position in array)
          if (extensionFiles !== 'pdf') {
            this.filesImage.unshift(fileInformation);
          } else {
            this.filesPdf.unshift(fileInformation);
          }
          this.snackbarMessageException('success', `Le fichier a bien été ajouté.`);
          this.$root.$emit('refreshGetAllNotesFile');
        })
      this.file = '';
    },
    // Delete file send by user
    removeFile() {
      this.file = '';
    },
    // Exception snackbar
    snackbarMessageException(type, message) {
      this.snackbarMessage = message;
      this.color = type;
      switch (type) {
        case 'success':
          this.$root.$emit('SnackbarSuccess');
          break;
        case 'error':
          this.$root.$emit('SnackbarFailed');
          break;
        default:
      }
    },
  }
};
</script>
