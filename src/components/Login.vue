<template>
  <div id="login">
    <div class="login_box">
      <!-- 头像区域 -->
      <div class="login_head">
        <img src="../assets/img/logo.png" alt="" />
      </div>
      <!-- 表单区域 -->
      <el-form
        label-width="0px"
        class="login_form"
        :model="loginForm"
        :rules="loginFormRules"
        ref="loginFormRef"
      >
        <el-form-item label="" prop="username">
          <el-input
            v-model="loginForm.username"
            prefix-icon="el-icon-user"
            class="label-input"
          ></el-input>
        </el-form-item>
        <el-form-item label="" prop="password">
          <el-input
            type="password"
            v-model="loginForm.password"
            class="label-input1"
            prefix-icon="el-icon-lock"
          ></el-input>
        </el-form-item>
        <el-form-item class="btns" label="">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resignFormRef">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      loginForm: {
        username: '',
        password: ''
      },
      loginFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    resignFormRef() {
      this.$refs.loginFormRef.resetFields()
      // this.loginForm.username='';
      // this.loginForm.password='';
    },
    login() {
      this.$refs.loginFormRef.validate(async valid => {
        if (!valid) return
        let { data: res } = await this.$http.post('login', this.loginForm)
        if (res.meta.status == 400) return this.$message.error('登陆失败')
        this.$message.success('登录成功')
        window.sessionStorage.setItem('token', res.data.token)
        this.$router.push('/home')
      })
    }
  }
}
</script>

<style lang="less">
#login {
  position: relative;
  height: 100vh;
  background: url('../assets/img/1.jpg') no-repeat;
  background-size: cover;
}
.login_box {
  position: absolute;
  width: 450px;
  height: 300px;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  background: black;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 5px;
  .login_head {
    position: absolute;
    left: 50%;
    width: 130px;
    height: 130px;
    border-radius: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    border: 1px solid #ccc;
    box-shadow: 0 0 10px #ddd;
    padding: 10px;
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      user-select: none;
      background: #cccccc;
    }
  }
}
.btns {
  display: flex;
  justify-content: flex-end;
  .el-button--primary {
    border: 1px solid #dcdfe6;
    background: rgba(0, 0, 0, 0.5);
  }
  .el-button--info {
    background: none;
    border-bottom: 0.3px solid #fff;
    outline: none;
    background: rgba(0, 0, 0, 0.5);
  }
}
.label-input {
  .el-input__inner {
    background: none;
    border: 0;
    border-bottom: 1px solid #fff;
    outline: none;
    color: #fff;
  }
}
.label-input1 {
  .el-input__inner {
    background: none;
    border: 0;
    border-bottom: 1px solid #fff;
    outline: none;
    color: #fff;
  }
}
.login_form {
  box-sizing: border-box;
  position: absolute;
  bottom: 18px;
  width: 100%;
  padding: 0 20px;
}
</style>
