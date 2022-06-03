<template>
  <div class="drag_and_drop_list_content">
    <v-row>
      <h2 class="orange_personalize--text font-weight-thin">Tâches</h2>
    </v-row>
    <v-col class="col-md-5">
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
              class="item pt-5"
              @cut="remove(toDo, item)"
              :data="selection(item)"
              :key="item.content"
            >
              <div class="content_note_text">
                <p>{{ item.content }}</p>
                <div class="btn_action_note_text">
                  <v-btn
                    class="btn_set"
                    x-small
                    fab
                    color="transparent"
                    elevation="0"
                    @click="setFieldToUpdate(item.id, item.content, item.is_done)"
                    @click.stop="dialog_update = true"
                  >
                    <v-icon
                      color="black" dense>
                      mdi-pencil
                    </v-icon>
                  </v-btn>
                  <v-btn
                    class="btn_delete"
                    x-small
                    fab
                    color="transparent"
                    elevation="0"
                    @click="remove_task(item.id, item.is_done)">
                    <v-icon
                      color="black" dense>
                      mdi-delete-outline
                    </v-icon>
                  </v-btn>
                </div>
              </div>
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
                    Ajouter une tâche
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </v-card-text>
          </v-card>
        </v-hover>
      </div>
    </v-col>

    <!-- Done task -->
    <v-col class="col-md-5 ml-8">
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
              class="item pt-5"
              @cut="remove(done, item)"
              :data="selection(item)"
              :key="item.content"
            >
              <div class="content_note_text">
                <p>{{ item.content }}</p>
                <div class="btn_action_note_text">
                  <v-btn
                    class="btn_set"
                    x-small
                    fab
                    color="transparent"
                    elevation="0"
                    @click="setFieldToUpdate(item.id, item.content, item.is_done)"
                    @click.stop="dialog_update = true"
                  >
                    <v-icon
                      color="black" dense>
                      mdi-pencil
                    </v-icon>
                  </v-btn>
                  <v-btn
                    class="btn_delete"
                    x-small
                    fab
                    color="transparent"
                    elevation="0"
                    @click="remove_task(item.id, item.is_done)">
                    <v-icon
                      color="black" dense>
                      mdi-delete-outline
                    </v-icon>
                  </v-btn>
                </div>
              </div>
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

    <!-- Form Add content task -->
    <v-dialog v-model="dialog_task" max-width="390">
      <v-card class="form_add_task">
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
            <v-list class="task_content">
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
                color="orange darken-1"
                text
                :disabled="!valid_task"
                @click="validate_task"
              >
                Ajouter
              </v-btn>

              <v-btn color="white darken-1" text @click="reset_task">
                Fermer
              </v-btn>
            </v-card-actions>
          </v-form>
        </v-container>

      </v-card>
    </v-dialog>

    <!-- Form update content -->
    <v-dialog v-model="dialog_update" max-width="390">
      <v-card class="form_edit_task">
        <v-card-title class="text-h5 white--text">
          Modifier le contenu de la tâche
        </v-card-title>

        <v-container class="container--fluid">
          <v-form
            ref="form_update"
            v-model="valid_update"
            lazy-validation
          >
            <v-list class="task_content">
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
                color="orange darken-1"
                text
                :disabled="!valid_update"
                @click="update_task(idToUpdate, content_update, is_done_note)"
              >
                Modifier
              </v-btn>

              <v-btn color="white darken-1" text @click="reset_update">
                Fermer
              </v-btn>
            </v-card-actions>
          </v-form>
        </v-container>

      </v-card>
    </v-dialog>

    <SnackbarSuccess :message="snackbarMessage" :color="color"/>
    <SnackbarFailed :message="snackbarMessage" :color="color"/>
  </div>
</template>

<script>
import "./DragAndDropList.css";
import "./DragAndDrop.scss";
import axios from 'axios';
import { Drag, DropList } from 'vue-easy-dnd';
import jwt_decode from 'jwt-decode';
import SnackbarSuccess from '@/components/Snackbar/SnackbarSuccess.vue';
import SnackbarFailed from '@/components/Snackbar/SnackbarFailed.vue';

export default {
  name: "DragAndDropList",
  components : {
    Drag,
    DropList,
    SnackbarFailed,
    SnackbarSuccess,
  },
  props: {
    groupData: {
      type: Array,
      required: true,
    }
  },
  data() {
    return {
      group : this.groupData,
      toDo: [],
      done: [],
      dialog_update: false,
      dialog_task: false,
      selected: [],
      valid_task: true,
      content_task: '',
      valid_update: true,
      content_update: '',
      idToUpdate: null,
      is_done_note: null,
      snackbarMessage: undefined,
      color: undefined,
    }
  },
  mounted() {
    this.getAllNotesText();
  },
  methods : {
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
    selection(item) {
      return item;
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
    reset_task() {
      this.$refs.form_task.reset();
      this.dialog_task = false;
    },
    reset_update() {
      this.$refs.form_update.reset();
      this.dialog_update = false;
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
}
</script>
