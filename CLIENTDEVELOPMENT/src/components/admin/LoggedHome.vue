<template>
  <div class="create_form">
    <p>Create an user</p>
    <input type="text" v-model="name">
    <input type="text" v-model="surname">
    <input type="text" v-model="type">
    <button class="btn btn-danger" v-on:click="olustur">Create</button>
  </div>
</template>

<script>
import { axios } from "@/main.js";
export default {
  data() {
    return {
      name: "name",
      surname: "surname",
      type: "doctor/nurse/user",
    };
  },
  methods: {
    olustur() {
        console.log("test");
      axios
        .post("/userekle", {username: this.name, surname: this.surname, type: this.type, sessionId: this.sessionId})
        .then(function(){})
        .catch(function(){});
    }
  },
  props: ["sessionId"]
};
</script>
