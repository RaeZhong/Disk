<template>
  <div>
    <Dialog ref="dialogRef" :title="dialogConfig.title" :buttons="dialogConfig.buttons" width="600px"
      :showCancel="showCancel" @close="dialogConfig.show = false">
      <el-form :model="formData" :rules="rules" ref="formDataRef" label-width="100px" @submit.prevent>
        <el-form-item label="文件"> {{ formData.fileName }} </el-form-item>
        <template v-if="showType == 0">
          <el-form-item label="有效期" prop="validType">
            <el-radio-group v-model="formData.validType">
              <el-radio :label="0">1天</el-radio>
              <el-radio :label="1">7天</el-radio>
              <el-radio :label="2">30天</el-radio>
              <el-radio :label="3">永久有效</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="提取码" prop="codeType">
            <el-radio-group v-model="formData.codeType">
              <el-radio :label="0">自定义</el-radio>
              <el-radio :label="1">系统生成</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item prop="code" v-if="formData.codeType == 0">
            <el-input clearable placeholder="请输入5位提取码" v-model.trim="formData.code" maxLength="5"
              :style="{ width: '130px' }"></el-input>
          </el-form-item>
        </template>
        <template v-else>
          <el-form-item label="分享连接" prop="validType">
            {{ shareUrl }}{{ resultInfo.shareId }}
          </el-form-item>
          <el-form-item label="提取码" prop="validType">
            {{ resultInfo.code }}
          </el-form-item>
          <el-form-item prop="validType">
            <el-button type="primary" @click="copy">复制链接极提取码</el-button>
          </el-form-item>
        </template>
      </el-form>
    </Dialog>
  </div>
</template>

<script>
import Dialog from "@/components/Dialog.vue"
import verify from "@/utils/Verfiy.js";
import request from "@/utils/Request.js";
import message from "@/utils/Message.js";

export default {
  name: "ShareFile",
  components: {
    Dialog,
  },
  data() {
    return {
      showType: 0,
      formData: {},
      rules: {
        validType: [{ required: true, message: "请选择有效期" }],
        codeType: [{ required: true, message: "请选择提取码类型" }],
        code: [
          { required: true, message: "请输入提取码" },
          { validator: verify.shareCode, message: "提取码只能是数字字母" },
          { min: 5, message: "提取码最少5位" },
        ],
      },
      showCancel: true,
      dialogConfig: {
        title: "分享",
        buttons: [
          {
            type: "primary",
            text: "确定",
            click: (e) => {
              share();
            },
          },
        ],
      },
      resultInfo: {},
    }
  },
  methods: {
    share() {
      async () => {
        if (Object.keys(this.resultInfo).length > 0) {
          this.$refs.dialogRef.showDialog();
          return;
        }
        this.$refs.formDataRef.validate(async (valid) => {
          if (!valid) {
            return;
          }
          let params = {};
          Object.assign(params, this.formData);
          let res = await request({
            url: "",
            params: params,
          });
          if (!res) return;
          this.showType = 1;
          this.resultInfo = res.data;
          this.dialogConfig.buttons[0].text = "关闭";
          this.showCancel = false;
        })
      }
    },
    show(data) {
      this.showCancel = true;
      this.$refs.dialogRef.showDialog();
      this.showType = 0;
      this.resultInfo = {};
      this.$nextTick(() => {
        this.$refs.formDataRef.resetField();
        this.formData = Object.assign({}, data);
      })
    },
    copy(){
      async() => {
        await this.$copyText(
          `链接:${shareUrl.value}${resultInfo.value.shareId} 提取码: ${resultInfo.value.code}`
        ).then(() => {
          message.success("复制成功");
        })
      }
    }
  },
}
</script>