<template>
	<div>
		<el-container style="height: 100%;min-height: 100vh">
			<el-aside :width="sideWidth + 'px'" style="background-color: rgb(238, 241, 246);min-height: 100%;box-shadow: 2px 0 6px rgba(0,21,41,.35);">
				<el-menu 
					:default-openeds="['1', '3']" style="height: 100%;overflow-x: hidden"
				    background-color="rgb(48,65,86)"
				    text-color="#FFF"
				    active-text-color="#409efc"
				    :collapse-transition="false"
				    :collapse="isCollapse"
					router>
					<div style="display: flex; align-items: center; justify-content: center; height: 60px;">
					    <el-image src="../src/assets/logo.png" alt="" style="width: 15px; position: relative; top: 5px; margin-right: 5px;"></el-image>
					    <b style="color: #FFF;" v-show="logoTextShow">超市订单管理系统</b>
					</div>
					<el-menu-item index="/">
						<el-icon class="iconColor" v-show="!logoTextShow"><HomeFilled /></el-icon>
						<template #title>
							<el-icon class="iconColor"><HomeFilled /></el-icon>
							<!-- <component :is="HomeFilled" style="width: 18px; margin: 10px; color: #b1b3b8;"></component> -->
							<span>首页</span>
						</template>
					</el-menu-item>
					<el-sub-menu :icon="Menu">
					    <template #title>
							<el-icon class="iconColor"><Menu /></el-icon>
							<span>系统管理</span>
					    </template>
						<el-menu-item index="/account">
							<el-icon class="iconColor"><UserFilled /></el-icon> 
							<samp>用户管理</samp>
						</el-menu-item>	
						<el-menu-item index="/provider">
							<el-icon class="iconColor"><OfficeBuilding /></el-icon>
							<samp>供应商管理</samp>
						</el-menu-item>	
						<el-menu-item index="/bill">
							<el-icon class="iconColor"><Van /></el-icon>
							<samp>订单管理</samp>
						</el-menu-item>	
					</el-sub-menu>
				</el-menu>
			</el-aside>
			<el-container>
				<el-header style="font-size: 12px;border-bottom: 1px solid #CCC;line-height: 60px;display: flex;">
					<div style="flex: 1; font-size: 20px; cursor: pointer">
						<el-icon v-show="logoTextShow"  @click="collape"><Fold /></el-icon>
						<el-icon v-show="!logoTextShow"  @click="collape"><Expand /></el-icon>
					</div>
					<div class="dropdown-container">
						<el-dropdown>
							<div class="dropdown-content">
								<span style="margin-right: 5px;"> {{ account.username }} </span>
								<el-icon><User /></el-icon>
							</div>
						    <template #dropdown>
								<el-dropdown-menu>
									<el-dropdown-item>个人信息</el-dropdown-item>
									<el-dropdown-item @click="handleResetPassword">修改密码</el-dropdown-item>
									<el-dropdown-item @click="userLogout">退出登录</el-dropdown-item>
									<!-- <el-dropdown-item disabled>Action 4</el-dropdown-item>
									<el-dropdown-item divided>Action 5</el-dropdown-item> -->
								</el-dropdown-menu>
						    </template>
						</el-dropdown>
					</div>
				</el-header>
				
				<el-main>
					<div style="margin-bottom: 30px">
					  <el-breadcrumb separator="/">
					    <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
					    <template v-for="(item, index) in breadList" :key="index">
					        <el-breadcrumb-item v-if="item.name && item.path" :to="item.path">{{ item.name }}</el-breadcrumb-item>
					    </template>
					  </el-breadcrumb>
					</div>
					
					<div class="content-container-box">
					    <div class="content">
					        <router-view v-slot="{ Component }" :key="$route.fullPath">
					            <transition name="el-fade-in-linear" mode="out-in">
					                <component :is="Component" style="height: 100%"/>
					            </transition>
					        </router-view>
					    </div>
					</div>
				</el-main>
			</el-container>
		</el-container>
		
		
		<el-dialog
			v-if="pwdDialogVisible"
			v-model="pwdDialogVisible"
			width=620
		    :before-close="handleClose">
			<el-form :model="resetPassword" :rules="rules" ref="formRef" label-width="100px">
				<el-form-item label="旧密码" prop="originalPassword" style="width: 500px;">
					<el-input v-model="resetPassword.originalPassword" type="password"></el-input>
				</el-form-item>
				<el-form-item label="新密码" prop="newPassword" style="width: 500px;">
					<el-input v-model="resetPassword.newPassword" type="password"></el-input>
				</el-form-item>
				<el-form-item label="重复新密码" prop="confirmNewPassword" style="width: 500px;">
					<el-input v-model="resetPassword.confirmNewPassword" type="password"></el-input>
				</el-form-item>		
				<el-form-item>
					<el-button type="primary" style="width: 290px; margin-top: 20px; margin-left: 30px;" @click="submitForm">修改</el-button>
				</el-form-item>
			</el-form>
		</el-dialog>
		<!-- <el-button @click="userLogout">退出登录</el-button> -->
	</div> 
