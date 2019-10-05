<template>
  <div>
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
export default {
  created() {
    
  },
  data() {
    return {
      
    };
  },
  methods: {
    
  },
  props: ["myId", "records", "sessionId"],
  // watch: {
  //   userType() {
  //     this.refresh();
  //   }
  // }
};
</script>
