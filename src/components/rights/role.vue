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
            @click="editRole(scope.row)"
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
                <el-input v-model="form.roleName" autocomplete="off"></el-input>
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
            dialogFormVisibleAdd: false,
            // 控制编辑角色对话框的显示/隐藏属性
            dialogFormVisibleEdit: false
        }
    },
    created() {
        this.getRoleList();
    },
    methods: {
    		// 
    		  // 编辑角色 --> 显示对话框
    		  async editRole(role) {
    			// 显示对话框
    			this.dialogFormVisibleEdit = true;
//  			console.log(role);
    			// 发送请求
    			const res = await this.$http.get(`roles/${role.id}`);
//  			console.log(res);
					this.form = res.data.data;					
    		},
    		// 删除角色
    		deleRole(role) {
    			this.$confirm('是否删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        	}).then(async () => {
        		// 发送请求
        		const res = await this.$http.delete(`roles/${role}`);
        		const {data, meta: {msg,status}} = res.data;
        		if(status === 200) {
        			// 更新视图
        			this.getRoleList();
        			// 提示
        			this.$message({
	            type: 'success',
	            message: '删除成功!'
	          	});
	          	// 关闭对话框
	          	this.dialogFormVisibleAdd = false;
        		}
//      		console.log(res);
        	}).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          	});          
					});
    		},
    		// 添加角色对话框 -->确定按钮
    		async addRole() {
    			// 关闭对话框
    			this.dialogFormVisibleAdd = false;
    			// 发送请求
    			const res = await this.$http.post(`roles`,this.form);
//					console.log(res);
					const {meta: {msg,status},data} = res.data;
					// 判断是否添加成功
					if(status === 201) {
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
        },
        // 获取数据
        async getRoleList() {
            const res = await this.$http.get(`roles`);
            this.rolelist = res.data.data;
//          console.log(res);
        }
    }
};
</script>

<style>
.roleButton {
  margin: 20px 0;
}
</style>
