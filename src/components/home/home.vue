<template>
  <el-container class="container">
    <!-- 头部 -->
    <el-header class="header">
      <el-row>
        <el-col :span="4">
          <div class="grid-content bg-purple">
            <img
              src="../../assets/logo.png"
              alt="无法显示图片"
              srcset=""
            >
          </div>
        </el-col>
        <el-col
          :span="18"
          class="middle"
        >
          <h2>电商后台管理系统</h2>
        </el-col>
        <el-col :span="2">
          <div class="grid-content bg-purple">
            <a
              href="#"
              class="loginout"
              @click.prevent="handleLogout()"
            >退出</a>
          </div>
        </el-col>
      </el-row>
    </el-header>
    <!-- 内容 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside
        class="aside"
        width="200px"
      >
        <el-menu
          :router="true"
          :unique-opened="true"
        >
          <!-- 1 -->
          <el-submenu :index="index" v-for="(item,index) in menu" :key="index">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>{{item.authName}}</span>
            </template>
              <el-menu-item :index="item1.path" v-for="(item1,index1) in item.children" :key="index1">
                  <i class="el-icon-menu"></i>
                  <span :index="item1.path">{{item1.authName}}</span>
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
  data() {
    return {
      menu: []
    }
  },
  created() {
    this.getMenus();
  },
  methods: {
    async getMenus() {
      const res = await this.$http.get('menus')
      this.menu = res.data.data
      console.log(this.menu);

    },
    handleLogout() {
      // 清除token
      localStorage.clear();
      // 提示
      this.$message.success("退出成功");
      // 来到login组件
      this.$router.push({ name: "login" });
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
