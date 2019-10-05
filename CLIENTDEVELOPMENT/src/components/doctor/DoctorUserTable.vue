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
        <tr v-for="(user, index) in users[userType]" v-bind:key="user.id" v-bind:class="{loggedUser: myId==user._id}">
          <th scope="row">{{index+1}}</th>
          <td>{{user.name}}</td>
          <td>{{user.surname}}</td>
          <td>
            <button
              v-if="myId!=user._id && userType!='users'"
              v-on:click="editButton(user._id)"
              type="button"
              class="btn btn-info btn-sm"
            >Share medical record</button>
            <span style="display: inline-block; width:0.5vw"></span>

            <button
              v-if="userType=='users'"
              v-on:click="recordButton(user._id)"
              type="button"
              class="btn btn-info btn-sm"
            >Medical Records</button>
            <span style="display: inline-block; width:0.5vw"></span>
          </td>
        </tr>
      </tbody>
    </table>
    <edit
      v-on:toggle="toggle('edit')"
      v-on:save="refresh"
      v-bind:toggleEdit="toggleEdit"
      v-bind:lastUserId="lastUserId"
      v-bind:myId="myId"
      v-bind:myUsers="users.users"
      v-bind:userType="userType"
      v-bind:sessionId="sessionId"
    ></edit>
    <user-records
      v-on:toggle="toggle('record')"
      v-bind:toggleRecords="toggleRecords"
      v-bind:lastUserId="lastUserId"
      v-bind:myId="myId"
      v-bind:sessionId="sessionId"
    ></user-records>
  </div>
</template>

<script>
import { axios } from "@/main.js";
import DoctorEdit from "@/components/doctor/DoctorEdit.vue";
import MedicalRecords from "@/components/doctor/MedicalRecords.vue";
export default {
  components: {
    edit: DoctorEdit,
    "user-records": MedicalRecords

  },
  created() {
    this.users = this.cleanUsers()
    this.setupUsers();
  },
  data() {
    return {
      users: {}, //cleanUsers()
      toggleEdit: false,
      toggleRecords: false,
      lastUserId: -1
    };
  },
  methods: {
    editButton(id) {
      this.lastUserId = id;
      this.toggle("edit");
    },
    recordButton(id) {
      console.log("RECORDBUTTON")
      console.log(id)
      this.lastUserId = id;
      this.toggle("record");
    },

    // SETUP USERS START
    setupUsers() {
      axios
        .post("/get-users", { requesterId: this.myId, sessionId: this.sessionId })
        .then(this.setupUsersResponse)
        .catch(this.setupUsersError)
    },
    setupUsersResponse(res) {
      console.log(res.data);
      console.log(this.userType);
      // this.users = res.data
      this.users.doctors = res.data.doctors
      this.users.nurses = res.data.nurses
      this.users.users = res.data.users
    },
    setupUsersError(error) {
      this.users = this.cleanUsers()
      console.log(error);
    },
    // SETUP USERS END

    deleteUser(username) {
      axios
        .post("/deleteuser", { username: username, sessionId: this.sessionId })
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
    toggle(p) {
      if(p=="edit"){
        this.toggleEdit = !this.toggleEdit;
      }
      else{
        this.toggleRecords = !this.toggleRecords;
      }
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
