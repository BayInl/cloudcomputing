<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useStore } from 'vuex'
import { ElFormItem, ElForm, ElCard, ElButton, ElInput, ElMessage } from "element-plus";
import type { FormInstance } from 'element-plus'
import axios from 'axios'
const store = useStore()
const router = useRouter()

let formRef = ref<FormInstance | null>(null)
let userFormLogin = ref({
    uname: "",
    password: "",
})
let userFormLoginRules = ref({
    uname: [
        { required: true, message: "用户名不能为空！", trigger: "blur" },
        { min: 7, max: 10, message: "用户名长度在7-10之间", trigger: "blur" }
    ],
    password: [
        { required: true, message: "密码不能为空！", trigger: "blur" },
        { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
    ],
})

const login = (username: string, password: string) => {
    let apipath = 'api/user/login'
    axios.post(apipath, {
        name: username,
        passwd: password
    })
        .then((r) => {
            console.log(r.data)
            if (r.data && r.data.code && r.data.code === 200) {
                ElMessage({
                    message: `登录成功`,
                    type: 'success'
                })
                store.state.currentUser = r.data.id
                store.state.name = r.data.name
                store.state.isLogged = true
                router.replace({
                    path: "/home",
                    replace: true
                })
            }
            else {
                ElMessage({
                    message: '登录失败: ' + r.data.msg + ' 请重试',
                    type: 'error'
                })
            }
        })
        .catch((e) => {
            console.log(e)
            ElMessage({
                message: '登录失败' + e,
                type: 'error'
            })
        })

}

const resetForm = async function () {
    await formRef.value?.resetFields()
}

const submitForm = async () => {
    if (!formRef.value) {
        console.log("formRef is null")
        return
    }
    await formRef.value.validate((valid, fields) => {
        console.log(valid, fields)
        if (valid) {
            login(userFormLogin.value.uname, userFormLogin.value.password)
        }
        else {
            ElMessage({
                message: '表单不合法',
                type: 'error'
            })
        }
    })
}
</script>

<template>
  <div>
    <el-card class="box-card">
      <h2>登录</h2>
      <el-form
        :model="userFormLogin"
        status-icon
        :rules="userFormLoginRules"
        ref="formRef"
        label-position="left"
        label-width="70px"
        class="login-from"
      >
        <el-form-item label="用户名" prop="uname">
          <el-input v-model="userFormLogin.uname"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            type="password"
            v-model="userFormLogin.password"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-form>
      <div class="btnGroup">
        <el-button type="primary" @click="submitForm"
          >登录</el-button
        >
        <el-button @click="resetForm">重置</el-button>
        <router-link to="/register">
          <el-button style="margin-left:10px">注册</el-button>
        </router-link>
      </div>
    </el-card>
  </div>
</template>

<style scoped>
.box-card {
    margin: auto auto;
    width: 400px;
}

.login-from {
    margin: auto auto;
}
</style>