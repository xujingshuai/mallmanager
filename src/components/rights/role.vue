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
  </el-card>
</template>

<script>
export default {
    data() {
        return {
            rolelist: []
        }
    },
    created() {
        this.getRoleList();
    },
    methods: {
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
