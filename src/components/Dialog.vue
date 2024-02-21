<template>
  <div>
    <el-dialog 
      :show-close="showClose" 
      :draggable="true" 
      v-model="show" 
      :close-on-click-modal="false" 
      :title="title"
      class="cust-dialog" 
      :top="top + 'px'" 
      :width="width" 
      @close="close"
    >
      <div class="dialog-body" :style="{ 'max-height': maxHeight + 'px', padding: padding + 'px' }">
        <slot></slot>
      </div>
      <template v-if="(buttons && buttons.length > 0) || showCancel">
        <div class="dialog-footer">
          <el-button link @click="close" v-if="showCancel"> 取消 </el-button>
          <el-button
            v-for="btn in buttons"
            :type="btn.type || 'primary'"
            @click="btn.click"
          >
          {{ btn.text }}
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>

export default {
  props: {
    title: {
      type: String,
    },
    showClose: {
      type: Boolean,
      default: true,
    },
    showCancel: {
      type: Boolean,
      default: true,
    },
    top: {
      type: Number,
      default: 50,
    },
    width: {
      type: String,
      default: "30%",
    },
    buttons: {
      type: Array,
    },
    padding: {
      type: Number,
      default: 15,
    }
  },
  data() {
    return {
      maxHeight : window.innerHeight - top - 100,
      show: false,
    };
  },
  methods: {
    close() {
      this.$emit("close");
    },
    showDialog(){
      this.show = true;
    },
    closeDialog(){
      this.show = false;
    }
  },
};
</script>

<style lang="scss" scoped>
.cust-dialog {
  margin: 30px auto 10px !important;

  .el-dialog-body {
    padding: 0;
  }

  .dialog-body {
    overflow: auto;
  }

  .dialog-footer {
    text-align: right;
    padding: 5px 20px;
  }
}
</style>