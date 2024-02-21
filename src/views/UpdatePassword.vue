<template>
  <div>
    <Dialog
      ref="dialogRef"
      :title="dialogConfig.title"
      :buttons="dialogConfig.buttons"
      width="500px"
      :showCancel="true"
      @close="dialogConfig.show = false"
    >
      <el-form
        :model="formData"
        :rules="rules"
        ref="formDataRef"
        label-width="80px"
        @submit.prevent
      >
        <!--input输入-->
        <el-form-item label="新密码" prop="password">
          <el-input
            type="password"
            size="large"
            placeholder="请输入密码"
            v-model="formData.password"
            show-password
          >
            <template #prefix>
              <span class="iconfont icon-password"></span>
            </template>
          </el-input>
        </el-form-item>
        <!--input输入-->
        <el-form-item label="确认密码" prop="rePassword">
          <el-input
            type="password"
            size="large"
            placeholder="请再次输入密码"
            v-model="formData.rePassword"
            show-password
          >
            <template #prefix>
              <span class="iconfont icon-password"></span>
            </template>
          </el-input>
        </el-form-item>
      </el-form>
    </Dialog>
  </div>
</template>

<script>
import request from "@/utils/Request.js";
import message from "@/utils/Message.js";
import verify from "@/utils/Verfiy.js";
import Dialog from '@/components/Dialog.vue';

export default {
  name: "UpdatePassword",
  components: {
    Dialog
  },
  data() {
    const checkRePassword = (rule, value, callback) =>  {
      if (value !== this.formData.rePassword) {
        callback(new Error(rule.message));
      } else {
        callback();
      }
    };
    return {
      formData: {},
      rules: {
        password: [
          { required: true, message: "请输入密码" },
          {
            validator: verify.password,
            message: "密码只能是数字，字母，特殊字符 8-18位",
          },
        ],
        rePassword: [
          { required: true, message: "请再次输入密码" },
          {
            validator: checkRePassword,
            message: "两次输入的密码不一致",
          },
        ],
      },
      dialogConfig: {
        title: "修改密码",
        buttons: [
          {
            show: false,
            type: "primary",
            text: "确定",
            click: (e) => {
              this.submitForm();
            },
          },
        ],
      },
    };
  },
  methods: {
    show(){
      this.$refs.dialogRef.showDialog();
      this.$nextTick(() => {
        console.log(this)
        this.$refs.formData.resetFilelds();
        this.formData = {};
      });
    },
    async submitForm(){
      this.$refs.formDataRef.validate(async(valid) => {
        if(!valid) return;
        let res = await request({
          url: "updatePassword",
          params:{
            password: this.formData.password,
          }
        });
        if(!res) return;
        this.$refs.dialogRef.closeDialog();
        message.success("密码修改成功");
      })
    }
  },
};
</script>
