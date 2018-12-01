<template>
  <el-card>
    <!-- 自定义面包屑组件 -->
    <my-bread
      level1="权限管理"
      level2="角色列表"
    ></my-bread>
    <!-- 添加按钮 -->
    <el-button
      type="success"
      plain
      class="roleButton"
      @click="addRoleDia()"
    >添加角色</el-button>
    <!-- 表格 -->
    <el-table
      :data="rolelist"
      style="width: 100%"
    >
      <el-table-column type="expand">
      <template slot-scope="scope">
        <el-row v-for="(item1,index1) in scope.row.children" :key="index1">

          <el-col :span="4">
            <el-tag  @close="deleRight(scope.row,item1.id)"  closable type="primary">{{item1.authName}}</el-tag>
          </el-col>

          <el-col :span="20">
            <el-row v-for="(item2,index2) in item1.children" :key="index2">
              <el-col :span="4">
                <el-tag  @close="deleRight(scope.row,item2.id)" closable type="success">{{item2.authName}}</el-tag>
              </el-col>
              <el-col :span="20">
                <el-tag @close="deleRight(scope.row,item3.id)"  closable v-for="(item3,index3) in item2.children" :key="index3" type="warning">{{item3.authName}}</el-tag>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
        <!-- 未分配权限提示 -->
        <span v-if="scope.row.children.length === 0">未分配权限</span>
      </template>
    </el-table-column>
      <!-- 序号 -->
      <el-table-column
        type="index"
        width="50"
      >
      </el-table-column>
      <el-table-column
        prop="roleName"
        label="角色名称"
        width="200"
      >
      </el-table-column>
      <el-table-column
        prop="roleDesc"
        label="角色描述"
        width="200"
      >
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            plain
            type="primary"
            icon="el-icon-edit"
            circle
            @click="editRoleDia(scope.row)"
          ></el-button>
          <el-button
            size="mini"
            plain
            type="danger"
            icon="el-icon-delete"
            circle
            @click="deleRole(scope.row.id)"
          ></el-button>
          <el-button
            size="mini"
            plain
            type="success"
            icon="el-icon-check"
            circle
            @click="showSetRight(scope.row)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加角色对话框 -->
    <el-dialog title="添加角色" :visible.sync="dialogFormVisibleAdd">
      <el-form :model="form">
          <el-form-item label="角色名称" label-width="100px">
      <el-input v-model="form.roleName" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" label-width="100px">
      <el-input v-model="form.roleDesc" autocomplete="off"></el-input>
          </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisibleAdd = false">取 消</el-button>
          <el-button type="primary" @click="addRole()">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑对话框-->
    <el-dialog title="编辑角色" :visible.sync="dialogFormVisibleEdit">
      <el-form :model="form">
          <el-form-item label="角色名称" label-width="100px">
          <el-input disabled v-model="form.roleName" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="角色描述" label-width="100px">
          <el-input v-model="form.roleDesc" autocomplete="off"></el-input>
          </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisibleEdit = false">取 消</el-button>
          <el-button type="primary" @click="editRole()">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 修改权限对话框-->
    <el-dialog title="修改权限" :visible.sync="dialogFormVisiblePut">
      <el-tree
        ref = "tree"
        :data="treelist"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="arrCheck"
        :props="defaultProps">
      </el-tree>
      <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisiblePut = false">取 消</el-button>
          <el-button type="primary" @click="setRoleRight()">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      rolelist: [],
      form: {
        roleName: "",
        roleDesc: ""
      },
      // 控制添加角色对话框的隐藏属性
      dialogFormVisibleAdd: false,
      // 控制编辑角色对话框的隐藏属性
      dialogFormVisibleEdit: false,
      // 控制修改权限对话框的隐藏属性
      dialogFormVisiblePut: false,
      // 树形结构
      treelist: [],
      defaultProps: {
          children: 'children',
          label: 'authName'
        },
      // 显示角色的所有权限
      arrCheck: [],
      currRoleId: ''
    };
  },
  created() {
    this.getRoleList();
  },
  methods: {
    // 修改权限 -- 发送请求
    async setRoleRight() {
      // 获取全选的id getCheckedKeys()
      let arr1 = this.$refs.tree.getCheckedKeys()

      // 获取半选的id getHalfCheckedKeys()
      let arr2 = this.$refs.tree.getHalfCheckedKeys()

      let arr = [...arr1,...arr2];
      // roles/:roleId/rights
      const res = await this.$http.post(`roles/${this.currRoleId}/rights`,{rids:arr.join(',')})

      // 关闭对话框
      this.dialogFormVisiblePut = false
      // 更新视图
      this.getRoleList();
    },
    // 修改权限 -- 显示对话框
    async showSetRight(role) {
      this.currRoleId = role.id
      // 显示对话框
      this.dialogFormVisiblePut = true
      // 发送请求
      const res = await this.$http.get(`rights/tree`)
      this.treelist = res.data.data
      let arrtemp2 = []
      role.children.forEach(item1 => {
        item1.children.forEach(item2 => {
          item2.children.forEach(item3 => {
            arrtemp2.push(item3.id);
          })
        })
      });
      this.arrCheck = arrtemp2;
      console.log(role);
    },
    // 取消权限
    async deleRight(role,rightId) {
      // console.log(role);
      // console.log(rightId);
      const res = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
      console.log(res);
      console.log(role);
      //  this.getRoleList();

      role.children = res.data.data
    },
    // 编辑角色对话框 -->确定按钮
    async editRole() {
      const res = await this.$http.put(`roles/${this.form.id}`, this.form);
      //  			console.log(res);
      const {
        data,
        meta: { status, msg }
      } = res.data;
      if (status === 200) {
        // 更新视图
        this.getRoleList();
        // 提示
        this.$message.success(msg);
        // 关闭对话框
        this.dialogFormVisibleEdit = false;
      }
    },
    // 编辑角色 --> 显示对话框
    editRoleDia(role) {
      // 显示对话框
      this.dialogFormVisibleEdit = true;
      // 获取数据
      this.form = role;
    },
    // 删除角色
    deleRole(role) {
      this.$confirm("是否删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          // 发送请求
          const res = await this.$http.delete(`roles/${role}`);
          const {
            data,
            meta: { msg, status }
          } = res.data;
          if (status === 200) {
            // 更新视图
            this.getRoleList();
            // 提示
            this.$message({
              type: "success",
              message: "删除成功!"
            });
            // 关闭对话框
            this.dialogFormVisibleAdd = false;
          }
          //      		console.log(res);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    // 添加角色对话框 -->确定按钮
    async addRole() {
      // 关闭对话框
      this.dialogFormVisibleAdd = false;
      // 发送请求
      const res = await this.$http.post(`roles`, this.form);
      //					console.log(res);
      const {
        meta: { msg, status },
        data
      } = res.data;
      // 判断是否添加成功
      if (status === 201) {
        // 给对象进行赋值
        this.form = data;
        //提示
        this.$message.success(msg);
        // 更新视图
        this.getRoleList();
      } else {
        this.$message.error(msg);
      }
    },
    // 添加角色 --> 显示对话框
    addRoleDia() {
      this.dialogFormVisibleAdd = true;
      this.form = {};
    },
    // 获取数据
    async getRoleList() {
      const res = await this.$http.get(`roles`);
      this.rolelist = res.data.data;
      // console.log(this.rolelist);
      //  console.log(res);
    }
  }
};
</script>

<style>
.roleButton {
  margin: 20px 0;
}
</style>
