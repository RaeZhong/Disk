<template>
  <span class="avatar" :style="{ width: width + 'px', height: width + 'px' }">
    <img
      :src="
        avatar && avatar != ''
          ? avatar
          : `/api/getAvatar/${userId}?${timestamp}`
      "
      v-if="userId"
    />
  </span>
</template>

<script>
export default {
  name: "Avatar",
  props:{
    userId: String,
    avatar: String,
    timestamp: {
      type: String,
      default: 0,
    },
    width: {
      type: Number,
      default: 40,
    }
  }
}
</script>

<style lang="scss" scoped>
.avatar {
  display: flex;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  img {
    width: 100%;
    object-fit: cover;
  }
}
</style>