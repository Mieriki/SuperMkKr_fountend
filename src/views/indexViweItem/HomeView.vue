<template>
	<h1> {{ $store.state.num }} </h1>
	<h1> {{ store.state.num }} </h1>
	<h1> {{ state.num }} </h1>
	<el-button @click="store.commit('increment')"></el-button>
</template>

<script setup>
	import { useStore, mapState } from 'vuex';
	const store  = useStore()
	const state = mapState(['num'])
	console.log(store)
	console.log(state)
</script>
	
<style scoped>

</style>