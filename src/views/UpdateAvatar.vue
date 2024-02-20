<template>
  <div>
    <Dialog
      :show="dialogConfig.show"
      :title="dialogConfig.title"
      :buttons="dialogConfig.buttons"
      width="500px"
      :showCancel="true"
      @close="dialogConfig.show = false"
    >
      <el-form
        :model="formData"
        ref="formDataRef"
        label-width="80px"
        @submit.prevent
      >
        <!--input输入-->
        <el-form-item label="昵称" prop="">
          {{ formData.nickName }}
        </el-form-item>
        <!--textarea输入-->
        <el-form-item label="头像" prop="">
          <AvatarUpload v-model="formData.avatar"></AvatarUpload>
        </el-form-item>
      </el-form>
    </Dialog>
  </div>
</template>

<script>
import AvatarUpload from "@/components/AvatarUpload.vue";
import request from "@/utils/Request.js";
import Dialog from '@/components/Dialog.vue';

export default {
  name: "UpdateAvatar",
  components:{
    Dialog, AvatarUpload
  },
  data() {
    return {
      formData: {},
      formDataRef: null,
      dialogConfig: {
        show: false,
        title: "修改头像",
        buttons: [
          {
            type: "primary",
            text: "确定",
            click: (e) => {
              submitForm();
            },
          },
        ],
      },
    };
  },
  methods: {
    show(data) {
      this.formData = Object.assign({}, data);
      this.formData.avatar = { userId: data.userId, Avatar: data.avatar };
      this.dialogConfig = true;
    },
    async submitForm(){
      if(!(this.formData.avatar instanceof File)){
        this.dialogConfig.show = false;
        return;
      }
      let res = await request({
        url : "updateUserAvatar",
        params:{
          avatar: this.formData.avatar,
        }
      });
      if(!res) return;
      this.dialogConfig.show = false;
      const cookeUserInfo = this.$cookies.get("userInfo");
      delete cookeUserInfo.avatar;
      this.$cookies.set("userInfo", cookeUserInfo, 0);
      this.$emit("updateAvatar");
    }
  },
}
</script>
