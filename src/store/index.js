import { createStore } from 'vuex'

const store = createStore({
	state: {
		flash: false, 
		accountId: null
	},
	mutations: {
		setAccountId(state, accountId) {
			state.accountId = accountId
		}, 
		setFlash(state, flash) {
			state.flash = flash
		} 
	},
	actions: {},
	modules: {},
	getters: {}
})

export default store