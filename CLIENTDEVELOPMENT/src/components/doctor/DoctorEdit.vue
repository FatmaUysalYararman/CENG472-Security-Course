<template>
  <div class="edit_div" v-if="toggleEdit">
    <div class="input-group input-group-sm mb-3">
      <select v-model="userId" class="custom-select" id="inputGroupSelect01">
        <option value selected>Select medical record</option>
        <option v-for="user in myUsers" v-bind:key="user.id" v-bind:value="user._id"
        >{{user.name}}'s medical records</option>
      </select>
      <button v-on:click="share(userId)" type="button" class="btn btn-success">Share medical record</button>
    </div>
    <div class="col-md-12 text-center">
      <p v-show="isReqSent">Request sent</p>
      <button v-on:click="toggle" type="button" class="btn btn-danger">Close</button>
    </div>
  </div>
</template>

<script>
import { axios } from "@/main.js";
// import { hashScript } from "../main.js";
export default {
  data() {
    return {
      userId: "",
      users: []
    };
  },
  props: ["toggleEdit", "lastUserId", "myUsers", "myId", "userType", "sessionId"],
  methods: {
    toggle() {
      this.$emit("toggle");
    },
    share(patientId){
      console.log("SENDING SHARE REQUEST")
      console.log(this.userType)
      if(this.userType == "doctors"){
        this.shareDoctor(patientId)
      }
      else if(this.userType == "nurses"){
        this.shareNurse(patientId)
      }
    },
    shareDoctor(patientId) {
      var data = {patientId: patientId, doctorId: this.lastUserId, senderId: this.myId, sessionId: this.sessionId}
      console.log(data)
      axios
        .post("/addpatienttodoctor", data)
        .then(this.shareResponse)
    },
    shareNurse(patientId){
      var data = {patientId: patientId, nurseId: this.lastUserId, senderId: this.myId, sessionId: this.sessionId}
      console.log(data)
      axios
        .post("/addpatienttonurse", data)
        .then(this.shareResponse)
    },
    shareResponse(){
      this.toggle()
    },
    errorFunction(error) {
      console.log(error);
    }
  }
};
</script>
