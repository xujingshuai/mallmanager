<template>
    <div class="login-wrap">
        <el-form class="login-form" label-position="top" label-width="80px" :model="formData">
            <h2>用户管理</h2>
            <el-form-item label="用户名">
                <el-input v-model="formData.username"></el-input>
            </el-form-item>
            <el-form-item label="密码">
                <el-input v-model="formData.password"></el-input>
            </el-form-item>
            <el-button class="login-button" type="primary">登录</el-button>
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
