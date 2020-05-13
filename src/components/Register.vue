<template>
  <div>
    <div class="container">
      <div class="row">
        <div class="col s12 m8 offset-m2">
          <div class="login card-panel grey lighten-4 black-text center">
            <h3>Register</h3>
            <form action="index.html">
              <div class="input-field">
                <i class="material-icons prefix">email</i>
                <input type="email" id="email" v-model="email" />
                <label for="email">Email Address</label>
              </div>
              <div class="input-field">
                <i class="material-icons prefix">lock</i>
                <input type="password" id="password" v-model="password" />
                <label for="password">Password</label>
              </div>
              <button
                @click="register"
                class="btn btn-large btn-extended grey lighten-4 black-text"
              >
                Register
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

const confirmMessage =
  "Account Created Successfully, you will receive an email verification shortly.";

export default {
  name: "register",
  data: function() {
    return {
      email: "",
      password: ""
    };
  },
  methods: {
    register: function(e) {
      auth.createUserWithEmailAndPassword(this.email, this.password).then(
        userData => {
          //Send an email verification
          userData.user.sendEmailVerification();
          alert(confirmMessage);
        },
        err => {
          alert(err.message);
        }
      );
      e.preventDefault();
    }
  },
  mounted() {
    //Add materialize
    M.AutoInit();
  }
};
</script>
