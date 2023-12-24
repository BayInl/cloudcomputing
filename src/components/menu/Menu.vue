<script setup lang="ts">
import { ElMenu, ElSubMenu, ElIcon, ElMenuItem, ElText } from 'element-plus'
import { ref } from 'vue'
import { useRouter } from 'vue-router';

const router = useRouter()
const MenuList = ref([
    {
        index: '1',
        title: '总览',
        icon: 'PieChart',
        children: [
            {
                index: '1-1',
                title: '项目总览'
            }
        ]
    },
    {
        index: '2',
        title: '上传数据',
        icon: 'Upload'
    },
    {
        index: '3',
        title: '分析',
        icon: 'DataAnalysis',
        children: [
            {
                index: '3-1',
                title: '项目一'
            }
        ]
    }
])
//@ts-ignore
const handleSelect = (index, indexPath) => {
    // 上级html路由为：<el-main><router-view name = "home-main" /></el-main>，我们只对home-main部分进行路由跳转
    console.log(index, indexPath)
    switch (index) {
        case '1-1':
            router.push({ name: 'home-overview' });
            break;
        // 添加更多的case以处理其他的路由跳转
        default:
            break;
    }
}

</script>

<template>
    <el-menu default-active="1" @select="handleSelect">
        <el-sub-menu v-for="(item, i) in MenuList" :key="i" :index="item.title" :icon="item.icon">
            <template #title>
                <el-icon size="32">
                    <!--这里插入的标签名称对应于item.icon-->
                    <component :is="item.icon"></component>
                </el-icon>
                <h3>{{ item.title }}</h3><!--父菜单名称-->
            </template>
        <el-menu-item v-for="(child, j) in item.children" :key="j" :index="child.index">
            <el-text size="large">
                {{ child.title }}
            </el-text>
        </el-menu-item>
    
        </el-sub-menu>
    </el-menu>
</template>