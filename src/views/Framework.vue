<template>
  <div>
    <div class="framework">
      <div class="header">
        <div class="logo">
          <span class="iconfont icon-logo"></span>
          <div class="name">Disk</div>
        </div>
        <div class="right-panel">
          <el-popover :width="800" trigger="click" v-model:visible="showUploarder" :offset="20" transition="none"
            :hide-after="0" :popper-style="{ padding: '0px' }">
            <template #reference>
              <span class="iconfont icon-transfer"></span>
            </template>
            <template #default>
              <Uploader ref="uploader" @uploadCallback="uploadCallbackHandler"></Uploader>
            </template>
          </el-popover>

          <el-dropdown>
            <div class="user-info">
              <div class="avatar">
                <Avatar :userId="userInfo.userId" :avatar="userInfo.avatar" :timestamp="timestamp" :width="46"></Avatar>
              </div>
              <span class="user-name">{{ userInfo.userName }}</span>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="updateAvatar" class="message-item">
                  修改头像
                </el-dropdown-item>
                <el-dropdown-item @click="updatePassword" class="message-item">
                  修改密码
                </el-dropdown-item>
                <el-dropdown-item @click="logout" class="message-item">
                  退出
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
      <div class="body">
        <div class="left-sider">
          <div class="menu-list">
            <div @click="jump(item)" :class="[
              'menu-item',
              item.menuCode == currentMenu.menuCode ? 'active' : '',
            ]" v-for="item in menus">
              <template v-if="item.allShow || (!item.allShow && userInfo.isAdmin)">
                <div :class="['iconfont', 'icon-' + item.icon]"></div>
                <div class="text">
                  {{ item.name }}
                </div>
              </template>
            </div>
          </div>
          <div class="menu-sub-list">
            <div 
              :class="['menu-item-sub', currentPath == sub.path ? 'active' : '']" 
              @click="jump(sub)"
              v-for="sub in currentMenu.children">
              <span :class="['iconfont', 'icon-' + sub.icon]" v-if="sub.icon"></span>
              <span class="text">{{ sub.name }}</span>
            </div>
            <div class="tips" v-if="currentMenu && currentMenu.tips">
              {{ currentMenu.tips }}
            </div>
            <div class="space-info">
              <div>空间使用</div>
              <div class="percent">
                <el-progress :percentage="Math.floor(
                  (useSpaceInfo.useSpace / useSpaceInfo.totalSpace) * 10000
                ) / 100
                  " color="#40eff">
                </el-progress>
              </div>

              <div class="space-use">
                <div class="use">
                  {{ }}
                  {{ }}
                </div>
                <div class="iconfont icon-refresh" @click="getUseSpace"></div>
              </div>
            </div>
          </div>
        </div>
        <div class="body-content">
          <router-view v-slot="{ Component }">
            <component @addFile="addFile" ref="routerViewRef" :is="Component" @reload="getUseSpace">
            </component>
          </router-view>
        </div>
      </div>
      <!--修改头像-->
      <UpdateAvatar ref="updateAvatarRef" @updateAvatar="reloadAvatar"></UpdateAvatar>
      <!--修改密码-->
      <UpdatePassword ref="updatePasswordRef"></UpdatePassword>
    </div>
  </div>
</template>

<script>
import { nextTick } from 'vue';
import request from "@/utils/Request.js";
import UpdateAvatar from './UpdateAvatar.vue';
import UpdatePassword from './UpdatePassword.vue';
import Uploader from "@/views/main/Uploader.vue";
import Avatar from '@/components/Avatar.vue';
import frameApi from '@/api/frame.js';

