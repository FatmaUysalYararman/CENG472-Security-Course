<template>
  <div class="logged">
    <div class="container-fluid header">USER PANEL</div>
    <div class="row">
      <div class="col-md-2">
        <sidebar v-bind:loggedType="'user'" v-on:changeView="changeView"></sidebar>
      </div>
      <div class="col-md-10">
        <component v-if="currentComponentName=='user-table'" v-bind:sessionId="sessionId" v-bind:records="records" v-bind:myId="myId" v-bind:userType="userType" v-bind:is="currentComponent"></component>
        <component v-else-if="currentComponentName=='record-table'" v-bind:sessionId="sessionId" v-bind:records="records" v-bind:myId="myId" v-bind:is="currentComponent"></component>
        <component v-else v-bind:myId="myId" v-bind:sessionId="sessionId" v-bind:is="currentComponent"></component>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import Sidebar from '@/components/Sidebar.vue'
import LoggedHome from '@/components/LoggedHome.vue'
import UserUserTable from '@/components/user/UserUserTable.vue'
import UserRecordTable from '@/components/user/UserRecordTable.vue'
import { axios } from "@/main.js";

export default {
  created(){
    this.currentComponent = this.initialComponent
    this.records = this.cleanRecords()
    this.setupRecords();
  },
  components:{
    'sidebar': Sidebar ,
  },
  data(){
    return{
      records: {}, //cleanUsers()
      initialComponent: LoggedHome,
      currentComponent: null,
      currentComponentName: null,
      components:{
        "home": LoggedHome,
        "user-table": UserUserTable,
        "record-table": UserRecordTable
      },
      userType: null
    }
  },
  methods:{
    // SETUP USERS START
    setupRecords() {
      axios
        .post("/get-records", { requesterId: this.myId, sessionId: this.sessionId })
        .then(this.setupRecordsResponse)
        .catch(this.setupRecordsError)
    },
    setupRecordsResponse(res) {
      console.log(res.data);
      console.log(this.userType);
      // this.records = res.data
      this.records.list = res.data.list
    },
    setupRecordsError(error) {
      this.records = this.cleanRecords()
      console.log(error);
    },
    
    cleanRecords(){
      return {
        list:[]
      }
    },
    // SETUP USERS END

    changeComponent(component){
      // console.log("test")
      this.currentComponentName = component
      this.currentComponent = this.components[component]
    },
    changeView(view){
      if(view=="home"){
        this.changeComponent("home")
      }
      else if(view=="doctors" || view=="nurses" || view=="users"){
        this.changeComponent("user-table")
        this.userType = view
      }
      else if(view=="records"){
        this.changeComponent("record-table")
      }
    }
  },
  props:["myId", "sessionId"]
}
</script>