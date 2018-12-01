<template>
  <el-card class="card">
    <!-- 1. 面包屑组件 -->
    <my-bread level1="用户管理" level2="用户列表"></my-bread>
    
    <!-- 2. 搜索 -->
    <el-row class="searchRow">
      <el-col :span="24">
<el-input
  placeholder="请输入内容"
  @clear="loadUserList()"
  v-model="query"
  clearable
  class="searchInput"
>
  <el-button
    slot="append"
    @click="searchUser()"
    icon="el-icon-search"
  ></el-button>
</el-input>
<el-button
  type="success"
  plain
  @click="showAddUserDia()"
>添加用户</el-button>
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
      <el-table-column type="index" width="30" >
      </el-table-column>
      <el-table-column prop="username" label="姓名" width="80">
      </el-table-column>
      <el-table-column prop="email" label="邮箱" width="180">
      </el-table-column>
      <el-table-column prop="mobile" label="电话" width="180">
      </el-table-column>
      <el-table-column label="创建日期" width="130" >
<template slot-scope="scope">
  {{scope.row.create_time | fmtDate}}
</template>
      </el-table-column>
      <el-table-column prop="mg_state" label="用户状态" width="90" >
<template slot-scope="scope">
  <el-switch @change="changeMgState(scope.row)" v-model="scope.row.mg_state" active-color="#13ce66" inactive-color="#ff4949">
  </el-switch>
</template>
      </el-table-column>
      <el-table-column label="操作">
<template slot-scope="scope">
  <el-button size="mini" plain type="primary" @click="showEditUserMsgBox(scope.row)" icon="el-icon-edit" circle></el-button>
  <el-button size="mini" plain type="danger" @click="showDeleUserMsgBox(scope.row.id)" icon="el-icon-delete" circle></el-button>
  <el-button size="mini" plain type="success" @click="showSetUserRoleDia(scope.row)" icon="el-icon-check" circle></el-button>
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
    <el-dialog title="添加用户" :visible.sync="dialogFormVisibleAdd" >
      <el-form :model="form">
<el-form-item label="用户名" label-width="100px" >
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
      <div slot="footer" class="dialog-footer" >
<el-button @click="dialogFormVisibleAdd = false">取 消</el-button>
<el-button type="primary" @click="addUser()">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 编辑用户对话框 -->
    <el-dialog title="编辑用户" :visible.sync="dialogFormVisibleEdit">
      <el-form :model="form">
<el-form-item label="用户名" label-width="100px">
  <el-input disabled v-model="form.username" autocomplete="off"></el-input>
</el-form-item>
<el-form-item label="邮箱" label-width="100px">
  <el-input v-model="form.email" autocomplete="off" ></el-input>
</el-form-item>
<el-form-item label="电话" label-width="100px">
  <el-input v-model="form.mobile" autocomplete="off"></el-input>
</el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
<el-button @click="dialogFormVisibleEdit = false">取 消</el-button>
<el-button type="primary" @click="editUser()" >确 定</el-button>
      </div>
    </el-dialog>

    <!-- 分配角色对话框 -->
    <el-dialog title="分配角色" :visible.sync="dialogFormVisibleRole">
      <el-form :model="form">
<el-form-item label="用户名" label-width="100px">
  {{currentName}}
</el-form-item>
<el-form-item label="角色选择" label-width="100px">
  <el-select v-model="currRoleId">
    <el-option label="请选择" :value="-1"></el-option>
    <el-option :label="item.roleName" :value="item.id" v-for="(item,i) in roles" :key="i"></el-option>
  </el-select>
</el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
<el-button @click="dialogFormVisibleRole = false">取 消</el-button>
<el-button type="primary" @click="setRole()">确 定</el-button>
      </div>
    </el-dialog>

  </el-card>
</template>