</template>

<script setup>
	import { logout, getUserInfo } from '@/net';
	import router from '@/router';
	import { HomeFilled, Fold, Expand, Menu, User, UserFilled, OfficeBuilding, Van } from '@element-plus/icons-vue';
	import { ref, onMounted, watch, reactive } from 'vue';
	import { RouterLink } from 'vue-router';
	import { post } from '@/net';
	import { ElMessage } from 'element-plus';
	import { useStore } from 'vuex';
	
	const store = useStore()

	let logoTextShow = ref(true);
	let isCollapse = ref(false);
	let sideWidth = ref(200);
	
	let pwdDialogVisible = ref(false)
	let resetPassword =  reactive({
		originalPassword: '',
		newPassword: '',
		confirmNewPassword: ''
	})
	const formRef = ref()
	
	let account = ref({})
	const breadList = ref([]);

	function userLogout() {
		logout(() => router.push("/welcome/login"))
	}
	function collape() {
	  isCollapse.value = !isCollapse.value;
	  if (isCollapse.value) {
	    sideWidth.value = 64;
	    logoTextShow.value = false;
	  } else {
	    sideWidth.value = 200;
	    logoTextShow.value = true;
	  }
	}
	
	function initializePage() {	
		getUserInfo((data) => {
			if (data) {
				account.value = data
				store.commit('setAccountId', data.accountId)
			}
		})
	}
	onMounted(() => {
		initializePage();
	});

	watch(() => router.currentRoute.value, (to) => {
		if (to.name.split('-').length > 1) {
			breadList.value = [{path: to.path, name: to.name.split('-')[1]}]
		} else {
			breadList.value = []
		}
	},{immediate: true,deep: true})
	
	function handleResetPassword() {
		pwdDialogVisible.value = true
	}
	
	function handleClose() {
		pwdDialogVisible.value = false
		resetPassword.originalPassword = '',
		resetPassword.newPassword = '',
		resetPassword.confirmNewPassword = ''
	}
	
	function submitForm() {
		formRef.value.validate((isValid) => {
			if(isValid) {
				console.log(resetPassword)
				post('/account/reset-password', resetPassword, () => {
					ElMessage.success("密码修改成功")
					handleClose()
				})
			} else {
		        ElMessage.warning('请完整填写注册表单内容!')
		    }
		});
		
	}
	
	const validatePassword = (rule, value, callback) => {
	    if (value === '') {
	        callback(new Error('请再次输入密码'))
	    } else if (value !== resetPassword.newPassword) {
	        callback(new Error("两次输入的密码不一致"))
	    } else {
	        callback()
	    }
	}
	
	const rules = {
		originalPassword: [
			{ 
				required: true, 
				message: '请输入旧密码', 
				trigger: 'blur' ,
			},
		    { 
				min: 6, 
				max: 20, 
				message: '密码的长度必须在6-20个字符之间', 
				trigger: ['blur', 'change'] ,
			}
		],
		newPassword: [
			{ 
				required: true, 
				message: '请输入新密码', 
				trigger: 'blur' ,
			},
		    { 
				min: 6, 
				max: 20, 
				message: '密码的长度必须在6-20个字符之间', 
				trigger: ['blur', 'change'] ,
			}
		],
		confirmNewPassword: [
		    { 
				required: true, 
				validator: validatePassword, 
				trigger: ['blur', 'change'] ,
			},
		]
	}
</script>

<style scoped>
	.dropdown-container {
		position: relative;
	    width: 200px; /* 调整需要的宽度 */
	    text-align: right; /* 将内容右对齐 */
	    cursor: pointer;
	    padding: 10px; /* 添加内边距 */
	}
	   
	.dropdown-content {
	    display: flex;
	    justify-content: space-between; /* 在内容区域内平均分布元素 */
	    align-items: center; /* 垂直居中 */
	    padding: 10px;
	    width: 100%; /* 使用全部宽度 */
	}
	   
	.dropdown-menu {
	    position: absolute;
	    top: calc(100% + 5px); /* 下拉菜单相对于触发按钮底部位置 */
	    right: 0;
	    width: 150px; /* 调整需要的宽度 */
	    text-align: left; /* 将下拉菜单左对齐 */
	}
	
	.example-showcase .el-dropdown-link {
	  cursor: pointer;
	  color: var(--el-color-primary);
	  display: flex;
	  align-items: center;
	}
	
	.iconColor {
		color: #b1b3b8;
	}
</style>