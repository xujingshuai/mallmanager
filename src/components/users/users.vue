<template>
  <el-card class="card">
    <!-- 1. 面包屑组件 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 2. 搜索 -->
    <el-row class="searchRow">
      <el-col :span="24">
        <el-input placeholder="请输入内容" @clear="loadUserList()" v-model="query" clearable class="searchInput">
          <el-button slot="append" @click="searchUser()" icon="el-icon-search"></el-button>
        </el-input>
        <el-button type="success" plain @click="showAddUserDia()">添加用户</el-button>
      </el-col>
    </el-row>
    <!-- 3. 表格 -->
    <el-table
      height="300"
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
          <el-button size="mini" plain type="primary" @click="showEditUserMsgBox()" icon="el-icon-edit" circle></el-button>
          <el-button size="mini" plain type="danger" @click="showDeleUserMsgBox(scope.row.id)" icon="el-icon-delete" circle></el-button>
          <el-button size="mini" plain type="success" icon="el-icon-check" circle></el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 4. 分页 -->
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

    <!-- 添加用户对话框 -->
    <el-dialog title="添加用户" :visible.sync="dialogFormVisibleAdd">
      <el-form :model="form">
        <el-form-item label="用户名" label-width="100px">
          <el-input v-model="form.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" label-width="100px">
          <el-input v-model="form.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" label-width="100px">
          <el-input v-model="form.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" label-width="100px">
          <el-input v-model="form.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleAdd = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisibleAdd = false, addUser()" >确 定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑用户对话框 -->
    <el-dialog title="编辑用户" :visible.sync="dialogFormVisibleEdit">
      <el-form :model="form">
        <el-form-item label="用户名" label-width="100px">
          <el-input v-model="form.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" label-width="100px">
          <el-input v-model="form.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" label-width="100px">
          <el-input v-model="form.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleEdit = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisibleEdit = false" >确 定</el-button>
      </div>
    </el-dialog>
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
          total: 0,
          // 添加对话框的属性
          dialogFormVisibleAdd: false,
          dialogFormVisibleEdit: false,
          // 添加对话框的值
          form: {
            username: '',
            password: '',
            email: '',
            mobile: ''
          }
        }
      },
      
      created() {
          this.loadData();
      },
      methods: {
          // 编辑用户--显示对话框
          showEditUserMsgBox() {
            this.dialogFormVisibleEdit = true;
          },
          // 删除用户-显示消息框(confirm)
          showDeleUserMsgBox(userId) {
            this.$confirm('是否删除', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(async () => {
              // 发送请求
              const res = await this.$http.delete(`users/${userId}`);
              const {meta: {status, msg}, data} = res.data;
              if(status === 200) {
                // 回到第一页
                this.pagenum = 1;
                // 更新视图
                this.loadData();
                // 提示
                this.$message({
                  type: 'success',
                  message: msg
                });
              }
               
            }).catch(() => {
              this.$message({
                type: 'info',
                message: '已取消删除'
              });          
            });
          },
          // 添加用户
          async addUser() {
            // alert('11111111');
            // 发送请求
            const res = await this.$http.post(`users`,this.form);
            const {meta: {status, msg}, data} = res.data;
            // 2. 关闭对话框
            this.dialogFormVisibleAdd = false;
            if(status === 201) {
              // 1. 提示成功
              this.$message.success(msg);
              // 3. 更新视图
              this.loadData();
              // 回到第一页
              // this.pagenum = 1;
              // 4. 清空文本框
              this.form = {};
            } else {
              this.$message.warning(msg);
            }
          },
          // 显示添加用户对话框
          showAddUserDia() {
            this.dialogFormVisibleAdd = true;
          },
          // 清空搜索框
          loadUserList() {
            // 重新获取数据
            this.loadData();
          },
          // 搜索用户
          searchUser() {
            this.loadData();
          },
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