export default {
  components: {
    UpdateAvatar, UpdatePassword, Avatar, Uploader
  },
  data() {
    return {
      userInfo: {},
      //上传窗口
      showUploarder: false,
      timestamp: 0,
      //添加的文件
      uploaderRef: null,
      //文件回调
      routerViewRef: null,

      //路由
      menus: [
        {
          icon: "cloude",
          name: "首页",
          menuCode: "main",
          path: "/main/all",
          allShow: true,
          children: [
            {
              icon: "all",
              name: "全部",
              category: "all",
              path: "/main/all",
            },
            {
              icon: "video",
              name: "视频",
              category: "video",
              path: "/main/video",
            },
            {
              icon: "music",
              name: "音频",
              category: "music",
              path: "/main/music",
            },
            {
              icon: "image",
              name: "图片",
              category: "image",
              path: "/main/image",
            },
            {
              icon: "doc",
              name: "文档",
              category: "doc",
              path: "/main/doc",
            },
            {
              icon: "more",
              name: "其他",
              category: "others",
              path: "/main/others",
            },
          ],
        },
        {
          path: "/myshare",
          icon: "share",
          name: "分享",
          menuCode: "share",
          allShow: true,
          children: [
            {
              name: "分享记录",
              path: "/myshare",
            },
          ],
        },
        {
          path: "/recycle",
          icon: "del",
          name: "回收站",
          menuCode: "recycle",
          tips: "回收站为你保存10天内删除的文件",
          allShow: true,
          children: [
            {
              name: "删除的文件",
              path: "/recycle",
            },
          ],
        },
        {
          path: "/settings/fileList",
          icon: "settings",
          name: "设置",
          menuCode: "settings",
          allShow: false,
          children: [
            {
              name: "用户文件",
              path: "/settings/fileList",
            },
            {
              name: "用户管理",
              path: "/settings/userList",
            },
            {
              path: "/settings/sysSetting",
              name: "系统设置",
            },
          ],
        },
      ],
      currentMenu: {},
      currentPath: null,
      useSpaceInfo: { useSpace: 0, totalSpace: 1 },
      updatePasswordRef: null,
    };
  },
  created() {
    this.userInfo = this.$cookies.get("userInfo");
  },
  methods: {
    addFile(data) {
      const { file, filePid } = data;
      this.showUploarder = true;
      this.uploaderRef.addFile(file, filePid);
    },
    uploadCallbackHandler() {
      nextTick(() => {
        this.routerViewRef.reload();
        getUseSpace();
      });
    },
    jump(data) {
      if (!data.path || data.menuCode == this.currentMenu.menuCode) {
        return;
      }
      this.$router.push(data.path);
    },
    setMenu(menuCode, path) {
      const menu = this.menus.find((item) => {
        return item.menuCode === menuCode;
      });
      this.currentMenu = menu;
      this.currentPath = path;
    },
    async getUseSpace() {
      let res = await request({
        url: frameApi.getUseSpace,
        showLoading: false,
      });
      if (!res) return;
      this.useSpaceInfo = res.data;
    },
    updateAvatar() {
      this.$refs.updateAvatarRef.show(this.userInfo);
    },
    reloadAvatar() {
      this.userInfo = this.$cookies.get("userInfo");
      this.timestamp = new Date().getTime();
    },
    updatePassword() {
      this.$refs.updatePasswordRef.show();
    },
    logout() {
      this.$confirm('你确定要删除退出吗','提示',{
        confirmButtonText:'确认',
        cancelButtonText:'取消',
      }).then( async() => {
        let res = await request({
          url: frameApi.logout,
        });
        if (!res) return;
        this.$cookies.remove();
        this.$router.push("/login");
      })
    }
  },
  watch: {
    $route: {
      handler(newVal, oldVal) {
        if (newVal.meta.menuCode) {
          this.setMenu(newVal.meta.menuCode, newVal.path);
        }
      },
      deep: true,
      immediate: true
    },
  }
};
</script>

<style lang="scss" scoped>
.header {
  box-shadow: 0 3px 10px 0 rgb(0 0 0 / 6%);
  height: 56px;
  padding: 0 24px;
  position: sticky;
  z-index: 200;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .logo {
    display: flex;
    align-items: center;

    .icon-logo {
      font-size: 40px;
      color: #a9b0ff;
    }

    .name {
      font-weight: bold;
      margin-left: 5px;
      font-size: 25px;
      color: #8d96de;
    }
  }

  .right-panel {
    display: flex;
    align-items: center;

    .icon-transfer {
      cursor: pointer;
    }

    .user-info {
      margin-right: 10px;
      display: flex;
      align-items: center;
      cursor: pointer;

      .avatar {
        margin: 0px 5px 0px 15px;
      }

      .user-name {
        color: #a9b0ff;
      }
    }
  }
}

.body {
  display: flex;

  .left-sider {
    border-right: 1px solid #f1f2f4;
    display: flex;

    .menu-list {
      height: calc(100vh - 56px);
      width: 80px;
      box-shadow: 0 3px 10px 0 rgb(0 0 0 / 6%);
      border-right: 1px solid #f1f2f4;

      .menu-item {
        text-align: center;
        font-size: 14px;
        font-weight: bold;
        padding: 20px 0px;
        cursor: pointer;

        &:hover {
          background: #f3f3f3;
        }

        .iconfont {
          font-weight: normal;
          font-size: 28px;
          color: #7e7e7e;
        }

        .text{
          color: #7e7e7e;
        }
      }

      .active {
        .iconfont {
          color: #a9b0ff;
        }
        .text {
          color: #8b95fb;
        }
      }
    }

    .menu-sub-list {
      width: 200px;
      padding: 20px 10px 0px;
      position: relative;

      .menu-item-sub {
        text-align: center;
        line-height: 40px;
        border-radius: 5px;
        cursor: pointer;

        &:hover {
          background: #f3f3f3;
        }

        .iconfont {
          font-size: 14px;
          margin-right: 20px;
          color: #7e7e7e;
        }

        .text {
          font-size: 13px;
          font-weight: 500;
          color:#5b5b5b;
        }
      }

      .active {
        background: #eef9fe;
        .iconfont {
          color: #a9b0ff;
        }
        .text {
          color: #8b95fb;
        }
      }

      .tips {
        margin-top: 10px;
        color: #888888;
        font-size: 13px;
      }

      .space-info {
        position: absolute;
        bottom: 10px;
        width: 100%;
        padding: 0px 5px;

        .percent {
          padding-right: 10px;
        }

        .space-use {
          margin-top: 5px;
          color: #7e7e7e;
          display: flex;
          justify-content: space-around;

          .use {
            flex: 1;
          }

          .iconfont {
            cursor: pointer;
            margin-right: 20px;
            color:  #a9b0ff;
          }
        }
      }
    }
  }
}

.body-content {
  flex: 1;
  width: 0;
  padding-left: 20px;
}
</style>
