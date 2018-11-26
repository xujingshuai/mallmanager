<template>
    <el-container class="container">
        <!-- 头部 -->
        <el-header class="header">
            <el-row>
                <el-col :span="4">
                    <div class="grid-content bg-purple">
                        <img src="../../assets/logo.png" alt="无法显示图片" srcset="">
                    </div>
                </el-col>
                <el-col :span="18" class="middle">
                    <h2>电商后台管理系统</h2>
                </el-col>
                <el-col :span="2">
                    <div class="grid-content bg-purple">
                        <a href="#" class="loginout" @click.prevent="handleLogout()">退出</a>
                    </div>
                </el-col>
            </el-row>
        </el-header>
        <!-- 内容 -->
        <el-container>
            <!-- 侧边栏 -->
            <el-aside class="aside" width="200px">
                <!-- 1 -->
                <el-menu :router="true" :unique-opened="true">
                    <el-submenu index="1">
                        <template slot="title">
                            <i class="el-icon-location"></i>
                            <span>用户管理</span>
                        </template>
                        <el-menu-item index="users">
                            <i class="el-icon-menu"></i>
                            <span>用户列表</span>
                        </el-menu-item>
                    </el-submenu>
                    <!-- 2 -->
                    <el-submenu index="2">
                        <template slot="title">
                            <i class="el-icon-location"></i>
                            <span>权限管理</span>
                        </template>
                        <el-menu-item index="1-1">
                            <i class="el-icon-menu"></i>
                            <span>角色列表</span>
                        </el-menu-item>
                        <el-menu-item index="1-1">
                            <i class="el-icon-menu"></i>
                            <span>权限列表</span>
                        </el-menu-item>
                    </el-submenu>
                    <!-- 3 -->
                    <el-submenu index="3">
                        <template slot="title">
                            <i class="el-icon-location"></i>
                            <span>商品管理</span>
                        </template>
                        <el-menu-item index="1-1">
                            <i class="el-icon-menu"></i>
                            <span>商品列表</span>
                        </el-menu-item>
                        <el-menu-item index="1-1">
                            <i class="el-icon-menu"></i>
                            <span>分类参数</span>
                        </el-menu-item>
                        <el-menu-item index="1-1">
                            <i class="el-icon-menu"></i>
                            <span>商品列表</span>
                        </el-menu-item>
                    </el-submenu>
                    <!-- 4 -->
                    <el-submenu index="4">
                        <template slot="title">
                            <i class="el-icon-location"></i>
                            <span>订单管理</span>
                        </template>
                        <el-menu-item index="1-1">
                            <i class="el-icon-menu"></i>
                            <span>订单列表</span>
                        </el-menu-item>
                    </el-submenu>
                    <!-- 5 -->
                    <el-submenu index="5">
                        <template slot="title">
                            <i class="el-icon-location"></i>
                            <span>数据统计</span>
                        </template>
                        <el-menu-item index="1-1">
                            <i class="el-icon-menu"></i>
                            <span>数据报表</span>
                        </el-menu-item>
                    </el-submenu>
                </el-menu>
            </el-aside>
            <!-- 主体内容 -->
            <el-main class="main">
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
export default {
    beforeCreate() {
        // 获取token
        const token = localStorage.getItem('token');
        // token 没有 -> 登录
        if(!token) {
            this.$router.push({name: 'login'});
        }
        // token 有 -> 继续渲染组件
    },
    methods: {
        handleLogout() {
            // 清除token
            localStorage.clear();
            // 提示
            this.$message.success('退出成功');
            // 来到login组件
            this.$router.push({name: 'login'});
        }
    }
};
</script>

<style>
.container {
    height: 100%;
}

.header {
    background-color: #b3c0d1;
}

.aside {
    background-color: #d3dce6;
}

.main {
    background-color: #e9eef3;
}

.middle {
    line-height: 20px;
    text-align: center;
}

.loginout {
    text-decoration: none;
    line-height: 60px;
}
</style>
