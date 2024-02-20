<template>
  <div>
    <el-dialog :show-close="showClose" :draggable="true" :model-value="show" :close-on-click-modal="false" :title="title"
      class="cust-dialog" :top="top + 'px'" :width="width" @close="close">
      <div class="dialog-body" :style="dialogBodyStyle">
        <slot></slot>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="close">取消</el-button>
          <el-button type="primary" @click="btn.click">
            {{ btn.text }}
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
//const maxHeight = window.innerHeight - props.top - 100;

export default {
  props: {
    title: {
      type: String,
    },
    show: {
      type: Boolean,
      default: false,
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
      dialogBodyStyle: {
        width: "30%",
        padding: "15px",
        top: 50,
      },
    };
  },
  methods: {
    close() {
      this.$emit("close");
    },
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