<script>
export default {
  data() {
    return {
      query: "",
      pagenum: 1,
      pagesize: 2,
      userlist: [],
      total: 0,
      // 控制添加对话框显示的属性
      dialogFormVisibleAdd: false,
      // 控制编辑对话框显示的属性
      dialogFormVisibleEdit: false,
      // 控制分配角色对话框显示的属性
      dialogFormVisibleRole: false,
      // 添加对话框的值
      form: {
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
      // 分配角色绑定数据
      currRoleId: -1,
      // 分配角色用户名
      currentName: '',
      roles: [],
      // 修改角色用的id
      currUserId:-1
    };
  },

  created() {
    this.loadData();
  },
  methods: {
    // 点击分配角色的确定按钮
    async setRole() {
      const res = await this.$http.put(`users/${this.currUserId}/role`,{
        rid: this.currRoleId
      })
      // 关闭对话框
      this.dialogFormVisibleRole = false;
    },
    // 分配角色 --> 显示对话框
    async showSetUserRoleDia(user) {
      // 显示对话框
      this.dialogFormVisibleRole = true;
      // 显示用户名
      this.currentName = user.username;
      // 发送请求 --> 获取所有角色
      const res = await this.$http.get('roles');
      // console.log(res);
      const {data,meta: {status, msg}} = res.data;
      
      this.roles = data

      // 获取当前用户的角色id - rid
      const res1 = await this.$http.get(`users/${user.id}`)
      // 获取id
      this.currUserId = user.id;
      // console.log(res1);
      // const {data, meta: {status, msg}} = res1.data;
      this.currRoleId = res1.data.data.rid;
    },
    // 修改用户状态
    async changeMgState(user) {
      const res = await this.$http.put(`users/${user.id}/state/${user.mg_state}`)
      const {meta: {status, msg}, data} = res.data
      if(status === 200) {
        // 提示成功
        this.$message.success(msg);
              } else {
        this.$message.error(msg);
      }
    },
    // 编辑用户 -- 发送请求
    async editUser() {
      // 发送请求
      const res = await this.$http.put(`users/${this.form.id}`, this.form);
      // console.log(res);
      // 关闭对话框
      this.dialogFormVisibleEdit = false;
      // 更新视图
      this.loadData();
    },
    // 编辑用户--显示对话框
    showEditUserMsgBox(user) {
      // 显示对话框
      this.dialogFormVisibleEdit = true;
      // 获取用户数据
      this.form = user;
    },
    // 删除用户-显示消息框(confirm)
    showDeleUserMsgBox(userId) {
      this.$confirm("是否删除", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(async () => {
        // 发送请求
        const res = await this.$http.delete(`users/${userId}`);
        const {
          meta: { status, msg },
          data
        } = res.data;
        if (status === 200) {
          // 回到第一页
          this.pagenum = 1;
          // 更新视图
          this.loadData();
          // 提示
          this.$message({
            type: "success",
            message: msg
          });
        }
      }).catch(() => {
  this.$message({
    type: "info",
    message: "已取消删除"
  });
});
    },
    // 添加用户
    async addUser() {
      // alert('11111111');
      // 发送请求
      const res = await this.$http.post(`users`, this.form);
      const {meta: {status, msg },data} = res.data;
            // 2. 关闭对话框
            this.dialogFormVisibleAdd = false;
            if (status === 201) {
              // 1. 提示成功
              this.$message.success(msg);
              // 3. 更新视图
              this.loadData();
              // 回到第一页
              // this.pagenum = 1;
            } else {
              this.$message.warning(msg);
            }
          },
    // 显示添加用户对话框
    showAddUserDia() {
      this.dialogFormVisibleAdd = true;
      // 清空对话框内容
      this.form = {};
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
      const AUTH_TOKEN = localStorage.getItem("token");
      this.$http.defaults.headers.common["Authorization"] = AUTH_TOKEN;
      // 发送获取数据请求
      const res = await this.$http.get(
`users?query=${this.query}&pagenum=${this.pagenum}&pagesize=${
  this.pagesize
}`
      );
      // console.log(res);
      const {
meta: { status, msg },
data: { users, total }
      } = res.data;
      if (status === 200) {
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
};
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
