<template>
	<el-row style="margin-bottom: 10px;">
		<!-- 搜索框 -->
		<div>
			<el-input v-model="searchValue.empName" style="width: 400px; " size="small" placeholder="请输入姓名" type="text">
				<template #prepend>
				    <el-button @click="handleSearch" :icon="Search" />
				</template>
				<template #append>
					<el-select v-model="searchValue.deptId" placeholder="部门" style="width: 140px;">
						<el-option key="" label="无" value=""></el-option>
						<el-option v-for="item in departmentList" :key="item.deptId" :label="item.deptName" :value="item.deptId"></el-option>
					</el-select>
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
	
	<el-table :data="employeeList" border :header-cell-class-name="headerBg" @selection-change="handleSelectionChange" max-height=530>
		<el-table-column type="selection" width="55"/>
		<el-table-column prop="employee.empName" label="姓名" width="120"></el-table-column>
		<el-table-column prop="employee.gender" label="性别" width="100"></el-table-column>
		<el-table-column prop="employee.age" label="年龄" width="100"></el-table-column>
		<el-table-column prop="employee.email" label="邮箱" width="160"></el-table-column>
		<el-table-column prop="employee.phone" label="电话" width="160"></el-table-column>
		<el-table-column prop="department.deptName" label="部门" width="120"></el-table-column>
		<el-table-column prop="employee.address" label="地址"></el-table-column>
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
	
	<div style="padding: 10px 0; position: absolute; bottom: 2%;">
		<el-pagination
			@size-change="handleSizeChange"
			@current-change="handleCurrentChangea"
			v-model:current-page="searchValue.currentPage"
			:page-sizes="[2 ,5, 10, 15, 20]"
			:page-size="searchValue.pageSize"
			layout="total, sizes, prev, pager, next, jumper"
			:total="count" >
		</el-pagination>
	</div>
</template>

<script setup>
	// 导入依赖
	import { ref, onMounted, reactive } from 'vue';
	import { ElInput, ElButton, ElTable, ElTableColumn, ElPagination, ElMessage } from 'element-plus';
	import { Search, CirclePlus, Remove, Download, Upload, Lock } from '@element-plus/icons-vue';
	import { get, post, accessHeader } from '@/net';
	import router from '@/router';
	
	// // 响应式数据定义
	let employeeList = ref([]);
	// const addDialogVisible = ref(false)
	// const editDialogVisible = ref(false)
	
	// const headerBg = ref('headerBg');
	
	// let selectedRowList = ref([])
	const count = ref(0)
	
	let fileName = ref("multipartFiles")
	let headers =ref(accessHeader())
	let fileList =ref([])
	let postUrl = ref("")
	
	// const addFormRef = ref()
	// const editFormRef = ref()
	
	// 处理分页大小变化
	const handleSizeChange = (val) => {
		searchValue.pageSize = val;
		initializePage();
	};
	
	// 处理当前页码变化
	const handleCurrentChangea = (val) => {
		console.log(searchValue)
		initializePage();
	};
	
	let departmentList = ref([])
	
	// let account = reactive({
		
	// })
	
	let searchValue = reactive({
		empName: '',
		deptId: '',
		currentPage: 1,
		pageSize: 2
	})
	
	// 页面初始化加载数据
	onMounted(() => {
		initializePage();
	});
	
	  // 初始化页面数据
	function initializePage() {
		post(`/employees/get`, searchValue, (data) => {
			employeeList.value = data.map(employee => {
				employee.employee.gender = employee.employee.gender === 1 ? "男" : "女"
				return employee
			})
		})
		post(`/employees/get/const`, searchValue, (data) => {
			count.value = data
		})
		get(`/departments/get`, (data) => {
			departmentList.value = data
		})
		handleClose()	
	}
	
	function handleSearch() {
		searchValue.currentPage = 1
		initializePage()
	};
	
	function handleClose() {
		
	}
</script>

<style scoped>
</style>