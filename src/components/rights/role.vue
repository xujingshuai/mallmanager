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
      @click="addRole()"
    >添加角色</el-button>
    <!-- 表格 -->
    <el-table
      :data="rolelist"
      style="width: 100%"
      border
    >
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

    <!-- 添加角色对话框 -->
    <el-dialog title="添加角色" :visible.sync="dialogFormVisibleRole">
        <el-form :model="form">
            <el-form-item label="角色名称" label-width="100px">
                <el-input v-model="form.roleName" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="角色描述" label-width="100px">
                <el-input v-model="form.roleDesc" autocomplete="off"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisibleRole = false">取 消</el-button>
            <el-button type="primary" @click="dialogFormVisibleRole = false">确 定</el-button>
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
                roleName: '',
                roleDesc: ''
            },
            // 控制添加角色对话框的显示/隐藏属性
            dialogFormVisibleRole: false
        }
    },
    created() {
        this.getRoleList();
    },
    methods: {
        // 添加角色 --> 显示对话框
        addRole() {
            this.dialogFormVisibleRole = true;
        },
        // 获取数据
        async getRoleList() {
            const res = await this.$http.get(`roles`);
            this.rolelist = res.data.data;
            console.log(res);
        }
    }
};
</script>

<style>
.roleButton {
  margin: 20px 0;
}
</style>
