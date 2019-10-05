<template>
  <div>
    <table class="table">
      <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">Firstname</th>
          <th scope="col">Lastname</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(user, index) in users[userType]" v-bind:key="user.id">
          <th scope="row">{{index+1}}</th>
          <td>{{user.name}}</td>
          <td>{{user.surname}}</td>
          <td>
            <button v-on:click="editButton(user._id)" type="button" class="btn btn-info btn-sm">Edit</button>
            <span style="display: inline-block; width:0.5vw"></span>
            <button
              v-on:click="deleteUser(user._id)"
              type="button"
              class="btn btn-danger btn-sm"
            >X</button>
          </td>
        </tr>
      </tbody>
    </table>
    <edit
      v-bind:sessionId="sessionId"
      v-on:toggle="toggle"
      v-on:save="refresh"
      v-bind:toggleEdit="toggleEdit"
      v-bind:lastUserId="lastUserId"
    ></edit>
  </div>
</template>

<script>
import { axios } from "@/main.js";
import AdminEdit from "@/components/admin/AdminEdit.vue";
export default {
  components: {
    edit: AdminEdit
  },
  created() {
    this.users = this.cleanUsers()
    this.setupUsers();
  },
  data() {
    return {
      users: {}, //cleanUsers()
      toggleEdit: false,
      lastUserId: -1
    };
  },
  methods: {
    editButton(id) {
      this.lastUserId = id;
      this.toggle();
    },
    // SETUP USERS START
    setupUsers() {
      axios
        .post("/get-users", { requesterId: this.myId, sessionId: this.sessionId })
        .then(this.setupUsersResponse)
        .catch(this.setupUsersError);
    },
    setupUsersResponse(res) {
      console.log(res.data);
      console.log(this.userType);
      // this.users = res.data
      this.users.doctors = res.data.doctors;
      this.users.nurses = res.data.nurses;
      this.users.users = res.data.users;
    },
    setupUsersError(error) {
      this.users = this.cleanUsers();
      console.log(error);
    },
    // SETUP USERS END
    deleteUser(_id) {
      axios
        .post("/deleteuser", { _id: _id, sessionId: this.sessionId })
        .then(this.deleteResponse)
        .catch(this.errorFunction);
    },
    deleteResponse() {
      // console.log("response")
      this.refresh();
    },
    errorFunction() {
      console.log("error");
      this.refresh();
    },

    refresh() {
      // console.log("trying to refresh")
      this.setupUsers();
    },
    toggle() {
      this.toggleEdit = !this.toggleEdit;
    },
    cleanUsers(){
      return {
        doctors: [],
        nurses: [],
        users: []
      }
    }
  },
  props: ["userType", "myId", "sessionId"],
  // watch: {
  //   userType() {
  //     this.refresh();
  //   }
  // }
};
</script>
