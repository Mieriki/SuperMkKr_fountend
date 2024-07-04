<template>
	<div style="margin-bottom: 10px;">
		<el-row>
			<el-input v-model="searchValue" style="width: 240px;" size="small" placeholder="请输入名称" type="text">
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
				:limit="1"
				:multiple="false"
				:show-file-list="false"
				:on-success="uploadSuccess">
				<el-button type="primary" style="margin-left: 5px; width: 80px; height: 32px;" size="small">导入<el-icon><Download /></el-icon></el-button>
			</el-upload>
			<el-button type="primary" style="margin-left: 5px; width: 80px; height: 32px;" size="small" @click="exportData">导出<el-icon><Upload /></el-icon></el-button>
		</el-row>
	</div>
	<!-- 按钮 -->
	
	<el-table :data="billList" border :header-cell-class-name="headerBg" @selection-change="handleSelectionChange" max-height=530>
		<el-table-column type="selection" width="55"/>
		<el-table-column prop="billCode" label="订单编号" width="120">
		</el-table-column>
		<el-table-column prop="productName" label="商品名称" width="170">
		</el-table-column>
		<el-table-column prop="productDesc" label="简介" width="150">
		</el-table-column>
		<el-table-column prop="productUnit" label="单位" width="80">
		</el-table-column>
		<el-table-column prop="productCount" label="数量" width="100">
		</el-table-column>
		<el-table-column prop="totalPrice" label="金额" width="140">
		</el-table-column>
		<el-table-column prop="paymentVo" label="是否付款" width="100">
		</el-table-column>
		<el-table-column prop="providerNameVo" label="供应商" width="180">
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
	    v-model:current-page="currentPage"
	    :page-sizes="[5, 10, 15, 20]"
	    :page-size="pageSize"
	    layout="total, sizes, prev, pager, next, jumper"
	    :total="count">
	  </el-pagination>
	</div>
	
	<el-dialog
		v-if="addDialogVisible"
		v-model="addDialogVisible"
		width=620
	    :before-close="handleClose">
		<el-form :model="bill" :rules="rules" ref="formRef" label-width="100px">
			<el-form-item label="订单编号" prop="billCode" style="width: 300px;">
				<el-input v-model="bill.billCode"></el-input>
			</el-form-item>
			<el-form-item label="商品名称" prop="productName" style="width: 500px;">
				<el-input v-model="bill.productName"></el-input>
			</el-form-item>
			<el-form-item label="简介" prop="productDesc" style="width: 500px;">
				<el-input v-model="bill.productDesc"></el-input>
			</el-form-item>
			<el-form-item label="单位" prop="productUnit" style="width: 500px;">
				<el-input v-model="bill.productUnit"></el-input>
			</el-form-item>
			<el-form-item label="数量" prop="productCount" style="width: 500px;">
				<el-input v-model="bill.productCount" type="number"></el-input>
			</el-form-item>
			<el-form-item label="金额" prop="totalPrice" style="width: 500px;">
				<el-input v-model="bill.totalPrice" type="number"></el-input>
			</el-form-item>
			 <el-form-item label="是否付款" prop="payment" style="width: 400px;">
			    <el-radio-group v-model="bill.payment">
			      <el-radio :label="1">是</el-radio>
			      <el-radio :label="0">否</el-radio>
			    </el-radio-group>
			  </el-form-item>
			<el-form-item label="供应商" prop="providerId" style="width: 250px;">
				<el-select v-model="bill.providerId" placeholder="请选择">
					<el-option v-for="item in providerNameList" :key="item.proId" :label="item.proName" :value="item.proId"></el-option>
				</el-select>
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
		<el-form :model="bill" :rules="rules" ref="formRef" label-width="100px">
			<el-form-item label="订单编号" prop="billCode" style="width: 300px;">
				<el-input v-model="bill.billCode"></el-input>
			</el-form-item>
			<el-form-item label="商品名称" prop="productName" style="width: 500px;">
				<el-input v-model="bill.productName"></el-input>
			</el-form-item>
			<el-form-item label="简介" prop="productDesc" style="width: 500px;">
				<el-input v-model="bill.productDesc"></el-input>
			</el-form-item>
			<el-form-item label="商品" prop="productUnit" style="width: 500px;">
				<el-input v-model="bill.productUnit"></el-input>
			</el-form-item>
			<el-form-item label="数量" prop="productCount" style="width: 500px;">
				<el-input v-model="bill.productCount" type="number"></el-input>
			</el-form-item>
			<el-form-item label="金额" prop="totalPrice" style="width: 500px;">
				<el-input v-model="bill.totalPrice" type="number"></el-input>
			</el-form-item>
			 <el-form-item label="是否付款" prop="payment" style="width: 400px;">
			    <el-radio-group v-model="bill.payment">
			      <el-radio :label="1">是</el-radio>
			      <el-radio :label="0">否</el-radio>
			    </el-radio-group>
			  </el-form-item>
			<el-form-item label="供应商" prop="providerId" style="width: 400px;">
				<el-select v-model="bill.providerId" placeholder="请选择">
					<el-option v-for="item in providerNameList" :key="item.proId" :label="item.proName" :value="item.proId"></el-option>
				</el-select>
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
	import { get, post, accessHeader  } from '@/net';
	import router from '@/router';
	
	// 响应式数据定义
	const searchValue = ref('');
	let billList = ref([]);
	const addDialogVisible = ref(false)
	const editDialogVisible = ref(false)
	const accountId = ref(null)
	
	// 分页相关变量
	const currentPage = ref(1);
	const pageSize = ref(10);
	let selectedRowList = ref([])
	const count = ref(0)
	
	let fileName = ref("multipartFiles")
	let headers =ref(accessHeader())
	let fileList =ref([])
	let postUrl = ref("http://localhost:8080/bill/upload")
	
	const formRef = ref()
	
	let providerNameList = ref([])
	
	let bill = reactive({
		billId: null,
		billCode: '',
		productName: '',
		productDesc: '',
		productUnit: '',
		productCount: null,
		totalPrice: null,
		payment: '',
		createdBy: 0,
		creationDate: '', 
		modifyBy: 0,
		modifyDate: '',
		providerId: '',
	})
		
	// 页面初始化加载数据
	onMounted(() => {
		get('/super-mk/api/v0.2/accounts/me/id', (data) => {
			if (data) {
				accountId.value = data
				bill.modifyBy = accountId.value
				bill.createdBy = accountId.value
			}
		})
		initializePage();
	});
	
	  // 初始化页面数据
	function initializePage() {
		get(`/bill/find-all?offset=${(currentPage.value - 1) * pageSize.value}&pageSize=${pageSize.value}`, (data) => {
			billList.value = data;
		});
		get('/bill/count', (data) => {
			count.value = data;
		});
		get('/provider/find-all-list', (data) => {
			providerNameList.value = data;
		});
		handleClose()
	};
	
    function handleClose() {
		addDialogVisible.value = false
		editDialogVisible.value = false
		bill.billId = null
		bill.billCode = ''
		bill.productName = ''
		bill.productDesc = ''
		bill.productUnit = ''
		bill.productCount = null
		bill.totalPrice = null
		bill.payment = ''
		bill.creationDate = null
		bill.modifyDate = null
		bill.providerId = null
	}
	
	const handleSearch = () => {
		get(`/bill/find-like?productName=${searchValue.value}&offset=${(currentPage.value - 1) * pageSize.value}&pageSize=${pageSize.value}`, (data) => {
			billList.value = data;
		});
	};
	
	// 跳转到新增页面
	function nextAdd() {
		addDialogVisible.value = true
	};
	
	const handleEdit = (row) => {
		get(`/bill/find-bill?billId=${ref(row).value.billId}`, (data) => {
			bill.billId = data.billId
			bill.billCode = data.billCode
			bill.productName = data.productName
			bill.productDesc = data.productDesc
			bill.productUnit = data.productUnit
			bill.productCount = data.productCount
			bill.totalPrice = data.totalPrice
			bill.payment = data.payment ? 1 : 0
			bill.modifyDate = null
			bill.providerId = data.providerId
		});
		editDialogVisible.value = true
	};
	
	function handleDeleteAccounts() {
		post('/bill/delete', selectedRowList.value, () => {
			ElMessage.success(`删除成功!`)
			initializePage();
		})
	};
	
	function handleSelectionChange(selection) {
		selectedRowList.value = selection;
	};
	
	const handleDeleteAccount = (ros) => {
		post('/bill/delete', [ros], () => {
			ElMessage.success(`删除成功!`)
			initializePage();
		})
	}
	
	function exportData() {
		window.open('http://localhost:8080/bill/export')
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
		billCode: [{ required: true, message: '请输入订单编号', trigger: 'blur' }],
		productName: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
		productDesc: [{ required: true, message: '请输入商品简介', trigger: 'blur' }],
		productUnit: [{ required: true, message: '请输入商品单位', trigger: 'blur' }],
		productCount: [{ required: true, message: '请输入商品数量', trigger: 'blur' }],
		totalPrice: [{ required: true, message: '请输入商品金额', trigger: 'blur' }],
		payment: [{ required: true, message: '请选择是否付款', trigger: 'change' }],
		providerId: [{ required: true, message: '请选择供应商', trigger: 'change' }],
	};
	
	function addSubmitForm() {
		formRef.value.validate((isValid) => {
			if(isValid) {
				post('/bill/add', bill, () => {
					ElMessage.success('添加成功!')
					initializePage()
				})
			} else {
	            ElMessage.warning('请完整填写注册表单内容!')
	        }
		});
	}
	
	function editSubmitForm() {
		console.log(bill)
		formRef.value.validate((isValid) => {
			if(isValid) {
				post('/bill/modify', bill, () => {
					ElMessage.success('修改成功!')
					initializePage()
				})
			} else {
	            ElMessage.warning('请完整填写注册表单内容!')
	        }
		});
	}
</script>

<style>
</style>