<template>
  <div v-if="toggleRecords">
    <table class="table">
      <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">Firstname</th>
          <th scope="col">Lastname</th>
          <th scope="col">Birthdate</th>
          <th scope="col">Diagnostic</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(record, index) in records.list" v-bind:key="record.id">
          <th scope="row">{{index+1}}</th>
          <td>{{record.name}}</td>
          <td>{{record.surname}}</td>
          <td>{{record.birthdate}}</td>
          <td>{{record.diagnostics}}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { axios } from "@/main.js";
export default {
  created() {},
  data() {
    return {
      records: {
        list: [
          {
            name: "a",
            surname: "a",
            birthdate: "a",
            diagnostics: "a"
          }
        ]
      }
    };
  },
  methods: {
    close() {
      this.$emit("toggle");
    },
    setupRecordsResponse(res) {
      console.log(res.data);
      this.records = res.data
    },
    setupRecordsError(err) {
      console.log(err);
    }
  },
  props: ["myId", "toggleRecords", "lastUserId", "sessionId"],
  watch: {
    lastUserId() {
      if (this.toggleRecords) {
        axios
          .post("/get-records", {
            requesterId: this.myId,
            userId: this.lastUserId,
            sessionId: this.sessionId
          })
          .then(this.setupRecordsResponse)
          .catch(this.setupRecordsError);
      }
    }
  }
}
</script>
