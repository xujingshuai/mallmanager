<template>
  <el-card class="card">
    <!-- 面包屑组件 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索 -->
    <el-row class="searchRow">
      <el-col :span="24">
        <el-input
          placeholder="请输入内容"
          clearable
          class="searchInput"
        >
          <el-button
            slot="append"
            icon="el-icon-search"
          ></el-button>
        </el-input>
        <el-button
          type="success"
          plain
        >添加用户</el-button>
      </el-col>
    </el-row>
    <!-- 表格 -->
    <el-table
      height="200"
      class="userListTable"
      :data="userlist"
      style="width: 100%"
      stripe
      border
    >
      <!-- 序号 -->
      <el-table-column
        type="index"
        width="30"
      >
      </el-table-column>
      <el-table-column
        prop="username"
        label="姓名"
        width="80"
      >
      </el-table-column>
      <el-table-column
        prop="email"
        label="邮箱"
        width="180"
      >
      </el-table-column>
      <el-table-column
        prop="mobile"
        label="电话"
        width="180"
      >
      </el-table-column>
      <el-table-column
        label="创建日期"
        width="130"
      >
        <template slot-scope="scope">
          {{scope.row.create_time | fmtDate}}
        </template>
      </el-table-column>
      <el-table-column
        prop="mg_state"
        label="用户状态"
        width="90"
      >
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.mg_state"
            active-color="#13ce66"
            inactive-color="#ff4949"
          >
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            plain
            type="primary"
            icon="el-icon-edit"
            circle
          ></el-button>
          <el-button
            size="mini"
            plain
            type="danger"
            icon="el-icon-delete"
            circle
          ></el-button>
          <el-button
            size="mini"
            plain
            type="success"
            icon="el-icon-check"
            circle
          ></el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[2, 4, 6, 8]"
      :page-size="2"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination>
  </el-card>
</template>

<script>
export default {
    data() {
        return {
          query: '',
          pagenum: 1,
          pagesize: 2,
          userlist: [],
          total: 0
        }
      },
      
      created() {
          this.loadData();
      },
      methods: {
          // 分页
          handleSizeChange(val) {
            // this.pagesize = val;
            console.log(`每页 ${val} 条`);
            this.pagesize = val;
            // 在改变每页几条后，默认回到第一页
            this.pagenum = 1;
            // 更新视图
            this.loadData();
        },
        handleCurrentChange(val) {
            console.log(`当前页: ${val}`);
            this.pagenum = val;
            // 更新视图
            this.loadData();

        },
        // 获取数据
        async loadData() {
          //   发送请求的时候，要在请求头中添加Authorization = token
          const AUTH_TOKEN = localStorage.getItem('token');
          this.$http.defaults.headers.common['Authorization'] = AUTH_TOKEN;
          // 发送获取数据请求
          const res = await this.$http.get(`users?query=${this.query}&pagenum=${this.pagenum}&pagesize=${this.pagesize}`);
          // console.log(res);
          const {
              meta: {status,msg}, 
              data: {users,total}
              } = res.data;
          if(status === 200) {
              // 给数据赋值
              this.userlist = users;
              this.total = total;
              // 提示
              // this.$message.success(msg);
          } else {
              // this.$message.error(msg);
          }
          
        }
          
      }
    
}
</script>

<style>
    .card {
        height: 100%;
    }

    .searchRow {
        margin: 10px 0;
    }

    .searchInput {
        width: 300px;
    }

    .userListTable {
      margin-bottom: 10px;
    }
</style>
