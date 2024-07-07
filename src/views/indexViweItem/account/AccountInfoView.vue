<template>
	<el-row>
		<el-col :span="15">
			<el-form :model="account" :rules="rules" :disabled="!isEdit" ref="formRef" label-width="100px" style="margin-top: 20px; margin-left: 50px;">
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
					<el-radio-group v-model="account.gender">S
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
					<el-button v-show="isEdit" type="primary" style="width: 290px; margin-top: 20px; margin-left: 30px;" @click="submitForm">提交</el-button>
				</el-form-item>
			</el-form>
			
		</el-col>
		<el-col :span="9">
			<el-card style="max-width: 480px; padding: 0, 100px;">
				<template #header>
					<div style="text-align: -webkit-center">
						<el-upload
							list-type="text"
							accept=".jpg, .png"
							:file-list="fileList"
							:headers="headers"
							:action="postUrl"
							:limit="100"
							:multiple="false"
							:show-file-list="false"
							:on-success="uploadSuccess">
							<el-avatar :src="account.avater" :size="100"></el-avatar><br>
						</el-upload>
						
						<el-text size="large"> {{ account.username }} </el-text>
					</div>
				</template>
				<el-descriptions :column="2">
					<el-descriptions-item label="姓名"> {{ account.username }} </el-descriptions-item>
					<el-descriptions-item label="员工编号"> {{ account.userCode }} </el-descriptions-item>
					<el-descriptions-item label="角色">
						<el-tag size="small"> {{ account.roleDescp }} </el-tag>
					</el-descriptions-item>
					<el-descriptions-item label="性别"> {{ account.gender === '1' ? '男' : '女' }} </el-descriptions-item>
					<el-descriptions-item label="出生年月"> {{ formatDate(account.birthday) }} </el-descriptions-item>
					<el-descriptions-item label="电话"> {{ account.phone }} </el-descriptions-item>
					<el-descriptions-item label="地址"> {{ account.address }} </el-descriptions-item>
				</el-descriptions>
				<template #footer>
					<div style="text-align: -webkit-center">
						<el-button v-if="!isEdit" type="primary" style="width: 290px;" @click="edit">修改</el-button>
						<el-button v-if="isEdit" type="primary" style="width: 290px;" @click="edit">取消</el-button>
					</div>
				</template>
			</el-card>
		</el-col>
	</el-row>
</template>

<script setup>
	// 导入依赖
	import { ref, onMounted, reactive } from 'vue';
	import { ElInput, ElButton, ElTable, ElTableColumn, ElPagination, ElMessage } from 'element-plus';
	import { Search, CirclePlus, Remove, Download, Upload, Lock } from '@element-plus/icons-vue';
	import { get, post, accessHeader } from '@/net';
	import router from '@/router';
	import { useStore } from 'vuex';
	
	const stroe = useStore()
	
	let isEdit = ref(false)
	const formRef = ref()
	
	let fileName = ref("multipartFiles")
	let headers =ref(accessHeader())
	let fileList =ref([])
	let postUrl = ref(`http://localhost:8080/super-mk/api/v0.2/accounts/avater`)
	
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
		roleDescp: '',
		avater: '',
		createdBy: null,
		modifyBy: null
	})
	
	// 页面初始化加载数据
	onMounted(() => {
		initializePage();
	});
	
	  // 初始化页面数据
	function initializePage() {
		get(`/super-mk/api/v0.2/accounts/me`, (data) => {
			isEdit.value = false
			account.accountId = data.accountId
			account.userCode = data.userCode
			account.username = data.username
			account.gender = data.genderVo === '男' ? '1' : '2'
			account.phone = data.phone
			account.address = data.address
			account.birthday = data.birthday
			account.roleDescp = data.roleName
			account.roleName = data.role
			account.avater = data.avater
			account.modifyBy = data.accountId
		})
	};
	
	function formatDate(date) {
	    const d = new Date(date);
	    const year = d.getFullYear();
	    const month = String(d.getMonth() + 1).padStart(2, '0');
	    const day = String(d.getDate()).padStart(2, '0');
	    return `${year}年${month}月${day}日`;
	}
	  
	function uploadSuccess(data) {
	  	if (data.code === 200) {
	  		ElMessage.success("更新成功!")
			stroe.commit('setFlash', true)
	  	initializePage();
	  	} else (
	  		ElMessage.warning(data.message)
	  	)
	}
	
	function edit() {
		isEdit.value = !isEdit.value
	}
	
	function submitForm() {
		formRef.value.validate((isValid) => {
			if(isValid) {
				post('/super-mk/api/v0.2/accounts/account/me', account, () => {
					ElMessage.success('修改成功!')
					// router.push('/account')
					initializePage()
				})
			} else {
	            ElMessage.warning('请完整填写注册表单内容!')
	        }
		});
	}
	
	const rules = {
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
</style>