<template>
  <div class="group_view">
    <!--  Content page -->
    <div class="group_view_content">
      <v-row>
        <v-col class="col-md-2 pb-0">
          <Menu/>
        </v-col>

        <v-col class="col-md-10 pb-0">
          <div class="authorized_user text-right pt-5 pr-5">
            <!-- Auhtorized user -->
            <v-tooltip>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn class="authorized_user_content"
                         fab small outlined color="orange"
                         v-bind="attrs" v-on="on">
                    <div
                        class="crown"
                    >
                      <v-img
                          lazy-src="@/assets/icons/crown-outline.png"
                          width="15"
                          src="@/assets/icons/crown-outline.png"
                      ></v-img>
                    </div>
                    {{ adminUsername.charAt(0) }}
                  </v-btn>
                </template>
              <span>{{ adminUsername }}</span>
            </v-tooltip>

            <v-tooltip v-for="user in authorizedUser" :key="user.username">
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                    class="authorized_user_content"
                    fab small outlined color="blue"
                    v-bind="attrs" v-on="on"
                >
                  {{ user.username.charAt(0) }}
                </v-btn>
              </template>
              <span>{{ user.username }}</span>
            </v-tooltip>

            <!-- Add user -->
            <v-btn
                @click.stop="dialog = true"
                class="authorized_user_content"
                fab small outlined color="white">
              +
            </v-btn>
          </div>

          <!-- Form Add user -->
          <v-dialog v-model="dialog" max-width="390">
            <v-card class="form_add_user_to_group">
              <v-card-title class="text-h5 white--text">
                Inviter un utilisateur ?
              </v-card-title>

              <v-card-text class="white--text font-weight-thin">
                Remplir le formulaire afin d'inviter un nouvel utilisateur.
              </v-card-text>

              <v-container class="container--fluid">
                <v-form
                    ref="form"
                    v-model="valid"
                    lazy-validation
                >
                  <v-list id="email_field">
                    <v-list-item>
                      <v-img
                          lazy-src="@/assets/icons/email.png"
                          width="40"
                          src="@/assets/icons/email.png"
                      ></v-img>
                      <v-list-item-title class="ml-10">
                        <v-text-field
                            v-model="email"
                            :rules="emailRules"
                            label="E-mail"
                            required
                            color="orange"
                            clearable
                            clear-icon="mdi-close-circle"
                        ></v-text-field>
                      </v-list-item-title>
                    </v-list-item>
                  </v-list>

                  <v-card-actions class="mt-10">
                    <v-spacer></v-spacer>
                    <v-btn
                        color="green darken-1"
                        text
                        :disabled="!valid"
                        @click="validate"
                    >
                      Ajouter l'utilisateur
                    </v-btn>

                    <v-btn color="red darken-1" text @click="reset">
                      Fermer
                    </v-btn>
                  </v-card-actions>
                </v-form>
              </v-container>

            </v-card>
          </v-dialog>

          <v-container class="container--fluid">
            <!-- Groupe Title -->
            <div class="mt-10 group_information">
              <p class="text-h5 orange_personalize--text mr-10">
                {{ this.group[0].name }}
              </p>
              <!-- Dropdown Action -->
              <v-menu open-on-hover top offset-y>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn x-small fab outlined
                         class="pa-4 mb-2 settings_btn group_action"
                         v-bind="attrs" v-on="on">
                    <v-img
                        lazy-src="@/assets/icons/settings.png"
                        width="20"
                        src="@/assets/icons/settings.png"
                    ></v-img>
                  </v-btn>
                </template>

                <v-list class="dropdown_action" width="250">
                  <v-list-item
                      link class="link_action_group"
                      @click="leaveGroup()">
                    <v-img width="18px"
                           src="@/assets/icons/leave.png">
                    </v-img>

                    <v-list-item-title
                        class="dropdown_action_text">
                      Quitter le groupe
                    </v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </div>
            <v-divider class="white"></v-divider>

            <!-- CONTENT -->
            <v-row class="mt-10" id="group_content">
              <v-container fluid class="wrapper">
                <v-row>
                  <!-- Task -->
                  <v-col class="col-md-7">
                    <v-row>
                      <h2 class="orange_personalize--text font-weight-thin">Tâches</h2>
                    </v-row>
                    <v-row>
                      <!-- To do task -->
                      <v-col class="col-md-5 offset-1">
                        <h3 class="title_task font-weight-thin">A faire</h3>
                        <div class="content_list">
                          <drop-list
                              :items="toDo"
                              class="list"
                              @insert="onInsert($event, 'toDo')"
                              @reorder="$event.apply(toDo)"
                              mode="cut"
                          >
                            <template v-slot:item="{item}">
                              <drag
                                  class="item pt-10"
                                  @cut="remove(toDo, item)"
                                  :data="selection(item)"
                                  :key="item.content"
                              >
                                {{ item.content }}
                                <v-btn
                                    absolute
                                    top
                                    right
                                    x-small
                                    color="transparent"
                                    elevation="0"
                                    @click="remove_task(item.id, item.is_done)">
                                  <v-icon
                                      color="error">
                                    mdi-close
                                  </v-icon>
                                </v-btn>
                                <!-- Add Task -->
                                <v-hover v-slot="{ hover }">
                                  <v-btn
                                      class="ml-14"
                                      :class="{ 'on-hover': hover }"
                                      top
                                      absolute
                                      x-small
                                      color="transparent"
                                      elevation="0"
                                      @click="setFieldToUpdate(item.id, item.content, item.is_done)"
                                      @click.stop="dialog_update = true"
                                  >
                                    <v-icon
                                        color="primary">
                                      mdi-pencil
                                    </v-icon>
                                  </v-btn>
                                </v-hover>
                              </drag>
                            </template>
                            <template v-slot:feedback="{data}">
                              <template v-if="selected.length > 0">
                                <div
                                    v-for="f in data"
                                    class="item feedback" :key="f.content">{{ f.content }}
                                </div>
                              </template>
                              <template v-else>
                                <div class="item feedback" :key="data.content">{{ data.content }}</div>
                              </template>
                            </template>
                          </drop-list>

                          <!-- Add Task -->
                          <v-hover v-slot="{ hover }">
                            <v-card
                                max-width="185"
                                max-height="200"
                                class="mx-auto add_task"
                                :elevation="hover ? 6 : 2"
                                :class="{ 'on-hover': hover }"
                                @click.stop="dialog_task = true"
                            >
                              <v-card-text class="pa-0">
                                <v-list class="add_task_text_content">
                                  <v-list-item>
                                    <v-img
                                        width="14px"
                                        src='@/assets/icons/plus.png'>
                                    </v-img>
                                    <v-list-item-title class="white--text ml-2 text_add_task">
                                      Ajouter une tache
                                    </v-list-item-title>
                                  </v-list-item>
                                </v-list>
                              </v-card-text>
                            </v-card>
                          </v-hover>
                        </div>
                      </v-col>

                      <!-- Done task -->
                      <v-col class="col-md-5">
                        <h3 class="title_task font-weight-thin">Finis</h3>
                        <div class="content_list">
                          <drop-list
                              :items="done"
                              class="list"
                              @insert="onInsert($event, 'done')"
                              @reorder="$event.apply(done)"
                              mode="cut"
                          >
                            <template v-slot:item="{item}">
                              <drag
                                  class="item pt-10"
                                  @cut="remove(done, item)"
                                  :data="selection(item)"
                                  :key="item.content"
                              >{{ item.content }}
                                <v-btn
                                    absolute
                                    top
                                    right
                                    x-small
                                    color="transparent"
                                    elevation="0"
                                    @click="remove_task(item.id, item.is_done)">
                                  <v-icon
                                      color="error">
                                    mdi-close
                                  </v-icon>
                                  <v-hover v-slot="{ hover }">
                                    <v-btn
                                        :class="{ 'on-hover': hover }"
                                        right
                                        class="mr-1"
                                        absolute
                                        x-small
                                        color="transparent"
                                        elevation="0"
                                        @click="setFieldToUpdate(item.id, item.content, item.is_done)"
                                        @click.stop="dialog_update = true"
                                    >
                                      <v-icon
                                          color="primary">
                                        mdi-pencil
                                      </v-icon>
                                    </v-btn>
                                  </v-hover>
                                </v-btn>
                              </drag>
                            </template>
                            <template v-slot:feedback="{data}">
                              <template v-if="selected.length > 0">
                                <div
                                    v-for="f in data"
                                    class="item feedback" :key="f.content">
                                  {{ f.content }}
                                </div>
                              </template>
                              <template v-else>
                                <div class="item feedback" :key="data.content">{{ data.content }}</div>
                              </template>
                            </template>
                          </drop-list>
                        </div>
                      </v-col>
                    </v-row>

                    <!-- Form Add content task -->
                    <v-dialog v-model="dialog_task" max-width="390">
                      <v-card class="form_add_user_to_group">
                        <v-card-title class="text-h5 white--text">
                          Ajouter une tâche
                        </v-card-title>

                        <v-card-text class="white--text font-weight-thin">
                          Ajouter une tâche à faire pour les membres du groupe
                        </v-card-text>

                        <v-container class="container--fluid">
                          <v-form
                            ref="form_task"
                            v-model="valid_task"
                            lazy-validation
                          >
                            <v-list id="task_content">
                              <v-list-item>
                                <v-img
                                  lazy-src="@/assets/icons/plus.png"
                                  width="40"
                                  src="@/assets/icons/plus.png"
                                ></v-img>
                                <v-list-item-title class="ml-10">
                                  <v-textarea
                                    v-model="content_task"
                                    label="Contenu de la tâche"
                                    required
                                    color="orange"
                                    clearable
                                    clear-icon="mdi-close-circle"
                                  ></v-textarea>
                                </v-list-item-title>
                              </v-list-item>
                            </v-list>

                            <v-card-actions class="mt-10">
                              <v-spacer></v-spacer>
                              <v-btn
                                color="green darken-1"
                                text
                                :disabled="!valid_task"
                                @click="validate_task"
                              >
                                Ajouter
                              </v-btn>

                              <v-btn color="red darken-1" text @click="reset_task">
                                Fermer
                              </v-btn>
                            </v-card-actions>
                          </v-form>
                        </v-container>

                      </v-card>
                    </v-dialog>

                    <!-- Form update content -->
                    <v-dialog v-model="dialog_update" max-width="390">
                      <v-card class="form_add_user_to_group">
                        <v-card-title class="text-h5 white--text">
                          Modifier le contenu de la tâche
                        </v-card-title>

                        <v-container class="container--fluid">
                          <v-form
                            ref="form_update"
                            v-model="valid_update"
                            lazy-validation
                          >
                            <v-list id="task_content">
                              <v-list-item>
                                <v-list-item-title class="ml-10">
                                  <v-textarea
                                    v-model="content_update"
                                    label="Contenu de la tâche"
                                    required
                                    color="orange"
                                    clearable
                                    clear-icon="mdi-close-circle"
                                  ></v-textarea>
                                </v-list-item-title>
                              </v-list-item>
                            </v-list>

                            <v-card-actions class="mt-10">
                              <v-spacer></v-spacer>
                              <v-btn
                                color="green darken-1"
                                text
                                :disabled="!valid_update"
                                @click="update_task(idToUpdate, content_update, is_done_note)"
                              >
                                Modifier
                              </v-btn>

                              <v-btn color="red darken-1" text @click="reset_update">
                                Fermer
                              </v-btn>
                            </v-card-actions>
                          </v-form>
                        </v-container>

                      </v-card>
                    </v-dialog>
                  </v-col>

                  <!-- Divider -->
