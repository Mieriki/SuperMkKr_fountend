import { createStore } from 'vuex'

const store = createStore({
	state: {
		num: 100
	},
	mutations: {
		increment (state) {
		    state.num++
		  }
	},
	actions: {},
	modules: {}
})

export default store