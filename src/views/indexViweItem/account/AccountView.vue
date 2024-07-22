<template>
	<el-row style="margin-bottom: 10px;">
		<!-- 搜索框 -->
		<div>
			<el-input v-model="searchValue.username" style="width: 400px; " size="small" placeholder="请输入姓名或编号" type="text">
				<template #prepend>
				    <el-button @click="handleSearch" :icon="Search" />
				</template>
				<template #append>
					<el-select v-model="searchValue.role" filterable placeholder="职位" style="width: 140px;">
						<el-option key="" label="无" value=""></el-option>
						<el-option v-for="item in roleNameList" :key="item.roleName" :label="item.roleDescp" :value="item.roleName"></el-option>
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
	<!-- 按钮 -->
	
	<el-table :data="accountList" border :header-cell-class-name="headerBg" @selection-change="handleSelectionChange" max-height=530>
		<el-table-column type="selection" width="55"/>
		<el-table-column prop="userCode" label="员工编号" width="140">
		</el-table-column>
		<el-table-column prop="username" label="姓名" width="120">
		</el-table-column>
		<el-table-column prop="genderVo" label="性别" width="80">
		</el-table-column>
		<el-table-column prop="roleName" label="角色" width="120">
		</el-table-column>
		<el-table-column prop="phone" label="电话" width="140">
		</el-table-column>
		<el-table-column prop="address" label="地址">
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

	<div style="padding: 10px 0; position: absolute; bottom: 2%;">
		<el-pagination
			@size-change="handleSizeChange"
			@current-change="handleCurrentChange"
			v-model:current-page="searchValue.currentPage"
			:page-sizes="[5, 10, 15, 20]"
			:page-size="searchValue.pageSize"
			layout="total, sizes, prev, pager, next, jumper"
			:total="count" >
		</el-pagination>
	</div>
  
	<el-dialog
		v-if="addDialogVisible"
		v-model="addDialogVisible"
		width=620
        :before-close="handleClose">
		<el-form :model="account" :rules="addRules" ref="addFormRef" label-width="100px">
			<el-form-item label="员工编码" prop="userCode" style="width: 400px;">
				<el-input v-model="account.userCode"></el-input>
			</el-form-item>
			<el-form-item label="密码" prop="password" style="width: 300px;">
				<el-input v-model="account.password" type="password"></el-input>
			</el-form-item>
			<el-form-item label="重复密码" prop="passwordRepeat" style="width: 300px;">
				<el-input v-model="account.passwordRepeat" type="password"></el-input>
			</el-form-item>		
			<el-row>
				<el-form-item label="姓名" prop="username" style="width: 300px;">
					<el-input v-model="account.username"></el-input>
				</el-form-item>
				<el-form-item label="职位" prop="roleName" style="width: 250px;">
					<el-select v-model="account.roleName" placeholder="请选择">
						<el-option v-for="item in roleNameList" :key="item.roleName" :label="item.roleDescp" :value="item.roleName"></el-option>
					</el-select>
				</el-form-item>
			</el-row>
			<el-form-item label="性别" prop="gender">
				<el-radio-group v-model="account.gender">
					<el-radio label=1>男</el-radio>
					<el-radio label=2>女</el-radio>
				</el-radio-group>
			</el-form-item>
			<el-form-item label="生日" prop="birthday">
				<el-date-picker v-model="account.birthday" type="date" placeholder="选择日期"></el-date-picker>
			</el-form-item>
			<el-form-item label="电话" prop="phone" style="width: 500px;">
				<el-input v-model="account.phone"></el-input>
			</el-form-item>
			<el-form-item label="地址" prop="address" style="width: 500px;">
				<el-input v-model="account.address"></el-input>
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
			<el-form :model="account" :rules="editRules" ref="editFormRef" label-width="100px">
				<el-form-item label="员工编码" prop="userCode" style="width: 400px;">
					<el-input v-model="account.userCode"></el-input>
				</el-form-item>
				<el-row>
					<el-form-item label="姓名" prop="username" style="width: 300px;">
						<el-input v-model="account.username"></el-input>
					</el-form-item>
					<el-form-item label="职位" prop="roleName" style="width: 250px;">
						<el-select v-model="account.roleName" placeholder="请选择">
							<el-option v-for="item in roleNameList" :key="item.roleName" :label="item.roleDescp" :value="item.roleName"></el-option>
						</el-select>
					</el-form-item>
				</el-row>
				<el-form-item label="性别" prop="gender">
					<el-radio-group v-model="account.gender">
						<el-radio label=1>男</el-radio>
						<el-radio label=2>女</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="生日" prop="birthday">
					<el-date-picker v-model="account.birthday" type="date" placeholder="选择日期"></el-date-picker>
				</el-form-item>
				<el-form-item label="电话" prop="phone" style="width: 500px;">
					<el-input v-model="account.phone"></el-input>
				</el-form-item>
				<el-form-item label="地址" prop="address" style="width: 500px;">
					<el-input v-model="account.address"></el-input>
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
	import { Search, CirclePlus, Remove, Download, Upload, Lock } from '@element-plus/icons-vue';
	import { get, post, accessHeader } from '@/net';
	import router from '@/router';
	import { useStore } from 'vuex';
	
	const store  = useStore()

	// 响应式数据定义
	let accountList = ref([]);
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
	
	let account = reactive({
		accountId: null,
		userCode: '',
		password: '',
		passwordRepeat: '',
		username: '',
		gender: null,
		birthday: null,
		phone: '',
		address: '',
		roleName: '',
		createdBy: null,
		modifyBy: null
	})
	
	let searchValue = reactive({
		username: '',
		role: '',
		currentPage: 1,
		pageSize: 10
	})

	// 页面初始化加载数据
	onMounted(() => {
		get('/super-mk/api/v0.2/accounts/me/id', (data) => {
			if (data) {
				accountId.value = data
				account.createdBy = accountId.value;
				account.modifyBy = accountId.value;
			}
		})
		initializePage();
	});

	  // 初始化页面数据
	function initializePage() {
		post(`/super-mk/api/v0.2/accounts/tables`, searchValue, (data) => {
			accountList.value = data;
		});
		get('/super-mk/api/v0.2/roles/list', (data) => {
			roleNameList.value = data
		});
		post('/super-mk/api/v0.2/accounts/count', searchValue, (data) => {
			count.value = data
		}) 
		handleClose()
		
	};
	
	function handleClose() {
		addDialogVisible.value = false
		editDialogVisible.value = false
		account.accountId = null
		account.userCode = ''
		account.password = ''
		account.passwordRepeat = ''
		account.username = ''
		account.gender = null
		account.birthday = null
		account.phone = ''
		account.address = ''
		account.roleName = ''
	}

	// 处理搜索按钮点击事件
	const handleSearch = () => {
		searchValue.currentPage = 1
		initializePage()
	};
	
    const handleEdit = (row) => {
		console.log(ref(row).value.accountId)
		
		get(`/super-mk/api/v0.2/accounts/${ref(row).value.accountId}`, (data) => {
			console.log(data)
			account.accountId = data.accountId
			account.userCode = data.userCode
			account.username = data.username
			account.gender = data.genderVo === '男' ? '1' : '2'
			account.phone = data.phone
			account.address = data.address
			account.birthday = data.birthday
			account.roleName = data.role
		})
		editDialogVisible.value = true
	};
	
	// 跳转到新增页面
	function nextAdd() {
		// router.push('/add-account');
		addDialogVisible.value = true
	};

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
		post('/super-mk/api/v0.2/accounts/accounts', selectedRowList.value.map(account => account.accountId), () => {
			ElMessage.success(`删除成功!`)
			initializePage();
		})
	};
	
	const handleDeleteAccount = (ros) => {
		get(`/super-mk/api/v0.2/accounts/account/${ros.accountId}`, () => {
			ElMessage.success('删除成功!')
			initializePage()
		})
	}
	
	function exportData() {
		window.open('http://localhost:8080/account/export')
	}
	
	function uploadSuccess(data) {
		if (data.code === 200) {
			ElMessage.success("上传成功!")
		initializePage();
		} else (
			ElMessage.warning(data.message)
		)
	}
	function addSubmitForm() {
		addFormRef.value.validate((isValid) => {
			if(isValid) {
				post('/super-mk/api/v0.2/accounts/', account, () => {
					ElMessage.success('添加成功!')
					initializePage()
				})
			} else {
	            ElMessage.warning('请完整填写注册表单内容!')
	        }
		});
	}
	const validatePassword = (rule, value, callback) => {
	    if (value === '') {
	        callback(new Error('请再次输入密码'))
	    } else if (value !== account.password) {
	        callback(new Error("两次输入的密码不一致"))
	    } else {
	        callback()
	    }
	}
	
	function editSubmitForm() {
		editFormRef.value.validate((isValid) => {
			if(isValid) {
				console.log(JSON.stringify(account))
				post('/super-mk/api/v0.2/accounts/account', account, () => {
					ElMessage.success('修改成功!')
					// router.push('/account')
					initializePage()
				})
			} else {
	            ElMessage.warning('请完整填写注册表单内容!')
	        }
		});
	}
	
	const addRules = {
	    userCode: [
	        { 
				  required: true, 
				  message: '请输入用户编码', 
				  trigger: 'blur' 
	        },
	        { 
				  pattern: /^[A-Z0-9]{11}$/, 
				  message: '用户编码必须是11位大写字母和数字的组合', 
				  trigger: 'blur' 
	        }
	      ],
		password: [
			{ 
				required: true, 
				message: '请输入密码', 
				trigger: 'blur' ,
			},
		    { 
				min: 6, 
				max: 20, 
				message: '密码的长度必须在6-20个字符之间', 
				trigger: ['blur', 'change'] ,
			}
		],
		passwordRepeat: [
		    { 
				required: true, 
				validator: validatePassword, 
				trigger: ['blur', 'change'] ,
			},
		],
		username: [
			{ 
				 required: true, 
				 message: '请输入用户名', 
				 trigger: 'blur' 
			},
			{ 
				 max: 20, 
				 message: '用户名长度不能超过20位', 
				 trigger: 'blur' 
			},
			{ 
				 pattern: /^[a-zA-Z\u4e00-\u9fa5]+$/, 
				 message: '用户名不能包含特殊符号', 
				 trigger: 'blur' 
			}
	    ],
		roleName: [
		    { 
				  required: true, 
				  message: '请选择职位', 
				  trigger: 'change'
		    }
		],
	    gender: [
	        { 
				required: true, 
				message: '请选择性别', 
				trigger: 'change',
			}
	    ],
	    birthday: [
	        { 
				  type: 'date', 
				  required: true, 
				  message: '请选择生日', 
				  trigger: 'change' 
	        },
	        { 
				validator: (rule, value, callback) => {
	            if (value && new Date(value) > new Date(new Date().setFullYear(new Date().getFullYear() - 18))) {
					callback(new Error('byd招童工是吧'));
	            } else {
					callback();
	            }
	        },
				trigger: 'change'
	        }
		],
	    phone: [
	        { 
				required: true, 
				message: '请输入电话号码', 
				trigger: 'blur' ,
			},
	        { 
				pattern: /^\d{11}$/, 
				message: '电话号码必须为11位数字', 
				trigger: 'blur' ,
			}
	    ],
	    address: [
	        { required: true, message: '请输入地址', trigger: 'blur' }
	    ],
	}
	const editRules = {
	    userCode: [
	        { 
				  required: true, 
				  message: '请输入用户编码', 
				  trigger: 'blur' 
	        },
	        { 
				  pattern: /^[A-Z0-9]{11}$/, 
				  message: '用户编码必须是11位大写字母和数字的组合', 
				  trigger: 'blur' 
	        }
	      ],
		username: [
			{ 
				 required: true, 
				 message: '请输入用户名', 
				 trigger: 'blur' 
			},
			{ 
				 max: 20, 
				 message: '用户名长度不能超过20位', 
				 trigger: 'blur' 
			},
			{ 
				 pattern: /^[a-zA-Z\u4e00-\u9fa5]+$/, 
				 message: '用户名不能包含特殊符号', 
				 trigger: 'blur' 
			}
	    ],
		roleName: [
		    { 
				  required: true, 
				  message: '请选择职位', 
				  trigger: 'change'
		    }
		],
	    gender: [
	        { 
				required: true, 
				message: '请选择性别', 
				trigger: 'change',
			}
	    ],
	    birthday: [
	        { 
				  type: 'date', 
				  required: true, 
				  message: '请选择生日', 
				  trigger: 'change' 
	        },
	        { 
				validator: (rule, value, callback) => {
	            if (value && new Date(value) > new Date(new Date().setFullYear(new Date().getFullYear() - 18))) {
					callback(new Error('byd招童工是吧'));
	            } else {
					callback();
	            }
	        },
				trigger: 'change'
	        }
		],
	    phone: [
	        { 
				required: true, 
				message: '请输入电话号码', 
				trigger: 'blur' ,
			},
	        { 
				pattern: /^\d{11}$/, 
				message: '电话号码必须为11位数字', 
				trigger: 'blur' ,
			}
	    ],
	    address: [
	        { required: true, message: '请输入地址', trigger: 'blur' }
	    ],
	}
</script>

<style scoped>
	.headerBg {
		background-color: #000000!important;
	}
</style>