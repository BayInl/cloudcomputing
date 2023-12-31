<script setup lang="ts">
import { ElMessage } from "element-plus";
import { useStore } from 'vuex'
import axios from 'axios'
import { ref} from "vue";
//@ts-ignore
import { onMounted, onBeforeMount } from "vue";

import { BarChart, PieChart } from 'echarts/charts';
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';

import VChart from 'vue-echarts';

use([BarChart, PieChart, CanvasRenderer]);
//@ts-ignore
const option = ref({
    color: ['#c23531', '#2f4554', '#61a0a8'],
    title: {
        text: 'Traffic Sources',
        left: 'center',
        top: '100px'
    },
    tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c} ({d}%)',
    },
    legend: {
        orient: 'vertical',
        left: 'left',
        data: ['Direct', 'Email', 'Ad Networks', 'Video Ads', 'Search Engines'],
    },
    series: [
        {
            name: 'Traffic Sources',
            type: 'pie',
            radius: '55%',
            center: ['50%', '60%'],
            data: [
                { value: 335, name: 'Direct' },
                { value: 310, name: 'Email' },
                { value: 234, name: 'Ad Networks' },
                { value: 135, name: 'Video Ads' },
                { value: 1548, name: 'Search Engines' },
            ],
            itemStyle: {
                color: '#0a1107'  // 设置柱状图的颜色，这里为蓝色
            },
            emphasis: {
                itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)',
                },
            },
            // itemStyle: {
            //     color: '#070711'  // 设置柱状图的颜色，这里为蓝色
            // }
        },

    ],
});
//@ts-ignore
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
/**
 * goods样例数据：
 */
let percategorygoods = ref<any>([])
let perdetailgoods = ref<any>([])
let percategorysales = ref<any>([])
let perdetailsales = ref<any>([])
let categories = ref<Category[]>([])

// 获取所有分类
const getcategory = async (): Promise<Category[]> => {
    let apipath = '/api/category'
    return axios.get(apipath)
        .then((r) => {
            if (r.data && r.data.code && r.data.code === 200) {
                return r.data.data
            }
            else {
                ElMessage({
                    message: '获取分类失败: ' + r.data.msg + ' 请重试',
                    type: 'error'
                })
                return []
            }
        })
        .catch((e) => {
            console.log(e)
            ElMessage({
                message: '获取分类失败' + e,
                type: 'error'
            })
            return []
        })
}

// 获取分类下所有的商品信息，返回Good类型的元素
const getgoodsByCategory = async (category: Category): Promise<Good[]> => {

    let apipath = '/api/goods/main/detail'
    return axios.get(apipath, {
        params: {
            main: category.main,
            detail: category.detail
        }
    })
        .then((r) => {
            if (r.data && r.data.code && r.data.code === 200) {
                return r.data.data
            }
            else {
                return []
            }
        })
        .catch((e) => {
            console.log(e)
            ElMessage({
                message: '获取商品信息失败' + e,
                type: 'error'
            })
            return []
        })

}

// 统计各个主分类下的商品数量
const countGoodsByMainCategory = async () => {
    // 减少重复请求
    if (categories.value.length === 0) {
        categories.value = await getcategory()
    }
    let _categories = categories.value
    let goodsByMainCategory: Map<string, any[]> = new Map()
    for (let category of _categories) {
        let goods = await getgoodsByCategory(category)
        if (goodsByMainCategory.has(category.main)) {
            //@ts-ignore
            goodsByMainCategory.get(category.main).push(...goods)
        }
        else {
            goodsByMainCategory.set(category.main, [...goods])
        }
    }
    let goodsCountByMainCategory: Map<string, number> = new Map()
    for (let [main, goods] of goodsByMainCategory) {
        if (goodsCountByMainCategory.has(main)) {
            //@ts-ignore
            goodsCountByMainCategory.set(main, goodsCountByMainCategory.get(main) + goods.length)
        }
        else {
            goodsCountByMainCategory.set(main, goods.length)
        }
    }
    let goodsCountByMainCategoryArray: number[] = []
    for (let [_, count] of goodsCountByMainCategory) {
        goodsCountByMainCategoryArray.push(count)
    }
    percategorygoods.value = {
        title: {
            text: '商品分类数量统计',
        },
        grid: {
            left: '3%',
            right: '1%',
            bottom: '0%',
            containLabel: true
        },
        tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)',

        },
        legend: {
            data: Array.from(goodsByMainCategory.keys())
        },
        xAxis: {
            data: Array.from(goodsByMainCategory.keys())
        },
        yAxis: {},
        series: [{
            name: '商品数量',
            type: 'pie',
            data: goodsCountByMainCategoryArray
        }]
    }
}

