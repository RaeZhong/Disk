<template>
  <div>
    <Dialog :show="dialogConfig.show" :title="dialogConfig.title" :buttons="dialogConfig.buttons" width="500px"
      :showCancel="true" @close="dialogConfig.show = false">
      <el-form ref="formDataRef" :model="formData" :rules="rules" label-width="80px" @submit.prevent>
        <!--input输入-->
        <el-form-item label="新密码" prop="password">
          <el-input type="password" size="large" placeholder="请输入密码" v-model.trim="formData.password" show-password>
            <template #prefix>
              <span class="iconfont icon-password"></span>
            </template>
          </el-input>
        </el-form-item>
        <!--input输入-->
        <el-form-item label="确认密码" prop="rePassword">
          <el-input type="password" size="large" placeholder="请再次输入密码" v-model.trim="formData.rePassword" show-password>
            <template #prefix>
              <span class="iconfont icon-password"></span>
            </template>
          </el-input>
        </el-form-item>
      </el-form>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, reactive, getCurrentInstance, nextTick } from "vue";

const { proxy } = getCurrentInstance();
const api = {
  updatePassword: "updatePassword",
}

const formData = ref({});
const formDataRef = ref();

//校检密码
const checkRePassword = (rule, value, callback) => {
  if (value !== formData.value.rePassword) {
    callback(new Error(rule.message));
  } else {
    callback();
  }
};
const rules = {
  password: [
    { required: true, message: "请输入密码", trigger: "blur" },
    {
      validator: proxy.Verify.password,
      message: "密码只能是数字，字母，特殊字符 8-18位",
    },
  ],
  rePassword: [
    { required: true, message: "请再次输入密码", trigger: "blur" },
    {
      validator: checkRePassword,
      message: "两次输入的密码不一致",
    },
  ],
};

const show = () => {
  dialogConfig.value.show = true;
  nextTick(() => {
    //console.log(this)
    formDataRef.value.resetFields();
    formData.value = {};
  });
};

defineExpose({ show });

const dialogConfig = ref({
  show: false,
  title: "修改密码",
  buttons: [
    {
      type: "primary",
      text: "确定",
      click: (e) => {
        submitForm();
      },
    },
  ],
});

const submitForm = async () => {
  formDataRef.value.validate(async (valid) => {
    if (!valid) return;
    let res = await proxy.Request({
      url: api.updatePassword,
      params: {
        password: formData.value.password,
      }
    });
    if (!res) return;
    dialogConfig.value.show = false;
    proxy.Message.success("密码修改成功");
  })
};
</script>
