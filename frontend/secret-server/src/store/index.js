import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    hashValue: "",
    origText: "",
    createdAtText: "",
    expiresAtText: "",
    remainingViewText: ""
  },
  mutations: {
    setHashValue(state, payload){
      state.hashValue = payload
    },
    setOrigText(state, payload){
      state.origText = payload
    },
    setCreatedAtText(state, payload){
      state.createdAtText = payload
    },
    setExpiresAtText(state, payload){
      state.expiresAtText = payload
    },
    setRemainingViewText(state, payload){
      state.remainingViewText = payload
    }
  },
  actions: {
    getDataSecret({ commit }, hash){
      fetch("http://127.0.0.1:3000/api/secret/" + hash)
        .then(async response => {
          const data = await response.json()
          commit("setOrigText", data.secretText)
          commit("setCreatedAtText", data.createdAt)
          commit("setExpiresAtText", data.expiresAt)
          commit("setRemainingViewText", data.remainingViews)
        })
    },
    createDataSecret({ commit }, data){
      const requestOptions = {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
          "secret": data.secretText,
          "expireAfterViews": data.expireAfterViews,
          "expireAfter": data.expireAfter
        })
      }
      fetch("http://127.0.0.1:3000/api/secret", requestOptions)
        .then(async response => {
          const data = await response.json()
          commit("setHashValue", data.hash)
          commit("setOrigText", data.secretText)
          commit("setCreatedAtText", data.createdAt)
          commit("setExpiresAtText", data.expiresAt)
          commit("setRemainingViewText", data.remainingViews)
        })
    },
    clearData({ commit }){
      commit("setOrigText", "")
      commit("setCreatedAtText", "")
      commit("setExpiresAtText", "")
      commit("setRemainingViewText", "")
    }
  },
  getters: {
    hashValue: (state) => state.hashValue,
    origText: (state) => state.origText,
    createdAtText: (state) => state.createdAtText,
    expiresAtText: (state) => state.expiresAtText,
    remainingViewText: (state) => state.remainingViewText
  }
})