// 统计各个子分类下的商品数量
const countGoodsByDetailCategory = async () => {
    if (categories.value.length === 0) {
        categories.value = await getcategory()
    }
    let _categories = categories.value
    let goodsByDetailCategory: Map<string, any[]> = new Map()
    for (let category of _categories) {
        let goods = await getgoodsByCategory(category)
        if (goodsByDetailCategory.has(category.detail)) {
            //@ts-ignore
            goodsByDetailCategory.get(category.detail).push(...goods)
        }
        else {
            goodsByDetailCategory.set(category.detail, [...goods])
        }
    }
    let goodsCountByDetailCategory: Map<string, number> = new Map()
    for (let [detail, goods] of goodsByDetailCategory) {
        if (goodsCountByDetailCategory.has(detail)) {
            //@ts-ignore
            goodsCountByDetailCategory.set(detail, goodsCountByDetailCategory.get(detail) + goods.length)
        }
        else {
            goodsCountByDetailCategory.set(detail, goods.length)
        }
    }

    let goodsCountByDetailCategoryArray: number[] = []
    for (let [_, count] of goodsCountByDetailCategory) {
        goodsCountByDetailCategoryArray.push(count)
    }
    perdetailgoods.value = {
        color: ['rgba(8,171,199,0.9)'],
        title: {
            text: '商品分类统计'
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c}',
        },
        legend: {
            data: ['商品数量']
        },
        xAxis: {
            data: Array.from(goodsByDetailCategory.keys())
        },
        yAxis: {},
        series: [{
            name: '商品数量',
            type: 'bar',
            data: goodsCountByDetailCategoryArray
        }]
    }

}
// 获取各个主分类下的商品销量
const getSalesByMainCategory = async () => {
    if (categories.value.length === 0) {
        categories.value = await getcategory()
    }
    let _categories = categories.value
    let goodsByMainCategory: Map<string, any[]> = new Map()
    for (let category of _categories) {
        let goods = await getgoodsByCategory(category)
        console.log(goods)
        if (goodsByMainCategory.has(category.main)) {
            //@ts-ignore
            goodsByMainCategory.get(category.main).push(...goods)
        }
        else {
            goodsByMainCategory.set(category.main, [...goods])
        }
    }
    let goodsSalesByMainCategory: Map<string, number> = new Map()
    for (let [main, goods] of goodsByMainCategory) {
        for (let good of goods) {
            if (goodsSalesByMainCategory.has(main)) {
                //@ts-ignore
                goodsSalesByMainCategory.set(main, goodsSalesByMainCategory.get(main) + good.sales)
            }
            else {
                goodsSalesByMainCategory.set(main, good.sales)
            }
        }
    }
    console.log(goodsSalesByMainCategory)
    percategorysales.value = {
        color: ['#61a0a8'],
        title: {
            text: '商品销量统计'
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        tooltip: {},
        legend: {
            data: ['商品销量']
        },
        xAxis: {
            data: Array.from(goodsSalesByMainCategory.keys())
        },
        yAxis: {},
        series: [{
            name: '商品销量',
            type: 'bar',
            data: Array.from(goodsSalesByMainCategory.values())
        }]
    }
}
// 获取各个子分类下的商品销量
const getSalesByDetailCategory = async () => {
    if (categories.value.length === 0) {
        categories.value = await getcategory()
    }
    let _categories = categories.value
    let goodsByDetailCategory: Map<string, any[]> = new Map()
    for (let category of _categories) {
        let goods = await getgoodsByCategory(category)
        if (goodsByDetailCategory.has(category.detail)) {
            //@ts-ignore
            goodsByDetailCategory.get(category.detail).push(...goods)
        }
        else {
            goodsByDetailCategory.set(category.detail, [...goods])
        }
    }
    let goodsSalesByDetailCategory: Map<string, number> = new Map()
    for (let [detail, goods] of goodsByDetailCategory) {
        for (let good of goods) {
            if (goodsSalesByDetailCategory.has(detail)) {
                //@ts-ignore
                goodsSalesByDetailCategory.set(detail, goodsSalesByDetailCategory.get(detail) + good.sales)
            }
            else {
                goodsSalesByDetailCategory.set(detail, good.sales)
            }
        }
    }
    perdetailsales.value = {
        color: ['#446238'],
        title: {
            text: '商品销量统计',
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        tooltip: {},
        legend: {
            data: ['商品销量']
        },
        xAxis: {
            data: Array.from(goodsSalesByDetailCategory.keys())
        },
        yAxis: {
        },
        series: [{
            name: '商品销量',
            type: 'bar',
            data: Array.from(goodsSalesByDetailCategory.values())
        }]
    }
}
onMounted(() => {
    countGoodsByMainCategory()
    countGoodsByDetailCategory()
    getSalesByMainCategory()
    getSalesByDetailCategory()
})

</script>


<template>
    <div class="home">
<!--        <h2>数据分析平台</h2>-->
        <el-row :gutter="20" style=" margin-top: 50px;">
            <el-col :span="12" class="custom-height"><v-chart class="chart" :option="percategorygoods" autoresize /></el-col>
            <el-col :span="12" class="custom-height"><v-chart class="chart" :option="perdetailgoods" autoresize /></el-col>
            <el-col :span="12" class="custom-height"><v-chart class="chart" :option="percategorysales" autoresize /></el-col>
            <el-col :span="12" class="custom-height">
                <v-chart class="chart" :option="perdetailsales" autoresize />
            </el-col>
        </el-row>
        
        
        
        
        <button @click="countGoodsByMainCategory">获取分类</button>
    </div>
</template>

<style scoped>
.chart {
    height: 35vh;
    width: 30vw;
}

.el-col {
    border-radius: 4px;
}

.el-row {
    margin-bottom: 20px;
}

.el-row:last-child {
    margin-bottom: 0;
}

.custom-height {
    height: 300px;
}
</style>