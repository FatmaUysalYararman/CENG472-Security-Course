<template>
  <div class="logged">
    <div class="container-fluid header">ADMIN PANEL</div>
    <div class="row">
      <div class="col-md-2">
        <sidebar v-bind:loggedType="'admin'" v-on:changeView="changeView"></sidebar>
      </div>
      <div class="col-md-10">
        <component v-if="!currentComponentName=='user-table'" v-bind:sessionId="sessionId" v-bind:is="currentComponent"></component>
        <component v-else v-bind:myId="myId" v-bind:userType="userType" v-bind:sessionId="sessionId" v-bind:is="currentComponent"></component>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import Sidebar from '@/components/Sidebar.vue'
import LoggedHome from '@/components/admin/LoggedHome.vue'
import AdminUserTable from '@/components/admin/AdminUserTable.vue'

export default {
  created(){
    this.currentComponent = this.initialComponent
    console.log(this.myId)
  },
  components:{
    'sidebar': Sidebar ,
  },
  data(){
    return{
      initialComponent: LoggedHome,
      currentComponent: null,
      currentComponentName: null,
      components:{
        "home": LoggedHome,
        "user-table": AdminUserTable
      },
      userType: null
    }
  },
  methods:{
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
    }
  },
  props:["myId", "sessionId"]
}
</script>