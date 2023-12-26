<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios';
import { ElMessage } from "element-plus";
const input_name = ref('')
const input_uid = ref('5')
const input_sales = ref('')
const input_stockpile = ref('')
const input_price = ref('')
const input_img = ref('https://img-s-msn-com.akamaized.net/tenant/amp/entityid/AA1lZYk4.img?w=768&h=432&m=6')
const input_main = ref('')
const input_detail = ref('')

const loading = ref(false)

const submit = () => {
    loading.value = true
    let apipath = '/api/goods'
    let data = {
        name: input_name.value,
        uid: input_uid.value,
        sales: input_sales.value,
        stockpile: input_stockpile.value,
        price: input_price.value,
        img: input_img.value,
        main: input_main.value,
        detail: input_detail.value,
    }
    console.log(data)
    axios.put(apipath, null, { params: data })
        .then((r) => {
            if (r.data && r.data.code && r.data.code === 200) {
                ElMessage({
                    message: `添加商品成功`,
                    type: 'success'
                })
                loading.value = false
            }
            else {
                ElMessage({
                    message: '添加商品失败: ' + r.data.msg + ' 请重试',
                    type: 'error'
                })
            }
        })
        .catch((e) => {
            console.log(e)
            ElMessage({
                message: '添加商品失败' + e,
                type: 'error'
            })
        })
}


</script>

<template>
    <el-card v-loading="loading" class="box-card" style="margin-top: 10vh; margin-left: 20vw;">
        <template #header>
            <div class="card-header">
                <span>添加商品</span>
                <el-button class="button" @click="submit" text>提交</el-button>
            </div>
        </template>
<!--        <div v-for="o in 4" :key="o" class="text item">{{ 'List item ' + o }}</div>-->
        <div style=" margin-bottom: 20px;">商品名称   <el-input v-model="input_name" style="width: 200px;" placeholder="请输入商品名称" /></div>
        <div style=" margin-bottom: 20px;">用户ID   <el-input disabled  v-model="input_uid" style="width: 200px" placeholder="ID" /></div>
        <div style=" margin-bottom: 20px;">销量   <el-input v-model="input_sales" style="width: 200px" placeholder="请输入销量" /></div>
        <div style=" margin-bottom: 20px;">库存   <el-input v-model="input_stockpile" style="width: 200px" placeholder="请输入库存" /></div>
        <div style=" margin-bottom: 20px;">商品价格   <el-input v-model="input_price" style="width: 200px" placeholder="请输入商品价格" /></div>
        <div style=" margin-bottom: 20px;">商品图像   <el-input v-model="input_img" style="width: 200px" placeholder="请输入商品图像" /></div>
        <div style=" margin-bottom: 20px;">主分类   <el-input v-model="input_main" style="width: 200px" placeholder="请输入主分类" /></div>
        <div style=" margin-bottom: 20px;">子分类   <el-input v-model="input_detail" style="width: 200px" placeholder="请输入子分类" /></div>
        <template #footer>好商品</template>
    </el-card>
</template>

<style>
.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.text {
    font-size: 14px;
}

.item {
    margin-bottom: 18px;
}

.box-card {
    width: 480px;
}
</style>
