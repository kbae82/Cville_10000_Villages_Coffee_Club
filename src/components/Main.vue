<template>
  <div id="Main">
    <div class="container">
      <div class="notification is-success" v-if="state === 'synced'">
        Data synced with the server.
      </div>

      <div class="notification is-warning" v-else-if="state === 'modified'">
        Data changed, please click 'SAVE'
      </div>

      <div class="notification is-danger" v-else-if="state === 'error'">
        Failed to save data to the server {{ errorMessage }}
      </div>

      <div class="notification is-primary" v-else-if="state === 'notification'">
        {{ rewardMessage }}
      </div>

      <div class="notification is-info" v-else-if="state === 'loading'">
        Loading...
      </div>

      <div class="field-label" style="text-align:center;">
        <label class="label">Coffee Club Member</label>
      </div>

      <autocomplete
        :search="search"
        placeholder="Please type and select a name"
        @submit="renderSelectedData"
        @click="reloadServerData"
        :debounce-time="500"
        ref="autocomplete_input"
      >
      </autocomplete>
      <a
        href="#"
        id="addNew"
        @click="addNew"
        :hidden="isUpdating"
        style="margin-top:5px;"
        >&#10133; New member</a
      >
      <br />
      <hr />

      <form
        @submit.prevent="updateFirebase"
        ref="main_form"
        :hidden="!isNewEntry && !isUpdating"
      >
        <div class="field is-horizontal">
          <div class="field-body">
            <div class="field">
              <p class="control is-expanded has-icons-left">
                <input
                  type="text"
                  name="name"
                  ref="input_name"
                  class="input"
                  placeholder="Member's Name"
                  v-model="formData.name"
                  :disabled="!isNewEntry"
                />
              </p>
              <span class="icon is-small is-left">
                <i class="fas fa-user"></i>
              </span>
            </div>
            <div class="field">
              <p class="control is-expanded has-icons-left">
                <input
                  type="number"
                  min="0"
                  step="1"
                  name="coffee_count"
                  placeholder="Coffee Count ex) 5"
                  class="input"
                  v-model="formData.coffee_count"
                />
              </p>
              <span class="icon is-small is-left">
                <i class="fas fa-user"></i>
              </span>
            </div>
          </div>
        </div>

        <div class="columns">
          <div class="column" style="float:left">
            <p>
              Updated at:
            </p>

            <div type="label" id="lblLastUpdated">-</div>
          </div>

          <div class="column" style="float:right;text-align:right;">
            <p>
              Rewarded at:
            </p>
            <div type="label" id="lblLastDiscount">-</div>
          </div>
        </div>
        <div class="columns">
          <div class="column" style="text-align:center;">
            <button
              class="button is-success"
              :disabled="formData.name == null || formData.name == ''"
              type="submit"
              style="margin-left:5px;padding-left:20px;padding-right:20px;"
            >
              SAVE
            </button>
            <a
              href="#"
              id="btnCancel"
              class="button is-warning"
              style="margin-left:5px;"
              @click="clear"
              >CLEAR</a
            >
          </div>
        </div>
      </form>

      <hr />
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import Autocomplete from "@trevoreyre/autocomplete-vue";
import "@trevoreyre/autocomplete-vue/dist/style.css";
import { db } from "./firebase";
Vue.use(Autocomplete);

const discountCoffeeCount = 10;
const firestorePath = "cville/coffee/coffee_club/";

