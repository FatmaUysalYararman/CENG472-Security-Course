<template>
  <div>
    <sidebar></sidebar>
    <h2>Logged</h2>
  </div>
</template>

<script>
// @ is an alias to /src
import Sidebar from '@/components/Sidebar.vue'

export default {
  
  components:{
    'sidebar': Sidebar 
  }
}
</script>
