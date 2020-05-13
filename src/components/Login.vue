<template>
  <div>
    <div class="container">
      <div class="row">
        <div class="col s12 m8 offset-m2">
          <div class="login card-panel green lighten-2 black-text center">
            <h3>Login</h3>
            <form action="index.html">
              <div class="input-field">
                <i class="material-icons prefix">email</i>
                <input type="email" id="email" v-model="email" />
                <label class="black-text" for="email">Email Address</label>
              </div>
              <div class="input-field">
                <i class="material-icons prefix">lock</i>
                <input type="password" id="password" v-model="password" />
                <label class="black-text" for="password">Password</label>
              </div>
              <button
                @click="login"
                class="btn btn-large btn-extended grey lighten-4 black-text"
              >
                LOGIN
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { auth } from "./firebase";
import "materialize-css/dist/css/materialize.min.css";
import "material-design-icons/iconfont/material-icons.css";
import M from "materialize-css";

const requestEmailVerfication = "Please verify your email first.";

export default {
  name: "login",
  data: function() {
    return {
      email: "",
      password: ""
    };
  },
  mounted() {
    //Add materialize
    M.AutoInit();
  },
  methods: {
    login: function(e) {
      auth.signInWithEmailAndPassword(this.email, this.password).then(
        userData => {
          //###################################
          //Check the user's email is verified.
          if (userData.user.emailVerified) {
            this.$router.push({
              name: "Main",
              params: { user: userData.user }
            });
            //###################################
            //You can comment above code and uncomment below code
            //to allow non-email-verified user to login.
            // this.$router.push("/main");
          } else {
            //If not, ask the user to verify his/her email.
            alert(requestEmailVerfication);
          }
        },
        err => {
          alert(err.message);
        }
      );
      e.preventDefault();
    }
  }
};
</script>
