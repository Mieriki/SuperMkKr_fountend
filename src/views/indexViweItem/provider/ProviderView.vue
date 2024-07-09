<template>
<!-- 搜索框 -->
<div style="margin-bottom: 10px;">
	<el-row>
		<el-input v-model="searchValue.proName" style="width: 240px;" size="small" placeholder="请输入名称" type="text">
			<template #prepend>
				<el-button @click="handleSearch" :icon="Search" />
			</template>
		</el-input>
		<el-button  @click="handleSearch" style="margin-left: 5px; width: 75px; height: 32px;" size="small" type="primary">搜索</el-button>
		
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
</div>
	
	<!-- 按钮 -->
	
	<el-table :data="providerList" border :header-cell-class-name="headerBg" @selection-change="handleSelectionChange" max-height=530>
		<el-table-column type="selection" width="55"/>
		<el-table-column prop="proCode" label="供应商编号" width="120">
		</el-table-column>
		<el-table-column prop="proName" label="供应商名称" width="170">
		</el-table-column>
		<el-table-column prop="proDesc" label="供应商简介" width="150">
		</el-table-column>
		<el-table-column prop="proContact" label="联系人" width="120">
		</el-table-column>
		<el-table-column prop="proPhone" label="电话" width="140">
		</el-table-column>
		<el-table-column prop="proFax" label="传真" width="140">
		</el-table-column>
		<el-table-column prop="proAddress" label="地址">
		</el-table-column>
		<el-table-column label="操作" fixed="right">
			<template #default="scope">
				<el-button size="small" type="warning" @click="handleEdit(scope.row)">编辑</el-button>
				<el-button type="danger" size="small" @click="handleDeleteAccount(scope.row)">删除</el-button>
			</template>
		</el-table-column>
	</el-table>

	<div style="padding: 10px 0; position: absolute; bottom: 2%;">
		<el-pagination
			@size-change="handleSizeChange"
			@current-change="handleCurrentChange"
			v-model:current-page="searchValue.currentPage"
			:page-sizes="[5, 10, 15, 20]"
			:page-size="searchValue.pageSize"
			layout="total, sizes, prev, pager, next, jumper"
			:total="count">
		</el-pagination>
	</div>
	
	<el-dialog
		v-if="addDialogVisible"
		v-model="addDialogVisible"
		width=620
	    :before-close="handleClose">
		<el-form :model="provider" :rules="rules" ref="formRef" label-width="100px">
			<el-form-item label="供应商编号" prop="proCode" style="width: 300px;">
				<el-input v-model="provider.proCode"></el-input>
			</el-form-item>
			<el-form-item label="供应商名称" prop="proName" style="width: 500px;">
				<el-input v-model="provider.proName"></el-input>
			</el-form-item>
			<el-form-item label="供应商简介" prop="proDesc" style="width: 500px;">
				<el-input v-model="provider.proDesc"></el-input>
			</el-form-item>
			<el-form-item label="联系人" prop="proContact" style="width: 300px;">
				<el-input v-model="provider.proContact"></el-input>
			</el-form-item>
			<el-form-item label="电话" prop="proPhone" style="width: 400px;">
				<el-input v-model="provider.proPhone"></el-input>
			</el-form-item>
			<el-form-item label="传真" prop="proFax" style="width: 400px;">
				<el-input v-model="provider.proFax"></el-input>
			</el-form-item>
			<el-form-item label="地址" prop="proAddress" style="width: 500px;">
				<el-input v-model="provider.proAddress"></el-input>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" style="width: 290px; margin-top: 20px; margin-left: 30px;" @click="addSubmitForm">新增</el-button>
			</el-form-item>
		</el-form>
	</el-dialog>
	
	<el-dialog
		v-if="editDialogVisible"
		v-model="editDialogVisible"
		width=620
	    :before-close="handleClose">
		<el-form :model="provider" :rules="rules" ref="formRef" label-width="100px">
			<el-form-item label="供应商编号" prop="proCode" style="width: 300px;">
				<el-input v-model="provider.proCode"></el-input>
			</el-form-item>
			<el-form-item label="供应商名称" prop="proName" style="width: 500px;">
				<el-input v-model="provider.proName"></el-input>
			</el-form-item>
			<el-form-item label="供应商简介" prop="proDesc" style="width: 500px;">
				<el-input v-model="provider.proDesc"></el-input>
			</el-form-item>
			<el-form-item label="联系人" prop="proContact" style="width: 300px;">
				<el-input v-model="provider.proContact"></el-input>
			</el-form-item>
			<el-form-item label="电话" prop="proPhone" style="width: 400px;">
				<el-input v-model="provider.proPhone"></el-input>
			</el-form-item>
			<el-form-item label="传真" prop="proFax" style="width: 400px;">
				<el-input v-model="provider.proFax"></el-input>
			</el-form-item>
			<el-form-item label="地址" prop="proAddress" style="width: 500px;">
				<el-input v-model="provider.proAddress"></el-input>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" style="width: 290px; margin-top: 20px; margin-left: 30px;" @click="editSubmitForm">修改</el-button>
			</el-form-item>
		</el-form>
	</el-dialog>
</template>

