<script setup lang="ts">
import { ElHeader, ElMain, ElContainer, ElAside, ElFooter } from 'element-plus';
import 'element-plus/dist/index.css'
import Menu from '../menu/Menu.vue'
import { useStore } from 'vuex'
const store = useStore()




</script>
<template>
  <div class="common-layout" style="position: absolute;top: 0;left: 0;right: 0;bottom: 0;">
    <el-container style="height: 100vh;">
      <el-header>云计算课程项目</el-header>
      <el-container>
        <el-aside width="200px">
            <Menu></Menu>
        </el-aside>
        <el-container>
          <el-main>
            <router-view />
          </el-main>
          <el-footer> </el-footer>
        </el-container>
      </el-container>
    </el-container>
  </div>
</template>

<style>
/* 头部样式 */
.el-header {
    background: linear-gradient(45deg, #00b0e8, #3b5998, #8b9dc3);
    color: white;
    box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.2);
    padding: 20px;
    border-radius: 10px;
    font-size: 36px;
    font-weight: bold;
    letter-spacing: 1px;
    height: 100px;
}

/* 侧边栏样式 */
.el-aside {
    background: linear-gradient(to right, #85D8CE, #6FA8DC);
    color: white;
    box-shadow: 4px 0px 20px rgba(0, 0, 0, 0.2);
}

/* 彩虹渐变文字效果 */
.el-aside h2 {
    background-clip: text;
    -webkit-background-clip: text;
    color: transparent;
    background-image: linear-gradient(45deg, #ff00a9, #00eaff);
}

.el-header h1 {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; /* 根据项目需要选择字体 */
    font-size: 36px;
    font-weight: bold;
    letter-spacing: 1px;
    line-height: 1.5; /* 行高 */
    margin: 0; /* 去掉默认的外边距 */
}
/* 彩虹渐变边框效果 */
.el-header, .el-aside {
    border: 2px solid transparent;
    background-clip: padding-box;
    -webkit-background-clip: padding-box;
    transition: border-color 0.3s ease;
}

.el-header:hover, .el-aside:hover {
    border-color: #f39c12;
}


.el-main {
    /*background: red;*/
}

.el-footer {
    /*background: yellow;*/
}
</style>