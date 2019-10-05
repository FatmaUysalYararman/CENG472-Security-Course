<template>
  <div class="edit_div" v-if="toggleEdit">
    <div class="input-group input-group mb-3">
      <input
        v-model="username"
        type="text"
        class="form-control"
        placeholder="Username"
        aria-label="Username"
        aria-describedby="basic-addon1"
      >
      <button v-on:click="save(0)" type="button" class="btn btn-success">Save</button>
    </div>
    <div class="input-group input-group mb-3">
      <input
        v-model="password"
        type="password"
        class="form-control"
        placeholder="password"
        aria-label="password"
        aria-describedby="basic-addon1"
      >
      <button v-on:click="save(1)" type="button" class="btn btn-success">Save</button>
    </div>
    <div class="input-group input-group mb-3">
      <input
        v-model="name"
        type="text"
        class="form-control"
        placeholder="name"
        aria-label="name"
        aria-describedby="basic-addon1"
      >
      <button v-on:click="save(2)" type="button" class="btn btn-success">Save</button>
    </div>
    <div class="input-group input-group mb-3">
      <input
        v-model="surname"
        type="text"
        class="form-control"
        placeholder="surname"
        aria-label="surname"
        aria-describedby="basic-addon1"
      >
      <button v-on:click="save(3)" type="button" class="btn btn-success">Save</button>
    </div>

    <div class="input-group input-group-sm mb-3">
      <select v-model="usertype" class="custom-select" id="inputGroupSelect01">
        <option value selected>Select user type</option>
        <option value="doctor">Doctor</option>
        <option value="nurse">Nurse</option>
        <option value="user">User</option>
      </select>
      <button v-on:click="save(4)" type="button" class="btn btn-success">Save</button>
    </div>
    <div class="col-md-12 text-center">
      <p v-show="isReqSent">Request sent</p>
      <button v-on:click="toggle" type="button" class="btn btn-danger">Close</button>
    </div>
  </div>
</template>

<script>
import { axios } from "@/main.js";
import { hashScript } from "@/main.js";
export default {
  data() {
    return {
      username: "",
      password: "",
      name: "",
      surname: "",
      usertype: "",
      isReqSent: false
    };
  },
  props: ["toggleEdit", "lastUserId", "sessionId"],
  methods: {
    toggle() {
      this.$emit("toggle");
    },
    save(opno) {
      console.log(opno);
      switch (opno) {
        case 0: //username,
          // console.log(this.username + "\n" + this.password + "\n" + this.name + "\n" + this.surname + "\n" + this.usertype)
          axios
            .post("/useredit", {
              opno: opno,
              userId: this.lastUserId,
              username: this.username,
              sessionId: this.sessionId
            })
            .then(this.reqSent)
            .catch(this.errorFunction);
          break;
        case 1: //password
          var SHA256 = new hashScript.SHA256()
          axios
            .post("/useredit", {
              opno: opno,
              userId: this.lastUserId,
              password: SHA256.hex(this.password),
              sessionId: this.sessionId
            })
            .then(this.reqSent)
            .catch(this.errorFunction);
          break;
        case 2: //name
          axios
            .post("/useredit", {
              opno: opno,
              userId: this.lastUserId,
              name: this.name,
              sessionId: this.sessionId
            })
            .then(this.reqSent)
            .catch(this.errorFunction);
          break;
        case 3: //surname
          axios
            .post("/useredit", {
              opno: opno,
              userId: this.lastUserId,
              surname: this.surname,
              sessionId: this.sessionId
            })
            .then(this.reqSent)
            .catch(this.errorFunction);
          break;
        case 4: //type
          if (this.usertype != "") {
            axios
              .post("/useredit", {
                opno: opno,
                userId: this.lastUserId,
                usertype: this.usertype,
                sessionId: this.sessionId
              })
              .then(this.reqSent)
              .catch(this.errorFunction);
          }

          break;
        default:
      }
    },
    reqSent(data) {
      console.log(data);
      this.$emit("save")
    },
    errorFunction(error) {
      console.log(error);
    }
  }
};
</script>