<script setup>
	// 导入依赖
	import { ref, onMounted, reactive } from 'vue';
	import { ElInput, ElButton, ElTable, ElTableColumn, ElPagination, ElMessage } from 'element-plus';
	import { Search, CirclePlus, Remove, Download, Upload } from '@element-plus/icons-vue';
	import { get, post, accessHeader } from '@/net';
	import router from '@/router';
	
	// 响应式数据定义
	let providerList = ref([]);
	const addDialogVisible = ref(false)
	const editDialogVisible = ref(false)
	const accountId = ref(null)
	
	// 分页相关变量
	let selectedRowList = ref([])
	const count = ref(0)
	
	let searchValue = reactive({
		proName: '',
		currentPage: 1,
		pageSize: 10
	})
	
	let fileName = ref("multipartFiles")
	let headers =ref(accessHeader())
	let fileList =ref([])
	let postUrl = ref("http://localhost:8080/provider/upload")
		
	const formRef = ref()
	// 页面初始化加载数据
	onMounted(() => {
		get('/super-mk/api/v0.2/accounts/me/id', (data) => {
			if (data) {
				accountId.value = data
				provider.createdBy = accountId.value;
				provider.modifyBy = accountId.value;
			}
		})
		initializePage();
	});
	
	// 初始化页面数据
	function initializePage() {
		post(`super-mk/api/v0.2/providers/tables`, searchValue, (data) => {
			providerList.value = data;
		});
		post('super-mk/api/v0.2/providers/count', searchValue, (data) => {
			count.value = data
		})
		handleClose()
	};
	
	function handleClose() {
		addDialogVisible.value = false
		editDialogVisible.value = false
		provider.proId = null,
		provider.proCode = '',
		provider.proName = '',
		provider.proDesc = '',
		provider.proContact = '',
		provider.proPhone = '',
		provider.proAddress = '',
		provider.proFax = '',
		provider.creationDate = '',
		provider.modifyDate = null
	}
	
	let provider = reactive({
		proId: null,
		proCode: '',
		proName: '',
		proDesc: '',
		proContact: '',
		proPhone: '',
		proAddress: '',
		proFax: '',
		createdBy: null,
		creationDate: '',
		modifyBy: '',
		modifyDate: null
	})
	
	
	function addSubmitForm() {
	    formRef.value.validate((valid) => {
	        if (valid) {
				post('/provider/add', provider, () => {
					ElMessage.success('添加成功!')
					// router.push('/provider')
					initializePage()
				})
	        } else {
	            // 表单验证失败，不执行提交操作
	            ElMessage.warning('请完整填写注册表单内容!');
	            return false;
	        }
	    });
	};
	
	function editSubmitForm() {
		formRef.value.validate((isValid) => {
			if(isValid) {
				post('/provider/modify', provider, () => {
					ElMessage.success('修改成功!')
					initializePage()
				})
			} else {
	            ElMessage.warning('请完整填写注册表单内容!')
	        }
		});
	}
	
	const handleSearch = () => {
		searchValue.currentPage = 1
		initializePage()
	};
	
	// 跳转到新增页面
	function nextAdd() {
		// router.push('provider-add');
		addDialogVisible.value = true
	};
	
	const handleDeleteAccount = (ros) => {
		get(`/super-mk/api/v0.2/providers/provider/${ros.proId}`, () => {
			ElMessage.success(`删除成功!`)
			initializePage();
		})
	}
	
	// 处理分页大小变化
	const handleSizeChange = (val) => {
		searchValue.pageSize = val;
		initializePage();
	};
	
	// 处理当前页码变化
	const handleCurrentChange = (val) => {
		initializePage();
	};
	
	function handleSelectionChange(selection) {
		selectedRowList.value = selection;
    };
	
	function handleDeleteAccounts() {
		post('/super-mk/api/v0.2/providers/providers', selectedRowList.value.map(pro => pro.proId), () => {
			ElMessage.success(`删除成功!`)
			initializePage();
		})
	};
	
	const handleEdit = (row) => {
		get(`/provider/get?proId=${ref(row).value.proId}`, (data) => {
			provider.proId = data.proId
			provider.proCode = data.proCode
			provider.proName = data.proName
			provider.proDesc = data.proDesc
			provider.proAddress = data.proAddress
			provider.proContact = data.proContact
			provider.proPhone = data.proPhone
			provider.proFax = data.proFax
		})
		editDialogVisible.value = true
	};
	
	function exportData() {
		window.open('http://localhost:8080/provider/export')
	}
	
	function uploadSuccess(data) {
		if (data.code === 200) {
			ElMessage.success("上传成功!")
		initializePage();
		} else (
			ElMessage.warning(data.message)
		)
	}
	
	const rules = {
	    proCode: [
	        { required: true, message: '请输入供应商编号', trigger: 'blur' },
	        { max: 20, message: '长度不能超过20个字符', trigger: 'blur' }
	    ],
	    proName: [
	        { required: true, message: '请输入供应商名称', trigger: 'blur' },
	        { max: 20, message: '长度不能超过20个字符', trigger: 'blur' }
	    ],
	    proDesc: [
			{ required: true, message: '请输入供应商简介', trigger: 'blur' },
	        { max: 50, message: '长度不能超过50个字符', trigger: 'blur' }
	    ],
	    proContact: [
			{ required: true, message: '请输入联系人', trigger: 'blur' },
	        { max: 20, message: '长度不能超过20个字符', trigger: 'blur' }
	    ],
	    proPhone: [
			{ required: true, message: '请输入电话', trigger: 'blur' },
	        { max: 20, message: '长度不能超过20个字符', trigger: 'blur' }
	    ],
	    proFax: [
			{ required: true, message: '请输入传真', trigger: 'blur' },
	        { max: 50, message: '长度不能超过50个字符', trigger: 'blur' }
	    ],
	    proAddress: [
			{ required: true, message: '请输入地址', trigger: 'blur' },
	        { max: 20, message: '长度不能超过20个字符', trigger: 'blur' }
	    ]
	}
	
</script>

<style scoped>
	
</style>