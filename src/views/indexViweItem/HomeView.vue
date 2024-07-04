<template>
	<h1> {{ $store.state.num }} </h1>
	<h1> {{ store.state.num }} </h1>
	<!-- <el-button @click="store.commit('increment')"></el-button> -->
</template>

<script setup>
	import { useStore } from 'vuex';
	const store  = useStore()
	console.log(store)
</script>
	
<style scoped>

</style>