<!--                  <v-col class="col-md-1">-->
                  <v-divider vertical class="white"></v-divider>
<!--                  </v-col>-->

                  <!-- All files -->
                  <v-col class="col-md-4 ml-10">
                    <v-row>
                      <h2 class="orange_personalize--text font-weight-thin">Fichiers déposés</h2>
                    </v-row>
                    <!-- PDF FILE -->
                    <v-row class="mt-6">
                      <div class="file_content">
                        <div v-for="file in filesPdf" :key="file.note_id" class="mr-4 one_file_content">
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
                              color="transparent"
                              icon
                              @click="downloadFile(file.url, file.filename)">
                                <v-icon color="white" small>
                                  mdi-download
                                </v-icon>
                            </v-btn>
                            <v-btn
                              class="btn_action_delete"
                              color="transparent"
                              icon
                              @click="deleteFile(file.id, 'pdf')">
                              <v-icon
                                color="white" small>
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
                        <div v-for="file in filesImage" :key="file.note_id" class="mr-4 one_file_content">
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
                              color="transparent"
                              icon
                              @click="downloadFile(file.url, file.filename)">
                              <v-icon color="white" small>
                                mdi-download
                              </v-icon>
                            </v-btn>
                            <v-btn
                              class="btn_action_delete"
                              color="transparent"
                              icon
                              @click="deleteFile(file.id, 'img')">
                              <v-icon
                                color="white" small>
                                mdi-delete-outline
                              </v-icon>
                            </v-btn>
                          </div>
                        </div>
                      </div>
                    </v-row>
                    <!-- List file group -->
