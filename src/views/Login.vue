<template>
  <div class="login-body">
    <div class="bg"></div>
    <div class="login-panel">
      <el-form ref="formDataRef" class="login-register" :rules="rules" :model="formData" @submit.prevent>
        <h2>云盘</h2>

        <el-form-item prop="email">
          <el-input size="large" clearable placeholder="请输入邮箱" maxlength="150" v-model.trim="formData.email">
            <template #prefix>
              <span class="iconfont icon-icon-user"></span>
            </template>
          </el-input>
        </el-form-item>

        <!--登录-->
        <el-form-item prop="password" v-if="opType == 1">
          <el-input type="password" size="large" clearable placeholder="请输入密码" v-model.trim="formData.password">
            <template #prefix>
              <span class="iconfont icon-mima"></span>
            </template>
          </el-input>
        </el-form-item>

        <!--注册/找回密码-->
        <div v-else>
          <el-form-item prop="emailCode">
            <div class="send-email-panel">
              <el-input clearable size="large" placeholder="请输入邮箱验证码" v-model.trim="formData.emailCode">
                <template #prefix>
                  <span class="iconfont icon-anquan"></span>
                </template>
              </el-input>
              <el-button class="send-email-btn" type="primary" size="large" @click="sendEmailCode">
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
            <el-input size="large" clearable placeholder="请输入昵称" maxlength="20" v-model="formData.userName">
              <template #prefix>
                <span class="iconfont icon-icon-user"></span>
              </template>
            </el-input>
          </el-form-item>

          <el-form-item prop="registerPassword">
            <el-input type="password" size="large" clearable placeholder="请输入密码"
              v-model.trim="formData.registerPassword">
              <template #prefix>
                <span class="iconfont icon-mima"></span>
              </template>
            </el-input>
          </el-form-item>

          <el-form-item prop="reRegisterPassword">
            <el-input type="password" size="large" clearable placeholder="请再次输入密码"
              v-model.trim="formData.reRegisterPassword">
              <template #prefix>
                <span class="iconfont icon-mima"></span>
              </template>
            </el-input>
          </el-form-item>
        </div>

        <el-form-item prop="checkCode">
          <div class="check-code-panel">
            <el-input size="large" clearable placeholder="请输入验证码" v-model.trim="formData.checkCode"
              @keyup.enter="onSubmit">
              <template #prefix>
                <span class="iconfont icon-anquan"></span>
              </template>
            </el-input>
            <img class="check-code" @click="changeCheckCode(0)" :src="checkCodeUrl" />
          </div>
        </el-form-item>

        <el-form-item>
          <div class="rememberme-panel" v-if="opType == 1">
            <el-checkbox v-model="formData.rememberMe">记住我</el-checkbox>
          </div>
          <div class="no-account" v-if="opType == 1">
            <el-link type="primary" href="javascript:void(0)" @click="showPanel(2)">
              忘记密码？
            </el-link>
            <el-link type="primary" href="javascript:void(0)" @click="showPanel(0)">
              没有账号？
            </el-link>
          </div>
          <el-link type="primary" href="javascript:void(0)" @click="showPanel(1)" v-else-if="opType == 0">
            已有账号？
          </el-link>
          <el-link type="primary" href="javascript:void(0)" @click="showPanel(1)" v-else>
            去登陆？
          </el-link>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" class="op-btn" size="large" @click="onSubmit">
            <span v-if="opType == 0">注册</span>
            <span v-else-if="opType == 1">登录</span>
            <span v-else>重置密码</span>
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, getCurrentInstance, nextTick, onMounted } from 'vue'
import { useRouter, useRoute } from "vue-router"
import md5 from "js-md5"

const { proxy } = getCurrentInstance();
const router = useRouter();
const route = useRoute();

const api = {
  checkCode: "api/checkCode",
  sendEmailCode: "/sendEmailCode",
  register: "/register",
  login: "/login",
  resetPwd: "/resetPwd",
};

