<template>
  <div class="login-body">
    <div class="bg"></div>
    <div class="login-panel">
      <el-form
        ref="formData"
        class="login-register"
        :rules="rules"
        :model="formData"
        @submit.prevent
      >
        <h2>云盘</h2>

        <el-form-item prop="email">
          <el-input
            size="large"
            clearable
            placeholder="请输入邮箱"
            maxlength="150"
            v-model.trim="formData.email"
          >
            <template #prefix>
              <span class="iconfont icon-icon-user"></span>
            </template>
          </el-input>
        </el-form-item>

        <!--登录-->
        <el-form-item prop="password" v-if="opType == 1">
          <el-input
            type="password"
            size="large"
            clearable
            placeholder="请输入密码"
            v-model.trim="formData.password"
          >
            <template #prefix>
              <span class="iconfont icon-mima"></span>
            </template>
          </el-input>
        </el-form-item>

        <!--注册/找回密码-->
        <div v-else>
          <el-form-item prop="emailCode">
            <div class="send-email-panel">
              <el-input
                clearable
                size="large"
                placeholder="请输入邮箱验证码"
                v-model.trim="formData.emailCode"
              >
                <template #prefix>
                  <span class="iconfont icon-anquan"></span>
                </template>
              </el-input>
              <el-button
                class="send-email-btn"
                type="primary"
                size="large"
                @click="sendEmailCode"
              >
                获取验证码
              </el-button>
            </div>
            <el-popover placement="left" :width="500" trigger="click">
              <p>1、在垃圾箱中查找邮箱验证码</p>
              <p>2、在邮箱中头像->设置->白名单->设置邮件地址白名单</p>
              <template #reference>
                <el-link type="primary"> 未收到邮箱验证码？ </el-link>
              </template>
            </el-popover>
          </el-form-item>

          <el-form-item prop="userName" v-if="opType == 0">
            <el-input
              size="large"
              clearable
              placeholder="请输入昵称"
              maxlength="20"
              v-model="formData.userName"
            >
              <template #prefix>
                <span class="iconfont icon-icon-user"></span>
              </template>
            </el-input>
          </el-form-item>

          <el-form-item prop="registerPassword">
            <el-input
              type="password"
              size="large"
              clearable
              placeholder="请输入密码"
              v-model.trim="formData.registerPassword"
            >
              <template #prefix>
                <span class="iconfont icon-mima"></span>
              </template>
            </el-input>
          </el-form-item>

          <el-form-item prop="reRegisterPassword">
            <el-input
              type="password"
              size="large"
              clearable
              placeholder="请再次输入密码"
              v-model.trim="formData.reRegisterPassword"
            >
              <template #prefix>
                <span class="iconfont icon-mima"></span>
              </template>
            </el-input>
          </el-form-item>
        </div>

        <el-form-item prop="checkCode">
          <div class="check-code-panel">
            <el-input
              size="large"
              clearable
              placeholder="请输入验证码"
              v-model.trim="formData.checkCode"
              @keyup.enter="onSubmit"
            >
              <template #prefix>
                <span class="iconfont icon-anquan"></span>
              </template>
            </el-input>
            <img
              class="check-code"
              @click="changeCheckCode(0)"
              :src="checkCodeUrl"
            />
          </div>
        </el-form-item>

        <el-form-item>
          <div class="rememberme-panel" v-if="opType == 1">
            <el-checkbox v-model="formData.rememberMe">记住我</el-checkbox>
          </div>
          <div class="no-account" v-if="opType == 1">
            <el-link
              type="primary"
              href="javascript:void(0)"
              @click="showPanel(2)"
            >
              忘记密码？
            </el-link>
            <el-link
              type="primary"
              href="javascript:void(0)"
              @click="showPanel(0)"
            >
              没有账号？
            </el-link>
          </div>
          <el-link
            type="primary"
            href="javascript:void(0)"
            @click="showPanel(1)"
            v-else-if="opType == 0"
          >
            已有账号？
          </el-link>
          <el-link
            type="primary"
            href="javascript:void(0)"
            @click="showPanel(1)"
            v-else
          >
            去登陆？
          </el-link>
        </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            class="op-btn"
            size="large"
            @click="onSubmit"
          >
            <span v-if="opType == 0">注册</span>
            <span v-else-if="opType == 1">登录</span>
            <span v-else>重置密码</span>
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import verfiy from "@/utils/Verfiy.js";
import message from "@/utils/Message.js";
import request from "@/utils/Request.js";
import api from "@/api/login.js";
import md5 from "js-md5";

