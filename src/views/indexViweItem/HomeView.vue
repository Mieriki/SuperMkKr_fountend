<template>
	<el-empty description="description" />
	<!-- <h1> {{ $store.state.num }} </h1>
	<h1> {{ store.state.num }} </h1> -->
	<!-- <el-button @click="store.commit('increment')"></el-button> -->
	<!-- <el-avatar :fit="fit" :size="50" src="https://github.com/Mieriki/AcgnCard/blob/main/img/characters.png?raw=true" /> -->
</template>

<script setup>
	import { useStore } from 'vuex';
	const store  = useStore()
	console.log(store)
</script>
	
<style scoped>

</style>