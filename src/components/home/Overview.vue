<script setup lang="ts">
import { ElMessage } from "element-plus";
import { useStore } from 'vuex'
import axios from 'axios'
import { ref, Ref } from "vue";
import { onMounted } from "vue";
import ECharts from 'vue-echarts';
const store = useStore()

interface Category {
    main: string,
    detail: string
}

interface Good {
    name: string,// 商品名称
    uid: number,// 商家id
    sales: number,// 销量
    stockpile: number,// 库存
    price: number,// 价格
    main: string,// 主类别
    detail: string,// 子类别
    img: string,// 图片
}

let categories: Ref<Category[]> = ref([]);
/**
 * categories样例数据：
 * [
 * {
 * main: '主类别1',
 * detail: '子类别1'
 * },
 * {
 * main: '主类别2',
 * detail: '子类别2'
 * }
 * ]
 */
let goods: Ref<Good[]> = ref([]);
/**
 * goods样例数据：
 */

let percategorygoods = ref({
    title: {
        text: '商品分类统计'
    },
    tooltip: {},
    legend: {
        data: ['商品数量']
    },
    xAxis: {
        data: categories.value.map((c) => c.main)
    },
    yAxis: {},
    series: [{
        name: '商品数量',
        type: 'bar',
        data: categories.value.map((c) => c.detail)
    }]
})

// 获取所有分类
const getcategory = () => {
    let apipath = '/api/category'
    axios.get(apipath)
        .then((r) => {
            console.log(r.data.data)
            if (r.data && r.data.code && r.data.code === 200) {
                categories.value = r.data.data
                console.log(categories.value)
                ElMessage({
                    message: `获取分类成功` + categories.value,
                    type: 'success'
                })
            }
            else {
                ElMessage({
                    message: '获取分类失败: ' + r.data.msg + ' 请重试',
                    type: 'error'
                })
            }
        })
        .catch((e) => {
            console.log(e)
            ElMessage({
                message: '获取分类失败' + e,
                type: 'error'
            })
        })
}

// 获取分类下所有的商品信息，返回Good类型的元素
const getgoodsByCategory:Good = (category: Category) => {
    let apipath = '/goods/main/detail'
    
        
}
onMounted(() => {
    getcategory()
})

</script>


<template>
    <div class="home">
        <h1>数据分析平台</h1>
        <v-chart :options="percategorygoods" />
        <button @click="getcategory">获取分类</button>
    </div>
</template>