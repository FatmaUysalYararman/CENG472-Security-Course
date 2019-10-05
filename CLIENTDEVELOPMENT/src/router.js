import Vue from 'vue'
import Router from 'vue-router'
import Home from './components/Home.vue'
import Logged from './components/Logged.vue'
import AdminLogged from './components/admin/AdminLogged.vue'
import DoctorLogged from './components/doctor/DoctorLogged.vue'
import NurseLogged from './components/nurse/NurseLogged.vue'
import UserLogged from './components/user/UserLogged.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      component: Home
    },
    {
      path: '/logged',
      component: Logged
    },
    {
      path: '/adminlogged',
      name: "adminlogged",
      component: AdminLogged,
      props: true
    },
    {
      path: '/doctorlogged',
      name: "doctorlogged",
      component: DoctorLogged,
      props: true
    },
    {
      path: '/nurselogged',
      name: "nurselogged",
      component: NurseLogged,
      props: true
    },
    {
      path: '/userlogged',
      name: "userlogged",
      component: UserLogged,
      props: true
    }
  ],

  mode: "history"
})