const opType = ref(1);
const showPanel = (type) => {
  opType.value = type;
  restForm();
};

onMounted(() => {
  showPanel(1);
});

//校检确认密码
const checkRePassword = (rule, value, callback) => {
  if (value !== formData.value.registerPassword) {
    callback(new Error(rule.message));
  } else {
    callback();
  }
};

const formData = ref({});
const formDataRef = ref();
//校检规则
const rules = {
  email: [
    {
      required: true,
      message: "请输入邮箱",
    },
    {
      validator: proxy.Verify.email,
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
      validator: proxy.Verify.password,
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
};

//验证
const checkCodeUrl = ref(api.checkCode);
const checkCodeUrlSendEmailCode = ref(api.checkCode);
const changeCheckCode = (type) => {
  if (type == 0) {
    checkCodeUrl.value =
      api.checkCode + "?type" + type + "&time" + new Date().getTime();
    //console.log("进入了");
  } else {
    checkCodeUrlSendEmailCode.value =
      api.checkCode + "?type" + type + "&time" + new Date().getTime();
  }
};

//注册邮箱
const sendEmailCode = () => {
  formDataRef.value.validateField("email", async (valid) => {
    if (!valid) return;
    const params = Object.assign({}, this.formData);
    params.type = this.opType == 0 ? 0 : 1;
    // console.log(api.sendEmailCode + "+", params);
    let result = await proxy.Request({
      url: api.sendEmailCode,
      params: params,
      errorCallback: () => {
        changeCheckCode(1);
      },
    });
    if (!result) return;
    proxy.Message.success("验证码发送成功，请登录邮箱查看");
  });
};

const restForm = () => {
  nextTick(() => {
    changeCheckCode(0);
    formDataRef.value.resetFields();
    formData.value = {};
  })
  if (opType.value == 1) {
    const cookiesLoginInfo = proxy.VueCookies.get("loginInfo");
    if (cookiesLoginInfo) {
      formData.value = cookiesLoginInfo;
    };
  }
};

const onSubmit = () => {
  formDataRef.value.validate(async (valid) => {
    if (!valid) return;
    const params = {};
    Object.assign(params, formData.value);

    //注册，重置密码
    if (opType.value == 0 || opType.value == 2) {
      params.password = params.registerPassword;
      delete params.reRegisterPassword;
      delete params.registerPassword;
    }
    //登录
    if (opType.value == 1) {
      let cookiesLoginInfo = proxy.VueCookies.get("loginInfo");

      let cookiePassword = cookiesLoginInfo == null ? null : cookiesLoginInfo.password;
      if (params.password != cookiePassword) {
        params.password = md5(params.password);
      }
    }

    let url = null;
    switch (opType.value) {
      case 0:
        url = api.register;
        break;
      case 1:
        url = api.login;
        break;
      case 2:
        url = api.resetPwd;
      default:
        break;
    }

    //console.log(params,url);
    let result = await proxy.Request({
      url: url,
      params: params,
      errorCallback: () => {
        changeCheckCode(0);
      },
    });
    if (!result) {
      return;
    }
    console.log(result);
    if (opType.value == 0) {
      proxy.Message.success("注册成功，请登录");
      showPanel(1);
    } else if (opType.value == 1) {
      console.log(params);
      if (params.rememberMe) {
        const loginInfo = {
          email: params.email,
          password: params.password,
          rememberMe: params.rememberMe,
        };
        proxy.VueCookies.set("loginInfo", loginInfo, "7d")
      } else {
        proxy.VueCookies.remove("loginInfo");
      }
      proxy.Message.success("登陆成功");
      proxy.VueCookies.set("userInfo", result.data, 0);
      console.log(proxy.VueCookies.keys);
      const redirectUrl = route.query.redirectUrl || '/';
      router.push(redirectUrl);
    } else if (opType.value == 2) {
      proxy.Message.success("重置密码成功，请登录");
      showPanel(1);
    }
  });
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
