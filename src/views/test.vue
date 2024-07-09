<template>
	<h1> {{ count1 }} </h1>
	<h1> {{ count2 }} </h1>
	<button @click="count1++">count1</button>
	<button @click="count2++">count2</button>
</template>

<script setup>
	import { watch, ref } from 'vue';
	
	const count1 = ref(0)
	const count2 = ref(0)
	
	watch(
		// 监听的表达式或函数
		() => ({
			count1: count1.value,
			count2: count2.value
		}),
		// 回调函数
		(newValue, oldValue) => {
			// 在这里执行需要的逻辑
			console.log('count1 或 count2 变化了：', newValue);
		},
		// immediate: true 表示在初始渲染时立即执行一次回调函数，以便处理初始的状态。
		// deep: true 表示深度监听，即对 newValue 和 oldValue 进行深层比较，而不是简单的引用比较。
		{ immediate: true, deep: true }
	);
</script>

<style scoped>
</style>