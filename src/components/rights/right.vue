<template>
  <el-card>
    <!-- 面包屑组件 -->
    <my-bread
      level1="权限管理"
      level2="权限列表"
    ></my-bread>
    <!-- 表格 -->
    <el-table
      height="500"
      class="rightTable"
      :data="rightList"
      border
      style="width: 100%"
    >
      <el-table-column
        type="index"
        label="#"
        width="60"
      >
      </el-table-column>
      <el-table-column
        prop="authName"
        label="权限名称"
        width="180"
      >
      </el-table-column>
      <el-table-column
        prop="path"
        label="路径"
        width="180"
      >
      </el-table-column>
      <el-table-column label="层级">
        <template slot-scope="scope">
            <span v-if="scope.row.level === '0'">一级</span>
            <span v-if="scope.row.level === '1'">二级</span>
            <span v-if="scope.row.level === '2'">三级</span>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script>
export default {
    data() {
        return {
            rightList: []
        }
    },
    created() {
        this.getRightList();
    },
    methods: {
        // 获取所有权限列表
        async getRightList() {
            const res = await this.$http.get(`rights/list`)
            this.rightList = res.data.data;
            console.log(res);
        }
    }
};
</script>

<style>
    .rightTable {
        margin-top: 20px;
    }
</style>
