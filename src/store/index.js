import { createStore } from 'vuex'

const store = createStore({
	state: {
		num:10, 
		accountId: null
	},
	mutations: {
		setAccountId(state, accountId) {
			state.accountId = accountId
		}
	},
	actions: {},
	modules: {},
	getters: {}
})

export default store