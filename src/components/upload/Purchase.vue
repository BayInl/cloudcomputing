<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { ElTable, ElTableColumn, ElButton, ElMessage, ElDialog, ElInputNumber } from 'element-plus';
import axios from 'axios';
import { useStore } from 'vuex'

const loading = ref(true)
const dialogVisible = ref(false);
const store = useStore()

const uid = computed(() => store.getters.currentUser)
// 定义商品接口
interface Good {
    name: string;
    uid: number;
    sales: number;
    stockpile: number;
    price: number;
    main: string;
    detail: string;
    img: string;
}

let goods = ref<Good[]>([]);
// 当前选择购买的商品信息
const currentGood = ref<Good | null>(null);
// 用户输入的购买数量
const purchaseQuantity = ref(1); // 默认购买数量为1

// 假设这是从后端获取的数据
const getAllGoods = async () => {
    let apipath = '/api/goods/all'
    goods.value = responseData.data
    axios.get(apipath)
        .then((r) => {
            if (r.data && r.data.code && r.data.code === 200) {
                ElMessage({
                    message: `获取商品信息成功`,
                    type: 'success'
                })
                goods.value = r.data.data; // 将获取到的商品数据赋值给goods
            }
            else {
                ElMessage({
                    message: '获取商品信息失败: ' + r.data.msg + ' 请重试',
                    type: 'error'
                })
            }
        })
        .catch((e) => {
            console.log(e)
            ElMessage({
                message: '获取商品信息失败' + e,
                type: 'error'
            })
        })
    loading.value = false
}
const submitPurchase = async () => {
    let apipath = '/api/orders'
    axios.put(apipath, null, {
        params: {
            "uid": uid.value ? uid.value : currentGood.value?.uid,
            "name": currentGood.value?.name,
            "quantity": purchaseQuantity.value,
            "date": new Date().toLocaleDateString(),
        }
    })
        .then((r) => {
            if (r.data && r.data.code && r.data.code === 200) {
                ElMessage({
                    message: `购买商品成功`,
                    type: 'success'
                })
                dialogVisible.value = false;
            }
            else {
                ElMessage({
                    message: '购买商品失败: ' + r.data.msg + ' 请重试',
                    type: 'error'
                })
            }
        })
        .catch((e) => {
            console.log(e)
            ElMessage({
                message: '购买商品失败' + e,
                type: 'error'
            })
        })
}
const responseData = {
    "code": 200,
    "msg": "Get goods successfully",
    "data": [
        {
            "name": "商品1",
            "uid": 2,
            "sales": 5,
            "stockpile": 9994,
            "price": 23.40,
            "main": "test",
            "detail": "test",
            "img": ""
        },
        {
            "name": "商品2",
            "uid": 3,
            "sales": 5,
            "stockpile": 1000,
            "price": 26.50,
            "main": "test",
            "detail": "test",
            "img": "www.baidu.com"
        }
    ]
};
//@ts-ignore
const buyProduct = (product) => {
    currentGood.value = product;
    dialogVisible.value = true;
    // 这里可以添加购买逻辑
    console.log('购买商品', product);
    console.log(uid);
};

// 在组件挂载完成后调用getAllGoods函数
onMounted(() => {
    getAllGoods();
});

</script>
<template>
    <div class="home">
        <h2>购买商品</h2>
        <el-table v-loading="loading" :data="goods" style="width: 100%">
    <el-table-column prop="name" label="商品名称"></el-table-column>
    <el-table-column prop="sales" label="销量"></el-table-column>
    <el-table-column prop="stockpile" label="库存"></el-table-column>
    <el-table-column prop="price" label="价格"></el-table-column>
    <el-table-column
      label="操作"
      width="180">
      <template #default="{ row }">
        <el-button type="primary" size="small" @click="buyProduct(row)">购买</el-button>
      </template>
    </el-table-column>
  </el-table>
  <!-- 购买商品对话框 -->
  <el-dialog v-model="dialogVisible" title="购买商品" width="30%">
    <div>
      <p>商品名称：{{ currentGood?.name }}</p>
      <p>商品价格：{{ currentGood?.price }}</p>
      <!-- 表单等其他信息 -->
      <el-input-number v-model="purchaseQuantity" type="number" placeholder="请输入购买数量" :min="1" :max="currentGood?.stockpile"></el-input-number>
    </div>
    <template #footer>
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" @click="submitPurchase">确定购买</el-button>
    </template>
  </el-dialog>
    </div>
</template>