<template>
  <div>
    <Dialog ref="dialogRef" :show="dialogConfig.show" :title="dialogConfig.title" :buttons="dialogConfig.buttons"
      width="500px" :showCancel="true" @close="dialogConfig.show = false">
      <el-form :model="formData" ref="formDataRef" label-width="80px" @submit.prevent>
        <!--input输入-->
        <el-form-item label="昵称" prop="">
          {{ formData.userName }}
        </el-form-item>
        <!--textarea输入-->
        <el-form-item label="头像" prop="">
          <AvatarUpload v-model="formData.avatar"></AvatarUpload>
        </el-form-item>
      </el-form>
    </Dialog>
  </div>
</template>

<script setup>
import AvatarUpload from "@/components/AvatarUpload.vue";
import { ref, reactive, getCurrentInstance } from "vue";
import { useRouter, useRoute } from "vue-router"

const { proxy } = getCurrentInstance();
const router = useRouter();
const route = useRoute();

const api = {
  updateUserAvatar: "updateUserAvatar",
}

const formData = ref({});
const formDataRef = ref();

const show = (data) => {
  formData.value = Object.assign({}, data);
  formData.value.avatar = { userId: data.userId, Avatar: data.avatar };
  dialogConfig.value.show = true;
};

defineExpose({ show });

//弹出框
const dialogConfig = ref({
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
});

const emit = defineEmits(["updateAvatar"]);
const submitForm = async () => {
  if (!(formData.value.avatar instanceof File)) {
    dialogConfig.value.show = false;
  }
  let res = await proxy.Request({
    url: api.updateUserAvatar,
    params: {
      avatar: formData.value.avatar,
    }
  });
  if (!res) return;
  dialogConfig.value.show = false;
  const cookeUserInfo = proxy.VueCookies.get("userInfo");
  delete cookeUserInfo.avatar;
  proxy.VueCookies.set("userInfo", cookeUserInfo, 0);
  emit("updateAvatar");
};
</script>
