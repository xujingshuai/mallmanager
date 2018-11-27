<template>
  <div class="login-wrap">
    <el-form
      class="login-form"
      label-position="top"
      label-width="80px"
      :model="formData"
    >
      <h2>用户管理</h2>
      <el-form-item label="用户名">
        <el-input v-model="formData.username"></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input
          @keyup.enter.native="handleLogin()"
          v-model="formData.password"
        ></el-input>
      </el-form-item>
      <el-button
        class="login-button"
        type="primary"
        @click.prevent="handleLogin()"
      >登录</el-button>
    </el-form>
  </div>
</template>

<script>
export default {
    data() {
        return {
            formData: {
                username: '',
                password: ''
            }
        }
    },
    methods: {
        async handleLogin() {
            const res = await this.$http.post('/login',this.formData);
            
            // console.log(res);
                const {data, meta: {msg, status}} = res.data;
                if(status === 200) {
                    // 存储token值
                    localStorage.setItem('token',data.token);
                    // 提示登录成功
                    this.$message.success(msg);
                    // 登录成功，跳转到home页
                    this.$router.push({name: 'home'});
                } else {
                     this.$message.warning(msg);
                }
        }
    }
};
</script>

<style>
    .login-wrap {
        height: 100%;
        background-color: #324152;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .login-wrap .login-form {
        width: 400px;
        background-color: #fff;
        border-radius: 5px; 
        padding: 30px;
    }

    .login-wrap .login-button {
        width: 100%;
    }
</style>
