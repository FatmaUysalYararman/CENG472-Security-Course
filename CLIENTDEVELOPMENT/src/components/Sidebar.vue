<template>
<div class="sidebar">
   <nav class="nav flex-column nav-pills">

    <template v-if="loggedType=='admin'">
    <span v-on:click="changeView('home')" class="nav-link">Home</span>
    <span v-on:click="changeView('doctors')" class="nav-link">Doctors</span>
    <span v-on:click="changeView('nurses')" class="nav-link">Nurses</span>
    <span v-on:click="changeView('users')" class="nav-link">Users</span>
    </template>

    <template v-if="loggedType=='doctor'">
    <span v-on:click="changeView('home')" class="nav-link">Home</span>
    <span v-on:click="changeView('doctors')" class="nav-link">Doctors</span>
    <span v-on:click="changeView('nurses')" class="nav-link">Nurses</span>
    <span v-on:click="changeView('users')" class="nav-link">Users</span>
    </template>

    <template v-if="loggedType=='nurse'">
    <span v-on:click="changeView('home')" class="nav-link">Home</span>
    <span v-on:click="changeView('users')" class="nav-link">Users</span>
    </template>

    <template v-if="loggedType=='user'">
    <span v-on:click="changeView('home')" class="nav-link">Home</span>
    <span v-on:click="changeView('doctors')" class="nav-link">Doctors</span>
    <span v-on:click="changeView('records')" class="nav-link">Records</span>
    </template>

    <router-link to="/"><span class="nav-link">Logout</span></router-link>

  </nav>
</div>
</template>
<script>
export default {
  data(){
    return{
      
    }
  },
  methods:{
    changeView(view){
      console.log(this.loggedType)
      this.$emit("changeView", view)
    }
  },
  props:["loggedType"]

}
</script>
