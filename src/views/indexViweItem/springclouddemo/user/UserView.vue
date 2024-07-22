<template>
	<el-row style="margin-bottom: 10px;">
		<!-- 搜索框 -->
		<div>
			<el-input v-model="searchValue.username" style="width: 240px; " size="small" placeholder="请输入姓名" type="text">
				<template #prepend>
				    <el-button @click="handleSearch" :icon="Search" />
				</template>
			</el-input>	
		</div>
		
		<el-button  @click="handleSearch" style="margin-left: 5px; width: 75px; height: 32px;" size="small" type="primary">搜索</el-button>
		<el-row style="margin-left: 10px;">
			<el-button type="primary" style="width: 80px; height: 32px;" size="small" @click="nextAdd">新增<el-icon><CirclePlus /></el-icon></el-button>
			<el-button type="danger" style="margin-left: 5px; width: 80px; height: 32px;" size="small" @click="handleDeleteAccounts">批量删除<el-icon><Remove /></el-icon></el-button>
			<el-upload 
				list-type="text"
				accept=".xls, .xlsx"
				:file-list="fileList"
				:headers="headers"
				:action="postUrl"
				:multiple="false"
				:show-file-list="false"
				:on-success="uploadSuccess">
				<el-button type="primary" style="margin-left: 5px; width: 80px; height: 32px;" size="small">导入<el-icon><Download /></el-icon></el-button>
			</el-upload>
			<el-button type="primary" style="margin-left: 5px; width: 80px; height: 32px;" size="small" @click="exportData">导出<el-icon><Upload /></el-icon></el-button>
		</el-row>
	</el-row>
	
	<el-table :data="userList" border :header-cell-class-name="headerBg" @selection-change="handleSelectionChange" max-height=530>
		<el-table-column type="selection" width="55"/>
		<el-table-column prop="username" label="姓名" width="200">
		</el-table-column>
		<el-table-column prop="gender" label="性别" width="120">
		</el-table-column>
		<el-table-column prop="age" label="年龄" width="140">
		</el-table-column>
		<el-table-column prop="email" label="邮箱" width="300">
		</el-table-column>
		<el-table-column label="操作" fixed="right">
			<template #default="scope">
				<el-button size="small" type="warning" @click="handleEdit(scope.row)">编辑</el-button>
				<el-popconfirm 
					confirm-button-text="删除"
				    cancel-button-text="点错了"
				    :icon="InfoFilled"
					confirm-button-type="danger"
				    icon-color="#ef0004"
				    title="确认要删除此用户?"
					:width="200"
					@confirm="handleDeleteAccount(scope.row)"
					>
				    <template #reference>
						<el-button type="danger" size="small">删除</el-button>
				    </template>
				  </el-popconfirm>
			</template>
		</el-table-column>
	</el-table>
	
</template>

<script setup>
	// 导入依赖
	import { ref, onMounted, reactive } from 'vue';
	import { ElInput, ElButton, ElTable, ElTableColumn, ElPagination, ElMessage } from 'element-plus';
	import { Search, CirclePlus, Remove, Download, Upload, Lock } from '@element-plus/icons-vue';
	import { get, post, accessHeader } from '@/net';
	import router from '@/router';
	import { useStore } from 'vuex';
	
	const store  = useStore()
	
	// 响应式数据定义
	let userList = ref([]);
	const addDialogVisible = ref(false)
	const editDialogVisible = ref(false)
	const accountId = ref(null)
	
	const headerBg = ref('headerBg');
	
	
	// 分页相关变量
	// const currentPage = ref(1);
	// const pageSize = ref(10);
	let selectedRowList = ref([])
	const count = ref(0)
	
	let fileName = ref("multipartFiles")
	let headers =ref(accessHeader())
	let fileList =ref([])
	let postUrl = ref("http://localhost:8080/account/upload")
	
	const addFormRef = ref()
	const editFormRef = ref()
	
	let roleNameList = ref([])
	
	let user = reactive({
		userId: null,
		username: '',
		gender: '',
		age: null,
		email: '',
		userSource: '',
	})
	
	let searchValue = reactive({
		username: '',
		role: '',
		currentPage: 1,
		pageSize: 10
	})
	
	onMounted(() => {
		initializePage();
	});
	
	  // 初始化页面数据
	function initializePage() {
		get(`http://localhost:9001/springcloud/api/v0.1/users`, (data) => {
			userList.value = data.map(user => {
				user.gender = user.gender === 1 ? '男' : '女'
				return user
			})
		})
	};
</script>

<style>
</style>