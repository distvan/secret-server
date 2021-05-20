<template>
  <div class="about">
    <h1></h1>
    <table class="input-table">
      <tr>
        <td>Secret text:</td>
        <td><input v-model="secretTextIn" class="text-input" type="text"></td>
      </tr>
      <tr>
        <td>Expire after views:</td>
        <td><input v-model="expireViewsIn" class="num-input" type="text"></td>
      </tr>
      <tr>
        <td>Expire after:</td>
        <td><input v-model="expireAfterIn" class="num-input" type="text"> (minutes)</td>
      </tr>
      <tr>
        <td><button @click="onClickCreateSecret">Create Secret</button></td>
        <td></td>
      </tr>
    </table>
    <div class="result-box">
      <h3>Hash value</h3>
      <p><input v-model="hashSearchIn" class="hash-input" type="text"></p>
      <button @click="onClickViewSecret">View Secret</button>
      <button @click="onClickClearSearch">Clear</button>
      <h3>Hash Value</h3>
      <p>{{ hashValue }}</p>
      <h3>Original text</h3>
      <p>{{ origText }}</p>
      <h3>Created at</h3>
      <p>{{ createdAtText }}</p>
      <h3>Expires at</h3>
      <p>{{ expiresAtText }}</p>
      <h3>Remaining views</h3>
      <p>{{ remainingViewText }}</p>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex"

export default {
  props: {},
  data(){
    return {
      noResultText: "???",
      secretTextIn: "",
      expireViewsIn: "",
      expireAfterIn: "",
      hashSearchIn: ""
    }
  },
  computed: {
    ...mapGetters(["hashValue", "origText", "createdAtText", "expiresAtText", "remainingViewText"]),
  },
  mounted() {
      this.defaultResultText()
  },
  methods: {
    onClickCreateSecret() {
      this.$store.dispatch('createDataSecret', {
        "secretText": this.secretTextIn,
        "expireAfterViews": this.expireViewsIn,
        "expireAfter": this.expireAfterIn
      })
      this.secretTextIn = ""
      this.expireViewsIn = ""
      this.expireAfterIn = ""
    },
    onClickViewSecret() {
      this.$store.dispatch('getDataSecret', this.hashSearchIn)
    },
    onClickClearSearch() {
      this.defaultResultText()
    },
    defaultResultText() {
      this.hashSearchIn = ""
    }
  },
  components: {}
}
</script>

<style>
.result-box{
  width: 900px;
  margin-left:auto;
  margin-right: auto;
}
.result-box button{
  margin-left: 10px;
}
.result-box h3{
  text-align: left;
}
.result-box p{
  text-align: left;
  font-weight: bold;
  color: green;
  font-style: italic;
}
.input-table{
  margin-left: auto;
  margin-right: auto;
  width: 500px;
}
.input-table tr{
  text-align: left;
}
.text-input{
  width: 350px;
}
.hash-input{
  width: 980px;
}
.num-input{
  width: 20px;
}
</style>