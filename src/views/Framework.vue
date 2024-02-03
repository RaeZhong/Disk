<template>
  <div>
    <div class="framework">
      <div class="header">
        <div class="logo">
          <span class="iconfont icon-logo"></span>
          <div class="name">
            Disk
          </div>
        </div>
        <div class="right-panel">
          <el-popover 
          :width="800"
          trigger="click"
          v-model:visible="showUploarder"
          :offset="20"
          transition="none"
          :hide-after="0"
          :popper-style="{ padding:'0px' }"
          >
          <template #reference>
            <span class="iconfont icon-transfer"></span>
          </template>
          <template #default>
            <Uploader
            ref="uploader"
            @uploadCallback="uploadCallbackHandler"
            ></Uploader>
          </template>
          </el-popover>

          <el-dropdown>
            <div class="user-info">
              <div class="avater">
                <Avatar
                  :userId="userInfo.userId"
                  :avatar="userInfo.avatar"
                  
                ></Avatar>
              </div>
            </div>
            <el-dropdown-menu></el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
</script>

<style lang="scss" scoped>
.header{
  box-shadow: 0 3px 10px 0 rgb(0 0 0 / 6%);
  height: 56px;
  padding: 0 24px;
  position: sticky;
  z-index: 200;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .logo{
    display: flex;
    align-items: center;
    .icon-logo{
      font-size: 40px;
      color: #a9b0ff;
    }
    .name{
      font-weight: bold;
      margin-left: 5px;
      font-size: 25px;
      color: #8d96de;
    }
  }
  .right-panel {
      display: flex;
      align-items: center;
    }
}

</style>