export default {
  onMounted(){
    this.showPanel(1);
  },
  data() {
    const checkRePassword = (rule, value, callback) => {
      if (value !== this.formData.registerPassword) {
        callback(new Error(rule.message));
      } else {
        callback();
      }
    };
    return {
      //0:注册 1：登录 2：重置密码
      opType: 1,
      checkCodeUrl: api.checkCode,
      formDataSendMailCode: api.checkCode,
      formData: {
        email: "",
        password: "",
        emailCode: "",
        userName: "",
        registerPassword: "",
        reRegisterPassword: "",
        checkCode: "",
      },
      rules: {
        email: [
          {
            required: true,
            message: "请输入邮箱",
          },
          {
            validator: verfiy.email,
            trigger: "blur",
            message: "请输入正确的邮箱",
          },
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
        emailCode: [
          { required: true, message: "请输入邮箱验证码", trigger: "blur" },
        ],
        userName: [
          { required: true, message: "请输入用户名", trigger: "blur" },
        ],
        registerPassword: [
          {
            required: true,
            message: "请输入密码",
          },
          {
            validator: verfiy.password,
            message: "密码只能是数字，字母，特殊字符8-18位",
            trigger: "blur",
          },
        ],
        reRegisterPassword: [
          {
            required: true,
            message: "请再次输入密码",
          },
          {
            validator: checkRePassword,
            message: "两次输入密码不一致",
            trigger: "blur",
          },
        ],
        checkCode: [
          { required: true, message: "请输入图片验证码", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    showPanel(type) {
      this.opType = type;
      this.restForm();
    },
    changeCheckCode(type) {
      if (type == 0) {
        this.checkCodeUrl =
          api.checkCode + "?type" + type + "&time" + new Date().getTime();
          //console.log("进入了");
      } else {
        this.sendEmailCode =
          api.checkCode + "?type" + type + "&time" + new Date().getTime();
      }
    },
    sendEmailCode() {
      this.$refs.formData.validateField("email",async (valid) => {
        if (!valid) return;
        const params = Object.assign({}, this.formData);
        params.type = this.opType == 0 ? 0 : 1;
        // console.log(api.sendEmailCode + "+", params);
        let result = request({
          url: api.sendEmailCode,
          params: params,
          errorCallback: () => {
            changeCheckCode(1);
          },
        });
        if (!result) return;
        message.success("验证码发送成功，请登录邮箱查看");
      });
    },
    onSubmit() {
      this.$refs.formData.validate(async (valid) => {
        if (!valid) return;
        const params = {};
        Object.assign(params, this.formData);
        
        //注册，重置密码
        if (this.opType == 0 || this.opType == 2) {
          params.password = params.registerPassword;
          delete params.reRegisterPassword;
          delete params.registerPassword;
        }
        //登录
        if(this.opType == 1){
          let cookiesLoginInfo = this.$cookies.get("loginInfo");
          
          let cookiePassword = cookiesLoginInfo == null ? null:cookiesLoginInfo.password;
          if(params.password != cookiePassword){
            params.password = md5(params.password);
          }
        }

        let url = null;
        switch (this.opType) {
          case 0:
            url = api.register;
            break;
          case 1:
            url = api.login;
            break;
          case 2:
            url = api.restPwd;
          default:
            break;
        }

        //console.log(params,url);
        let result = await request({
          url: url,
          params: params,
          errorCallback: () => {
            this.changeCheckCode(0);
          },
        });
        if (!result) {
          return;
        }
        console.log(result);
        if(this.opType == 0){
          message.success("注册成功，请登录");
          showPanel(1);
        }else if(this.opType == 1){
          console.log(params);
          if(params.rememberMe){
            const loginInfo = {
              email: params.email,
              password: params.password,
              rememberMe: params.rememberMe,
            };
            this.$cookies.set("loginInfo",loginInfo,"7d")
          }else{
            this.$cookies.remove("loginInfo");
          }
            message.success("登陆成功");
            this.$cookies.set("userInfo", result.data, 0);
            console.log(this.$cookies.keys);
            const redirectUrl = this.$route.query.redirect || '/'
            this.$router.push(redirectUrl);
          }else if(this.opType == 2){
            message.success("重置密码成功，请登录");
            showPanel(1);
        }
      });
    },
    restForm() {
      this.$nextTick(()=>{
        this.changeCheckCode(0);
        this.$refs.formData.resetFields();
        this.formData =  {};
      })
      if(this.opType == 1){
        const cookiesLoginInfo = this.$cookies.get("loginInfo");
        if(cookiesLoginInfo){
          this.formData = cookiesLoginInfo;
        };
      }
    },
  },
};
</script>

<style scoped lang="scss">
.login-body {
  height: 100vh;
  background-size: cover;
  background-image: url(../assets/login-bk.jpg);
  display: flex;

  .bg {
    flex: 1;
    background-size: 60%;
    background-repeat: no-repeat;
    background-position: center;
    background-image: url(../assets/login-pp.png);
  }

  .login-panel {
    width: 25%;
    margin-right: 8%;
    margin-top: calc((100vh - 600px) / 2);

    .login-register {
      padding: 24px;
      background-color: white;
      border-radius: 5px;
    }

    h2 {
      margin-top: 0;
      text-align: center;
      color: grey;
    }

    .send-email-panel {
      width: 100%;
      display: flex;
      justify-content: space-between;

      .send-email-btn {
        margin-left: 4px;
      }
    }

    .check-code-panel {
      width: 100%;
      display: flex;

      .check-code {
        margin-left: 4px;
        cursor: pointer;
      }
    }

    .rememberme-panel {
      width: 100%;
    }

    .no-account {
      width: 100%;
      display: flex;
      justify-content: space-between;
    }

    .op-btn {
      width: 100%;
    }
  }
}
</style>