<!--                    <v-row>-->
<!--                      <div v-for="file in files" :key="file.note_id">-->
<!--                        <div v-if="file.url.split('.').pop() !== 'pdf'">-->
<!--                          <v-card class="mt-6 mr-4">-->
<!--                            <v-img-->
<!--                                :src="file.url"-->
<!--                                class="white&#45;&#45;text align-end"-->
<!--                                gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"-->
<!--                                height="150px"-->
<!--                                width="150px"-->
<!--                            >-->
<!--                              <v-btn-->
<!--                                  color="transparent"-->
<!--                                  icon-->
<!--                                  @click="downloadFile(file.url, file.filename)"-->
<!--                              >-->
<!--                                <v-icon-->
<!--                                    color="success">-->
<!--                                  mdi-download-->
<!--                                </v-icon>-->
<!--                              </v-btn>-->
<!--                              <v-btn-->
<!--                                color="transparent"-->
<!--                                icon-->
<!--                                @click="deleteFile(file.id)"-->
<!--                              >-->
<!--                                <v-icon-->
<!--                                  color="success">-->
<!--                                  mdi-close-->
<!--                                </v-icon>-->
<!--                              </v-btn>-->
<!--                            </v-img>-->
<!--                          </v-card>-->
<!--                        </div>-->
<!--                        <div v-else class="div-pdf">-->
<!--                          <v-card class="mt-6 mr-4" color="transparent">-->
<!--                            <v-img-->
<!--                                src="@/assets/icons/pdf-file.png"-->
<!--                                class="white&#45;&#45;text align-end"-->
<!--                                gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"-->
<!--                                height="125px"-->
<!--                                width="97px"-->
<!--                            >-->
<!--                              <v-btn-->
<!--                                  class="mt-2"-->
<!--                                  color="transparent"-->
<!--                                  icon-->
<!--                                  @click="downloadFile(file.url, file.filename)"-->
<!--                              >-->
<!--                                <v-icon-->
<!--                                    color="success">-->
<!--                                  mdi-download-->
<!--                                </v-icon>-->
<!--                              </v-btn>-->
<!--                              <v-btn-->
<!--                                color="transparent"-->
<!--                                icon-->
<!--                                @click="deleteFile(file.id)"-->
<!--                              >-->
<!--                                <v-icon-->
<!--                                  color="success">-->
<!--                                  mdi-close-->
<!--                                </v-icon>-->
<!--                              </v-btn>-->
<!--                            </v-img>-->
<!--                            <v-card-text>-->
<!--                              <small class="white&#45;&#45;text">{{file.filename.split('.')[0]}}</small>-->
<!--                            </v-card-text>-->
<!--                          </v-card>-->
<!--                        </div>-->
<!--                      </div>-->
<!--                    </v-row>-->
                    <!-- Drag and drop file -->
                    <v-row class="mt-8">
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
                          <button type="button" class="btn btn-primary uploadFile font-weight-thin" @click="uploadFile">Envoyer le fichier</button>
                          <button type="button" class="dropZone-title btn btn-primary removeFile font-weight-thin" @click="removeFile">Supprimer le fichier</button>
                        </div>
                      </div>

                      <div class="uploadedFile-info font-weight-thin ml-2">
                        <div class="mb-4">Nom du fichier: {{ file.name }}</div>
                        <div class="mb-4">Taille(bytes): {{ file.size }}</div>
                        <div class="mb-4">Extension：{{ extension }}</div>
                      </div>
                    </v-row>
                  </v-col>
                </v-row>
              </v-container>
            </v-row>
          </v-container>
        </v-col>
      </v-row>
    </div>

    <SnackbarSuccess :message="snackbarMessage" :color="color"/>
    <SnackbarFailed :message="snackbarMessage" :color="color"/>
  </div>
