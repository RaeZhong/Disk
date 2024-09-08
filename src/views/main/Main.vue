<template>
  <div>
    <div class="top">
      <div class="top-op">
        <div class="btn">
          <el-upload :show-file-list="false" :with-credentials="true" :multiple="true" :http-request="addFile"
            :accept="fileAccept">
            <el-button type="primary">
              <span class="iconfont icon-upload"></span>
              上传
            </el-button>
          </el-upload>
        </div>
        <el-button type="success" @click="newFolder" v-if="category == 'all'">
          <span class="iconfont icon-folder-add"></span>
          新建文件夹
        </el-button>
        <el-button @click="delFileBatch" type="danger" :disabled="selectFileIdList.length == 0">
          <span class="iconfont icon-del"></span>
          批量删除
        </el-button>
        <el-button @click="moveFolderBatch" type="warning" :disabled="selectFileIdList.length == 0">
          <span class="iconfont icon-move"></span>
          批量移动
        </el-button>
        <div class="search-panel">
          <el-input clearable placeholder="输入文件名搜索" v-model="fileNameFuzzy" @keyup.enter="search">
            <template #suffix>
              <i class="iconfont icon-search" @click="search"></i>
            </template>
          </el-input>
        </div>
        <div class="iconfont icon-refresh" @click="loadDataList"></div>
      </div>
      <!--导航-->
      <Navigation ref="navigationRef" @navChange="navChange"></Navigation>
    </div>
    <div class="file-list" v-if="tableData.list && tableData.list.length > 0">
      <Table ref="dataTableRef" :columns="columns" :showPagination="true" :dataSource="tableData" :fetch="loadDataList"
        :initFetch="false" :options="tableOptions" @rowSelected="rowSelected">
        <template #fileName="{ index, row }">
          <div class="file-item" @mouseenter="showOp(row)" @mouseleave="cancelShowOp(row)">
            <template v-if="(row.fileType == 3 || row.fileType == 1) && row.status == 2">
              <icon :cover="row.fileCover" :width="32"></icon>
            </template>
            <template v-else>
              <icon v-if="row.folderType == 0" :fileType="row.fileType"></icon>
              <icon v-if="row.folderType == 1" :fileType="0"></icon>
            </template>
            <span class="file-name" v-if="!row.showEdit" :title="row.fileName">
              <span @click="preview(row)">{{ row.fileName }}</span>
              <span v-if="row.status == 0" class="transfer-status">转码中</span>
              <span v-if="row.status == 1" class="transfer-status transfer-fail">转码失败</span>
            </span>
            <div class="edit-panel" v-show="row.showEdit">
              <el-input v-model.trim="row.fileNameReal" ref="editNameRef" :maxLength="190"
                @keyup.enter="saveNameEdit(index)">
                <template #suffix>{{ row.fileSuffix }}</template>
              </el-input>
              <span :class="[
            'iconfont icon-right1',
            row.fileNameReal ? '' : 'not-allow',
          ]" @click="saveNameEdit(index)"></span>
              <span class="iconfont icon-error" @click="cancelNameEdit(index)"></span>
            </div>
            <span class="op">
              <template v-if="row.showOp && row.fileId && row.status == 2">
                <span class="iconfont icon-share1" @click="share(row)">分享</span>
                <span class="iconfont icon-download" @click="download(row)" v-if="row.folderType == 0">下载</span>
                <span class="iconfont icon-del" @click="delFile(row)">删除</span>
                <span class="iconfont icon-edit" @click.stop="editFileName(index)">重命名</span>
                <span class="iconfont icon-move" @click="moveFolder(row)">
                  移动
                </span>
              </template>
            </span>
          </div>
        </template>
        <template #fileSize="{ index, row }">
          <span v-if="row.fileSize">
            {{ proxy.Utils.sizeTostr(row.fileSize) }}</span>
        </template>
      </Table>
    </div>
    <div class="no-data" v-else>
      <div class="no-data-inner">
        <Icon iconName="no_data" :width="120" fit="fill"></Icon>
        <div class="tips">当前目录为空，上传你的第一个文件吧</div>
        <div class="op-list">
          <el-upload :show-file-list="false" :with-credentials="true" :multiple="true" :http-request="addFile"
            :accept="fileAccept">
            <div class="op-item">
              <Icon iconName="file" :width="60"></Icon>
              <div>上传文件</div>
            </div>
          </el-upload>
          <div class="op-item" v-if="category == 'all'" @click="newFolder">
            <Icon iconName="folder" :width="60"></Icon>
            <div>新建目录</div>
          </div>
        </div>
      </div>
    </div>
    <!--预览-->
    <Preview ref="previewRef"> </Preview>
    <!--移动-->
    <FolderSelect ref="folderSelectRef" @folderSelect="moveFolderDone"></FolderSelect>
    <!--分享-->
    <FileShare ref="shareRef"></FileShare>
  </div>
</template>

<script setup>
import CategoryInfo from "@/js/CategoryInfo.js";

import { ref, reactive, getCurrentInstance, nextTick, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
const { proxy } = getCurrentInstance();
const router = useRouter();
const route = useRoute();

//上传文件
const emit = defineEmits(["addFile"]);
const addFile = async (fileDate) => {
  emit("addFile", { file: fileDate.file, filePid: currentFolder.value.fileId });
}

//添加文件回调
const reload = () => {
  showLoading.value = false;
  loadDataList();
};
defineExpose({ reload });

// 当前编辑行状态
const editing = ref(false);
// 新建文件夹行内填充的内容绑定
const editNameRef = ref();

const api = {
  loadDataList: "/file/loadDataList",
  rename: "/file/rename",
  newFoloder: "/file/newFoloder",
  getFolderInfo: "/file/getFolderInfo",
  delFile: "/file/delFile",
  changeFileFolder: "/file/changeFileFolder",
  createDownloadUrl: "/file/createDownloadUrl",
  download: "/api/file/download",
};
const showLoading = ref(true);
const category = ref();
const currentFolder = ref({
  fileId: 0
});
const tableOptions = {
  extHeight: 50,
  selectType: "checkbox",
};
const tableData = ref({});
const fileNameFuzzy = ref();

const loadDataList = async () => {
  let params = {
    pageNo: tableData.value.pageNo,
    pageSize: tableData.value.pageSize,
    fileNameFuzzy: fileNameFuzzy.value,
    category: category.value,
    filePid: currentFolder.value.fileId,
  };
  if (params.category != "all") {
    delete params.filePid;
  }
  let res = await proxy.Request({
    url: api.loadDataList,
    showLoading: showLoading,
    params,
  });
  if (!res) {
    return;
  }
  tableData.value = res.data;
  editing.value = false;
};

const fileAccept = computed(() => {
  const categoryItem = CategoryInfo[category.value];
  return categoryItem ? categoryItem.accept : "*";
})

const columns = [
  {
    label: "文件名",
    prop: "fileName",
    scopedSlots: "fileName",
  },
  {
    label: "修改时间",
    prop: "lastUpdateTime",
    width: 200,
  },
  {
    label: "大小",
    prop: "fileSize",
    scopedSlots: "fileSize",
    width: 200,
  },
];

const search = () => {
  showLoading.value = true;
  loadDataList();
};

const selectFileIdList = ref([]);

</script>

<style lang="scss" scoped>
@import "@/assets/file.list.scss";
</style>