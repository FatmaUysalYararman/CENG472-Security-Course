<template>
  <div id="home_main_container">
    <div v-if="warning" class="warning">{{warningMsg}}</div>
    <div class="container-fluid header">Secure Medical Record System</div>
    <div class="login_container_container align-middle">
      <div class="login_container">
        <template v-if="developmentMode">
          <router-link to="/adminlogged">Admin</router-link>
          <br>
          <router-link to="/doctorlogged">Doctor</router-link>
          <br>
          <router-link to="/nurselogged">Nurse</router-link>
          <br>
          <router-link to="/userlogged">User</router-link>
          <br>
        </template>
        <label>Username</label>
        <div class="input-group mb-3">
          <input
            v-model="username"
            type="text"
            class="form-control"
            placeholder="Username"
            aria-label="Username"
            aria-describedby="basic-addon2"
          >
        </div>
        <label>Password</label>
        <div class="form-group pass_show">
          <input v-model="password" type="password" class="form-control" placeholder="Password">
        </div>
        <div class="login_button_container">
          <button
            v-on:click="sendLoginRequest()"
            class="btn btn-light btn-lg login_button"
          >Login</button>
        </div>
      </div>
    </div>
    <div>
      <footer class="page-footer font-small">CENG472</footer>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import { axios } from "../main.js";
import { hashScript } from "../main.js";
// import hashScript from "./js/hash.js";
// https://github.com/h2non/jshashes

export default {
  name: "home",
  components: {},
  created() {
    axios
      .post("/get-random", {})
      .then(this.getRandomResponse)
      .catch(this.getRandomError);
  },
  data() {
    return {
      developmentMode: false,
      warning: false,
      warningMsg: "",
      SHA256: new hashScript.SHA256(),
      username: "",
      password: "",
      random: -1
    };
  },
  methods: {
    sendLoginRequest() {
      if (this.username.match(/[^A-Za-z0-9]/)) {
        console.log("You can't use special characters.");
        this.warning = true;
        this.warningMsg = "You can't use special characters.";
      } else {
        var data = {
          username: this.username,
          password: this.SHA256.hex(this.password),
          random: this.random
        };
        // PRINT LOGIN DATA
        // console.log(data)
        axios
          .post("/login", data)
          .then(this.setupLoginResponse)
          .catch(function(error) {
            console.log(error);
          });
      }
    },
    setupLoginResponse(res) {
      //response argument
      console.log(res);
      if (res.data.routeName) {
        this.$router.push({
          name: res.data.routeName,
          params: { myId: res.data._id, sessionId: res.data.sessionId }
        });
      }
      else{
        console.log(res.data);
        this.warning = true;
        this.warningMsg = res.data;
      }
    },
    getRandomResponse(res) {
      console.log(res.data.random);
      this.random = res.data.random;
      // this.random = 300
      console.log(this.random);
    },
    getRandomError(err) {
      console.log(err);
    }
  },
  mounted() {}
};
</script>