export default {
  name: "Main",
  data() {
    return {
      firebaseData: null,
      formData: {},
      firebaseNameDataMap: {},
      namesForSearch: [],
      state: "loading",
      isNewEntry: false,
      isUpdating: false
    };
  },
  methods: {
    search(input) {
      if (input.length < 2) {
        return [];
      } else {
        return this.namesForSearch.filter(name => {
          return name.toLowerCase().includes(input.toLowerCase());
        });
      }
    },
    reloadServerData() {
      this.state = "loading";
      var self = this;
      this.loadData().then(function() {
        self.state = "synced";
      });
    },
    async loadData() {
      let collectionRef = db.collection(firestorePath);
      let allDocs = await collectionRef.get();
      for (const doc of allDocs.docs) {
        this.firebaseNameDataMap[doc.id] = doc.data();
      }
      var names = Object.keys(this.firebaseNameDataMap);
      this.namesForSearch = names;
    },
    renderSelectedData(selectedName) {
      var autocomplete_input = this.$refs.autocomplete_input;
      autocomplete_input.value = "";
      let el = this.$el.querySelector(":focus");
      el.blur();

      this.formData = this.firebaseNameDataMap[selectedName];
      this.displayLastUpdateDate();
      this.displayDiscountUpdateDate();
      this.state = "synced";
      this.isUpdating = true;
      return;
    },
    addNew() {
      this.clear();
      this.isNewEntry = true;
      this.formData.coffee_count = 1;
      this.$nextTick(() => {
        this.$refs.input_name.focus();
      });
    },
    clear() {
      this.isNewEntry = false;
      this.isUpdating = false;
      this.state = "synced";
      this.formData = {};
      var autocomplete_input = this.$refs.autocomplete_input;
      autocomplete_input.value = "";
    },
    //Format values and update Firebase data
    async updateFirebase() {
      try {
        this.state = "modifed";

        //Every 10 coffee count, a member will get discount
        this.handleRewardCase();

        this.formData["name"] = this.formData["name"].trim();
        this.formData["last_update_date"] = Date.now();
        this.formData["last_updated_by"] = this.$route.params.user.email;
        await db.doc(firestorePath + this.formData["name"]).set(this.formData);

        if (this.state != "notification") {
          this.state = "synced";
        }
        if (this.state != "error") {
          this.isNewEntry = false;
        }
        //Display Firebase timestamp to local time
        this.displayLastUpdateDate();
        this.displayDiscountUpdateDate();
      } catch (error) {
        this.errorMessage = JSON.stringify(error);
        this.state = "error";
      }
    },
    handleRewardCase() {
      if (parseInt(this.formData["coffee_count"]) >= discountCoffeeCount) {
        this.formData["last_discount_date"] = Date.now();
        //We will record but won't display who did discount process
        this.formData["last_discounted_by"] = this.$route.params.user.email;
        //Set the reward message
        var rewardCount = parseInt(
          parseInt(this.formData["coffee_count"]) / discountCoffeeCount
        );
        this.formData["coffee_count"] =
          parseInt(this.formData["coffee_count"]) % discountCoffeeCount;
        this.rewardMessage =
          "Great! [" +
          this.formData["name"] +
          "] got coffee club reward! X " +
          rewardCount;
        this.state = "notification";
      }
    },
    displayLastUpdateDate() {
      document.getElementById(
        "lblLastUpdated"
      ).innerHTML = this.converToLocalDateTimeString(
        this.formData["last_update_date"]
      );
    },
    displayDiscountUpdateDate() {
      document.getElementById(
        "lblLastDiscount"
      ).innerHTML = this.converToLocalDateTimeString(
        this.formData["last_discount_date"]
      );
    },
    converToLocalDateTimeString(timestampString) {
      if (timestampString) {
        var datetimeToShow = new Date(timestampString);
        return (
          datetimeToShow.toLocaleDateString() +
          " " +
          datetimeToShow.toLocaleTimeString()
        );
      }
      return "-";
    }
  },
  created: async function() {
    this.state = "synced";
  }
};
</script>
<style>
@import url("https://cdn.jsdelivr.net/npm/bulma@0.8.0/css/bulma.min.css");

.autocomplete-input {
  padding: 12px 12px 12px 48px !important;
}

.container {
  margin: 0 auto !important;
  max-width: 1280px !important;
  width: 90% !important;
}

input {
  width: -webkit-fill-available !important;
}
</style>
