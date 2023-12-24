<script setup lang="ts">
import { ElForm, ElFormItem, ElInput, ElCard, ElButton, ElMessage } from "element-plus"
import type { FormInstance, FormRules } from 'element-plus'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()
let formRef = ref<FormInstance | null>(null)
const userFormRegister = ref({
    uname: "",
    password: "",
    checkPass: "",
    email: "",
    phone: "",
    code: "",
})
//@ts-ignore
var validateCheckPass = (rule, value, callback) => {
    if (value === "") {
        callback(new Error("请输入密码"));
    } else if (value != userFormRegister.value.password) {
        callback(new Error("两次输入密码不一致!"));
    } else {
        callback();
    }
};

const login = (name: string, passwd: string, phone: number) => {
    let apipath = 'api/user/register'
    axios.put(apipath, {
        name: name,
        passwd: passwd,
        phone: phone
    })
        .then((r) => {
            console.log(r.data)
            if (r.data && r.data.code && r.data.code === 200) {
                ElMessage({
                    message: `注册成功`,
                    type: 'success'
                })
                router.replace({
                    path: "/login",
                    replace: true
                })
            }
            else {
                ElMessage({
                    message: '注册失败: ' + r.data.msg + ' 请重试',
                    type: 'error'
                })
            }
        })
        .catch((e) => {
            console.log(e)
            ElMessage({
                message: '注册失败' + e,
                type: 'error'
            })

        })
}


const userFormRegisterRules = ref<FormRules<any>>({
    uname: [
        { required: true, message: "用户名不能为空！", trigger: "blur" },
        { min: 7, max: 10, message: "用户名长度在7-10之间", trigger: "blur" }
    ],
    password: [
        { required: true, message: "密码不能为空！", trigger: "blur" },
        { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
    ],
    checkPass: [
        { required: true, validator: validateCheckPass, trigger: "blur" },
        { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
    ],
    email: [
        { required: true, message: "邮箱不能为空！", trigger: "blur" },
        { type: "email", message: "请输入正确的邮箱地址", trigger: "blur,change" }
    ],
    phone: [
        { required: true, message: "手机号不能为空！", trigger: "blur" },
        { pattern: /^\d{11}$/, message: "请输入有效的11位手机号码", trigger: "blur,change" },
    ],
    code: [
        { required: true, message: "验证码不能为空！", trigger: "blur" },
        { min: 6, max: 6, message: "验证码长度为6位", trigger: "blur" }
    ],

})


const submitForm = async () => {
    if (!formRef.value) {
        console.log("formRef is null")
        return
    }
    await formRef.value.validate((valid, fields) => {
        console.log(valid, fields)
        if (valid) {
            login(userFormRegister.value.uname, userFormRegister.value.password, Number(userFormRegister.value.phone))
        }
        else {
            ElMessage({
                message: '表单不合法',
                type: 'error'
            })
        }
    })
}

const resetForm = async () => {
    if (!formRef.value) {
        return
    }
    await formRef.value.resetFields()
}
const goBack = () => {
    router.go(-1)
}
</script>
<template>
  <div>
    <el-card class="box-card">
      <h2>注册</h2>
      <el-form
        :model="userFormRegister"
        status-icon
        :rules="userFormRegisterRules"
        ref="formRef"
        label-position="left"
        label-width="80px"
        class="demo-ruleForm"
      >
        <el-form-item label="用户名" prop="uname">
          <el-input v-model="userFormRegister.uname"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            type="password"
            v-model="userFormRegister.password"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass">
          <el-input
            type="password"
            v-model="userFormRegister.checkPass"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="userFormRegister.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="userFormRegister.phone"></el-input>
        </el-form-item>
        <el-form-item label="验证码" prop="code">
          <el-input v-model="userFormRegister.code"></el-input>
        </el-form-item>
      </el-form>
      <div class="btnGroup">
        <el-button type="primary" @click="submitForm"
          >提交</el-button
        >
        <el-button @click="resetForm">重置</el-button>
        <el-button @click="goBack">返回</el-button>
      </div>
    </el-card>
  </div>
</template>