</template>

<script>
import { Drag, DropList } from 'vue-easy-dnd';
import Menu from '@/components/Menu/Menu.vue';
import SnackbarSuccess from '@/components/Snackbar/SnackbarSuccess.vue';
import axios from 'axios';
import SnackbarFailed from '@/components/Snackbar/SnackbarFailed.vue';
import jwt_decode from 'jwt-decode';

export default {
  name: 'Group',
  components: {
    Drag,
    DropList,
    Menu,
    SnackbarSuccess,
    SnackbarFailed,
  },
  data() {
    return {
      group: [],
      toDo: [],
      done: [],
      // files: [],
      filesImage: [],
      filesPdf: [],
      filesGroup: [],
      selected: [],
      selectedList: 0,
      content_task: '',
      content_update: '',
      adminUsername: '',
      idGroup: this.$route.params.id,
      groupeName: undefined,
      authorizedUser: [],
      isAdminOfGroup: true,
      username: undefined,
      valid: true,
      valid_task: true,
      valid_update: true,
      dialog: false,
      dialog_task: false,
      dialog_update: false,
      idToUpdate: null,
      contentToUpdate: null,
      is_done_note: null,
      email: undefined,
      emailRules: [
        (v) => !!v || 'L\' e-mail est requis',
        (v) => /.+@.+\..+/.test(v) || 'L\' e-mail doit être valide',
      ],
      snackbarMessage: undefined,
      color: undefined,
      file: '',
      dragging: false
    };
  },
  beforeMount() {
    this.getOneGroup(this.idGroup);
    this.getUsersFromGroup();
  },
  mounted() {
    this.getUser();
    this.getAllNotesText();
    this.getAllNotesFile();
  },
  computed: {
    extension() {
      return (this.file) ? this.file.name.split('.').pop() : '';
    }
  },
  methods: {
    // Get user
    getUser() {
      this.username = localStorage.getItem('username');
    },
    selection(item) {
      return item;
    },
    getAllNotesText() {
      axios.get('http://localhost:8000/notes/' + this.$route.params.id + '/text')
          .then((response) => {
            response.data.notes.forEach(el => {
              if (!el.is_done) {
                this.toDo.push({
                  content: el.content,
                  id: el.note_id,
                  author: el.author,
                  is_done: el.is_done
                });
              } else {
                this.done.push({
                  content: el.content,
                  id: el.note_id,
                  author: el.author,
                  is_done: el.is_done
                });
              }
            });
          });
    },

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
    /**
     * Inserts one selected done into the target
     * droplist
     *
     * @event {InsertEvent} - holds dragging data and drop index
     * @llistNameist String - name of the list in the data section
     */
    onInsert(event, listName) {
      this[listName].splice(event.index, 0, event.data);
      this.selected = [];
      switch (listName) {
        case 'toDo':
          axios.post('http://localhost:8000/note/status', {
            'note_id': event.data.id
          });
          // Update is done value
          this.toDo.map(el => {
            if (el.id === event.data.id) el.is_done = false;
          });
          break;
        case 'done':
          axios.post('http://localhost:8000/note/status', {
            'note_id': event.data.id
          });
          // Update is done value
          this.done.map(el => {
            if (el.id === event.data.id) el.is_done = true;
          });
          break;
        default:
      }
    },
    remove(array, value) {
      const index = array.indexOf(value);
      array.splice(index, 1);
    },
    remove_task(id, is_done) {
      if (!is_done) {
        let count = 0;
        this.toDo.map(el => {
          if (el.id === id) this.toDo.splice(count, 1);
          count++;
        });
      } else {
        let count = 0;
        this.done.map(el => {
          if (el.id === id) this.done.splice(count, 1);
          count++;
        });
      }
      axios
          .delete('http://127.0.0.1:8000/note/' + this.group[0].id + '/' + id)
          .then(() => {
            this.snackbarMessageException('success', 'Tâche supprimée');
          });
    },
    update_task(id, content, is_done) {
      let data = {
        'note_id': id,
        'content_note': content
      };
      if (!is_done) {
        let count = 0;
        this.toDo.map(el => {
          if (el.id === id) this.toDo[count].content = content;
          count++;
        });
      } else {
        let count = 0;
        this.done.map(el => {
          if (el.id === id) this.done[count].content = content;
          count++;
        });
      }
      axios
          .patch('http://127.0.0.1:8000/note', data)
          .then(() => {
            this.reset_update();
            this.idToUpdate = null;
            this.content_update = null;
            this.is_done_note = null;
            this.snackbarMessageException('success', 'Tâche modifié');
          });
    },
    setFieldToUpdate(id, content, is_done) {
      this.idToUpdate = id;
      this.content_update = content;
      this.is_done_note = is_done;
    },
    validate() {
      if (this.$refs.form.validate()) {
        this.inviteUser();
        this.reset();
      }
    },
    validate_task() {
      if (!this.content_task) {
        this.snackbarMessageException('error', 'Contenu vide');
      } else {
        this.addContentTask(this.content_task);
        this.reset_task();
      }
    },
    addContentTask(content) {
      let formdata = new FormData();
      formdata.append('group', this.group[0].name);
      formdata.append('author', jwt_decode(localStorage.getItem('token')).username);
      formdata.append('format', 'text');
      formdata.append('content', content);
      formdata.append('group_id', this.group[0].id);
      axios
          .post('http://127.0.0.1:8000/note', formdata)
          .then((response) => {
            this.snackbarMessageException('success', 'Tache créé');
            this.toDo.push({
              content: response.data.content,
              id: response.data.note_id,
              author: response.data.author,
              is_done: response.data.is_done
            });
          });
    },
    reset() {
      this.$refs.form.reset();
      this.dialog = false;
    },
    reset_task() {
      this.$refs.form_task.reset();
      this.dialog_task = false;
    },
    reset_update() {
      this.$refs.form_update.reset();
      this.dialog_update = false;
    },
    getOneGroup() {
      axios.get('http://localhost:8000/group/' + this.$route.params.id)
          .then((response) => {
            this.groupeName = response.data.name;
            this.group.push({
              name: response.data.name,
              id: response.data.group_id,
              admin: response.data.admin
            });
            ;
          });
    },
    getUsersFromGroup() {
      axios.get('http://localhost:8000/group/' + this.$route.params.id + '/users')
          .then((response) => {
            const participants = response.data.groups[0].participants;
            const admin = response.data.groups[0].admin;
            for (let i = 0; i < participants.length; i++) {
              if (participants[i].id !== admin.id) {
                this.authorizedUser.push({
                  username: participants[i].username,
                  id: participants[i].id
                });
              } else {
                this.adminUsername = admin.username;
              }
            }
            this.verifyIfUserInGroup();
          });
    },
    verifyIfUserInGroup() {
      let usernames = [];
      this.authorizedUser.map((el) => {
        usernames.push(el.username);
      });
      if (!usernames.includes(jwt_decode(localStorage.getItem('token')).username) && this.adminUsername !== jwt_decode(localStorage.getItem('token')).username) {
        this.$router.push('/my_groups');
      }
    },
    inviteUser() {
      const email = this.email;
      axios.get('http://localhost:8000/users/' + email + '/groupes/' + this.idGroup + '/sendInvit')
          .then(() => {
            this.snackbarMessageException('success', 'L\'invation à ' + email + ' a bien été envoyée');
          })
          .catch(() => {
            this.snackbarMessageException('error', 'L\'invation à ' + email + ' n\'a pas été envoyée');
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
    leaveGroup() {
      axios
          .delete('http://localhost:8000/user/' + jwt_decode(localStorage.getItem('token')).user_id + '/group/' + this.group[0].id + '/leave')
          .then(() => {
            this.snackbarMessageException('success', 'Vous avez quitté le groupe avec succes');
            this.$router.push('/my_groups');
          })
          .catch(() => {
            this.snackbarMessageException('error', 'Une erreur est survenue');
          });
    },
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
      formdata.append('group', this.groupeName);
      formdata.append('author', this.username);
      formdata.append('format', 'file');
      formdata.append('content', 'file');
      formdata.append('group_id', this.idGroup);
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
      })
      // .catch((error) => {
      //   console.log(error);
      // })
      this.file = '';
    },
    // Delete file send by user
    removeFile() {
      this.file = '';
    },
    // Delete file to Cloud
    deleteFile(noteId, typeFile) {
      let arrayToMap;
      typeFile === 'pdf' ? arrayToMap = this.filesPdf : arrayToMap = this.filesImage;
      // Counter equal array index value
      let count = 0;
      arrayToMap.map(el => {
        if (el.id === noteId) {
          axios.delete(`http://127.0.0.1:8000/note/${this.idGroup}/${noteId}`)
            .then((response) => {
              this.snackbarMessageException('success', `Le fichier a bien été supprimé.`);
            })
            // .catch((error) => {
            //   console.log(error);
            // })
          // Remove value in array
          arrayToMap.splice(count, 1);
        }
        count ++;
      })
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
  },
};
</script>

<style scoped>
  .group_view {
    height: calc(100vh - 100px);
  }

  .logo_project {
    width: 75px;
    position: fixed;
    bottom: 40px;
    right: 40px;
  }

  .authorized_user {
    position: absolute;
    right: 25px;
  }

.authorized_user_content {
  background-color: #575c5d;
  margin-left: -10px;
}
.hover-pseudo {
  font-size: 10px;
  color: white;
  margin-top: 40px;
  box-shadow: none!important;
}
.crown {
  margin-left: -18px;
}

  .form_add_user_to_group {
    background-color: #575c5d !important;
    border: 1px solid #ccc;
  }

  #email_field, #task_content {
    background-color: transparent;
  }

  .orange_personalize--text {
    color: #E57750;
  }

  .group_information {
    display: block ruby;
  }

  .settings_btn {
    border: none;
  }

  .settings_btn:hover {
    background-color: rgba(229, 119, 80, 0.3);
  }

  .title_task {
    color: white;
  }

  #group_content {
    max-height: 80vh !important;
    overflow: auto;
    overflow-x: hidden;
  }

  /*.drop-in {*/
  /*  box-shadow: 0 0 10px rgba(255, 255, 255, 0.3);*/
  /*}*/
  .add_task {
    background-color: rgba(255, 255, 255, 0.2);
    border-radius: 8px;
    margin-bottom: 20px;
  }

  .add_task_text_content {
    width: 80%;
    margin: auto;
    background-color: transparent;
  }

  .content_list {
    border-right: 1px solid #E57750;
    width: 250px;
    min-height: 10vh;
    max-height: 55vh;
    overflow-y: auto;
  }

  .text_add_task {
    font-size: 12px;
  }

  .dropdown_action {
    background-color: #2F3437 !important;
    border: 1px solid #fff !important;
    border-radius: 12px !important;
  }

  .dropdown_action_text {
    color: white;
    margin-left: 10px;
  }

  .link_action_group:hover {
    background-color: rgba(229, 119, 80, 0.4);
  }

  .div-pdf {
    margin-top: 30px;
    }

  /* List File */
  .file_content{
    width: 100vw;
    display: flex;
    overflow: auto;
  }
  .one_file_content{
    width: 100px;
  }
  .one_file_content .title_file {
    text-align: center;
    width: 60px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    color: #A8A8A8;
    font-size: 11px;
  }
  .one_file_content .img_file {
    margin: auto;
  }
  .file_action {
    display: flex;
  }
  .btn_action_download {
    margin: auto;
    margin-left: 0;
    display: block;
  }
  .btn_action_delete {
    margin: auto;
    margin-right: 0;
    display: block;
  }
  /* List File */
  /* Drag and drop file */
  #content_drag_and_drop {
    /*width: 100%;*/
    width: 65%;
  }
  .dropZone {
    /*width: 80%;*/
    /*height: 200px;*/
    width: 100%;
    height: 170px;
    position: relative;
    border: 2px dashed #eee;
    /*margin: auto;*/
  }

  .dropZone:hover {
    border: 1px solid rgba(229, 119, 80, 0.4);
  }

  .dropZone:hover .dropZone-title {
    color: #E57750;
  }

  .dropZone:hover > .dropZone-info .icon_upload i{
    color: #E57750 !important;
  }

  .icon_upload i{
    color: #787878 !important;
  }

  .dropZone-info {
    font-size: 12px;
    color: #A8A8A8;
    position: absolute;
    top: 50%;
    width: 100%;
    transform: translate(0, -50%);
    text-align: center;
  }

  .dropZone-title {
    color: #787878;
  }

  .dropZone input {
    position: absolute;
    cursor: pointer;
    top: 0px;
    right: 0;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
  }

  .dropZone-upload-limit-info {
    display: flex;
    justify-content: flex-start;
    flex-direction: column;
  }

  .dropZone-over {
    background: #5C5C5C;
    opacity: 0.8;
  }

  .dropZone-uploaded {
    width: 65%;
    height: 170px;
    /*width: 80%;*/
    /*height: 200px;*/
    position: relative;
    border: 2px dashed #eee;
    /*margin: auto;*/
  }

  .dropZone-uploaded-info {
    display: flex;
    flex-direction: column;
    align-items: center;
    color: #A8A8A8;
    position: absolute;
    top: 50%;
    width: 100%;
    transform: translate(0, -50%);
    text-align: center;
  }

  .uploadedFile-info {
    /*width: 80%;*/
    width: 30%;
    margin: auto;
    color: #A8A8A8;
    font-size: 13px;
  }

  .removeFile, .uploadFile{
     width: 200px;
   }

  .removeFile:hover, .uploadFile:hover{
    color: #E57750
  }
  /* Drag and drop file */
</style>

<style scoped lang="scss">
.wrapper {
  .list {
    margin: auto;
    width: 200px;
    min-height: 100px;

    .item {
      padding: 20px;
      margin: 10px;
      background-color: rgba(255, 255, 255, 0.6);
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      position: relative;
      cursor: pointer;

      &.selected {
        border: 2px solid white;
      }

      &.feedback {
        background-color: rgba(255, 255, 255, 0.3);
        border: 2px dashed #E57750;
      }

      &.drag-image {
        background-color: white;
        transform: translate(-50%, -50%);
      }
    }
  }
}
</style>
