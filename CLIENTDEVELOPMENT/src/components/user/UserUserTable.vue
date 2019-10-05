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
              v-if="!doesExistInDoctorList(user._id)"
              v-on:click="selectButton(user._id)"
              type="button"
              class="btn btn-info btn-sm"
            >Select</button>
            <span style="display: inline-block; width:0.5vw"></span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { axios } from "@/main.js";
export default {
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
    doesExistInDoctorList(id){
      console.log(id)
      console.log(this.myInfo.data.doctors)
      var flag = false
      for (var i=0; i<this.myInfo.data.doctors.length; i++){
        if(this.myInfo.data.doctors[i]._id == id){
          flag = true;
        }
      }
      console.log(flag)
      return flag
    },
    selectButton(id) {
      axios
        .post("/userdoctorrequest", { senderId: this.myId, doctorId: id, sessionId: this.sessionId})
        .then(this.selectButtonResponse)
    },
    selectButtonResponse(){
      this.refresh()
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
      this.myInfo = res.data.user
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

    cleanUsers(){
      return {
        doctors: [],
        users: []
      }
    }
  },
  props: ["userType", "myId", "records", "sessionId"],
  // watch: {
  //   userType() {
  //     this.refresh();
  //   }
  // }
};
</script>
