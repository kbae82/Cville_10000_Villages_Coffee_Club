<template>
  <nav>
    <div class="nav-wrapper green">
      <div class="container">
        <ul class="right">
          <li v-show="!user">
            <router-link class="btn green" to="/">Login</router-link>
          </li>
          <li v-show="!user">
            <router-link class="btn green" to="/register">Register</router-link>
          </li>
          <li v-show="user">
            <button @click="logout" class="btn grey">Logout</button>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
// import firebase from "firebase/app";
// import "firebase/auth";
import { root_auth } from "./firebase";

export default {
  name: "navbar",
  data() {
    return {
      user: null
    };
  },
  created() {
    root_auth.onAuthStateChanged(user => {
      //Set user for toggle Login Logout button
      this.user = user;

      //If user's email is not verified then set user
      if (this.user) {
        if (!this.user.emailVerified) {
          this.user = null;
        }
      }
    });
  },
  methods: {
    logout: function() {
      if (this.user != null) {
        root_auth.signOut().then(() => {
          this.$router.push("/");
        });
      }
    }
  }
};
</script>

<style scoped>
.email {
  padding-right: 10px;
}
.btn {
  margin-right: 0px;
}
</style>
