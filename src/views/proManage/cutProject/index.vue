<template>
  <div class="sel_project" v-loading="listLoading">
    <div class="title_group">项目列表</div>
    <div class="pro_container">
      <el-row :gutter="12" class="pro_row">
        <el-col
          v-for="(item, index) in projectList"
          :key="index"
          class="pro_col"
          :xs="24"
          :sm="6"
          :md="6"
          :lg="6"
          :xl="6"
        >
          <div class="item_group">
            <div class="item_head">
              <div class="logo">
                <img :src="item.baseUrl + item.image" alt="" />
              </div>
              <div class="titles">
                <h3 v-text="item.name"></h3>
                <p style="color: #999" v-if="item.status == 1">未开始</p>
                <p style="color: #67c23a" v-if="item.status == 2">进行中</p>
                <p style="color: #999" v-if="item.status == 3">已结束</p>
              </div>
            </div>
            <p v-text="'类型：' + item.typeText"></p>
            <p v-text="'机构：' + item.orgName"></p>
            <p v-text="'经理：' + item.projectUserName"></p>
            <p v-text="'周期：' + item.startDate + ' ' + item.endDate"></p>
            <div class="pro_mask">
              <div class="btns_group">
                <el-button size="small" @click="showRoutes(item)" type="primary"
                  >查看</el-button
                >
                <el-button size="small" @click="editPop(index)" type="warning"
                  >修改</el-button
                >
              </div>
            </div>
          </div>
        </el-col>
        <el-col class="pro_col" :xs="24" :sm="6" :md="6" :lg="6" :xl="6"
          ><div class="item_group" @click="showAddPop">
            <p class="add_btn">+添加</p>
          </div>
        </el-col>
      </el-row>
    </div>
    <!-- 不滚动锁定 :lock-scroll="false" -->
    <el-dialog
      title="项目信息"
      :lock-scroll="false"
      :visible.sync="addShow"
      :close-on-click-modal="false"
      width="50%"
      center
    >
      <div class="pop_content">
        <el-row :gutter="20">
          <el-col :span="12"
            ><div class="dialog_col">
              <p>项目名称</p>
              <el-input
                class="sel_item"
                size="medium"
                v-model="proItem.name"
                placeholder="请输入内容"
              ></el-input></div
          ></el-col>
          <el-col :span="12"
            ><div class="dialog_col">
              <p>项目机构</p>
              <el-input
                class="sel_item"
                size="medium"
                v-model="proItem.orgName"
                placeholder="请输入内容"
              ></el-input></div
          ></el-col>
          <el-col :span="12"
            ><div class="dialog_col">
              <p>项目类型</p>
              <el-select
                class="sel_item"
                size="medium"
                v-model="typeValue"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in proTypeList"
                  :key="item.id"
                  :label="item.value"
                  :value="item.id"
                >
                </el-option>
              </el-select></div
          ></el-col>
          <el-col :span="12"
            ><div class="dialog_col">
              <p>项目经理</p>
              <el-select
                class="sel_item"
                size="medium"
                v-model="managerValue"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in proManagerList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                >
                </el-option>
              </el-select></div
          ></el-col>
          <el-col :span="12"
            ><div class="dialog_col">
              <p>开始时间</p>
              <el-date-picker
                value-format="yyyy-MM-dd"
                format="yyyy-MM-dd"
                size="medium"
                class="sel_item"
                v-model="proItem.startDate"
                type="date"
                placeholder="选择日期"
              >
              </el-date-picker></div
          ></el-col>
          <el-col :span="12"
            ><div class="dialog_col">
              <p>结束时间</p>
              <el-date-picker
                value-format="yyyy-MM-dd"
                format="yyyy-MM-dd"
                size="medium"
                class="sel_item"
                v-model="proItem.endDate"
                type="date"
                placeholder="选择日期"
              >
              </el-date-picker></div
          ></el-col>
          <el-col :span="12"
            ><div class="dialog_col">
              <p>项目图片</p>
              <!--                 action="http://192.168.1.29:8012/config/upload/image" -->
              <el-upload
                action="#"
                class="avatar-uploader"
                accept="image/png,image/gif,image/jpg,image/jpeg"
                :show-file-list="false"
                :before-upload="handleBeforeUpload"
              >
                <img
                  v-if="proItem.image"
                  :src="proItem.baseUrl + proItem.image"
                  class="avatar"
                />
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload></div
          ></el-col>
        </el-row>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addShow = false">取 消</el-button>
        <el-button type="primary" @click="submitFrom">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { mapState, mapActions, mapMutations } from "vuex";
import {
  _getProjectList,
  _uploadPic,
  _getProTypeList,
  _getProManagerList,
  _addRoEditPro,
} from "@/services/home";
export default {
  data() {
    return {
      listLoading: false,
      projectList: [],
      proItem: {
        baseUrl: "",
        endDate: "",
        id: 0,
        image: "",
        name: "",
        orgName: "",
        projectUserId: 0,
        projectUserName: "",
        startDate: "",
        type: 0,
      },
      typeValue: "",
      // typeKey: 0,
      managerValue: "",
      // managerKey: 0,
      proTypeList: [],
      proManagerList: [],

      value1: "",
      value: "",
      input: "",
      addShow: false,
      isAdd: true,
    };
  },
  mounted() {
    this.listLoading = true;
    this.getList();
    this.getProTypeList();
    this.getProManagerList();
  },
  methods: {
    ...mapActions(["asyncRoute", "showAddRoutes"]),
    ...mapMutations(["setProjectId"]),
    showRoutes(item) {
      this.$store.dispatch("permission/showAddRoutes");
      // this.$store.dispatch("permission/setShowMenu", true);
      localStorage.setItem("showMenu", true);
      localStorage.setItem("projectId", item.id);

      this.setProjectId(item.id);
      this.pushTo("ProjectHome");
      // const newRoute = JSON.parse(
      //   JSON.stringify(this.$store.state.routerInfo.routes)
      // );
      // newRoute[0].children.forEach((item) => {
      //   item.hidden = false;
      // });
      // this.asyncRoute(newRoute);
      // this.setProjectId(item.id);
      // let newRoute = JSON.parse(
      //   JSON.stringify(this.$store.state.routerInfo.addRoutes)
      // );
    },
    getList() {
      _getProjectList().then((res) => {
        if (res.code == 1) {
          this.projectList = res.data;
          this.listLoading = false;
        } else {
          this.$message({ message: res.msg, type: "warning" });
        }
      });
    },
    getProTypeList() {
      _getProTypeList().then((res) => {
        if (res.code == 1) {
          this.proTypeList = res.data;
        }
      });
    },
    getProManagerList() {
      _getProManagerList().then((res) => {
        if (res.code == 1) {
          this.proManagerList = res.data;
        }
      });
    },
    showAddPop() {
      this.proItem.baseUrl = "";
      this.proItem.endDate = "";
      this.proItem.id = 0;
      this.proItem.image = "";
      this.proItem.name = "";
      this.proItem.orgName = "";
      this.proItem.projectUserId = 0;
      this.proItem.projectUserName = "";
      this.proItem.startDate = "";
      this.proItem.type = 0;
      this.typeValue = "";
      this.managerValue = "";
      this.addShow = true;
    },
    editPop(index) {
      this.typeValue = this.projectList[index].type;
      this.managerValue = this.projectList[index].projectUserId;
      this.proItem = Object.assign({}, this.projectList[index]);
      this.addShow = true;
    },
    submitFrom() {
      if (this.proItem.name == "")
        return this.$message({ type: "warning", message: "请输入项目名称" });
      if (this.proItem.orgName == "")
        return this.$message({ type: "warning", message: "请输入机构名称" });
      if (this.typeValue == "")
        return this.$message({ type: "warning", message: "请选择项目类型" });
      if (this.managerValue == "")
        return this.$message({ type: "warning", message: "请选择项目经理" });
      if (this.proItem.startDate == "")
        return this.$message({ type: "warning", message: "请选择开始时间" });
      if (this.proItem.endDate == "")
        return this.$message({ type: "warning", message: "请选择结束时间" });
      if (this.proItem.image == "")
        return this.$message({ type: "warning", message: "请上传图片" });
      // if (this.isAdd) {
      //   return;
      // }
      this.proManagerList.forEach((val) => {
        if (val.id == this.managerValue) {
          this.proItem.projectUserName = val.name;
        }
      });
      this.proItem.type = this.typeValue;
      this.proItem.projectUserId = this.managerValue;
      _addRoEditPro(this.proItem).then((res) => {
        if (res.code == 1) {
          this.listLoading = true;
          this.addShow = false;
          this.$message({ message: res.msg, type: "success" });
          this.getList();
        } else {
          this.$message({ message: res.msg, type: "warning" });
        }
      });
    },
    handleBeforeUpload(file) {
      if (
        !(
          file.type === "image/png" ||
          file.type === "image/gif" ||
          file.type === "image/jpg" ||
          file.type === "image/jpeg"
        )
      ) {
        this.$message({
          message:
            "请上传格式为image/png, image/gif, image/jpg, image/jpeg的图片",
          type: "warning",
        });
        return;
      }
      let size = file.size / 1024 / 1024 / 2;
      if (size > 2) {
        this.$message({
          message: "图片大小必须小于2M",
          type: "warning",
        });
        return;
      }
      let fd = new FormData(); //通过form数据格式来传
      fd.append("filename", file); //传文件
      _uploadPic(fd).then((res) => {
        if (res.code == 1) {
          this.proItem.baseUrl = res.data.baseUrl;
          this.proItem.image = res.data.key;
        } else {
          this.$message({ message: res.msg, type: "warning" });
        }
      });
    },
  },
};
</script>
<style lang="less">
.sel_project {
  margin: 20px;
  .title_group {
    background: #ffffff;
    border: 1px solid #dddddd;
    padding: 16px;
    font-size: 16px;
    border-radius: 4px;
  }
  .pro_container {
    .pro_row {
      .item_group {
        position: relative;
        height: 200px;
        width: 100%;
        border: 1px solid #dddddd;
        background: #ffffff;
        padding: 12px;
        .item_head {
          display: flex;
          margin-bottom: 10px;
          .logo {
            > img {
              width: 60px;
              height: 60px;
            }
          }
          .titles {
            margin-left: 14px;
            > h3 {
              font-size: 14px;
              line-height: 1.5;
            }
            > p {
              font-size: 12px;
              line-height: 1.5;
            }
          }
        }
        > p {
          font-size: 12px;
          line-height: 2;
        }
        .add_btn {
          position: absolute;
          left: 50%;
          top: 50%;
          -webkit-transform: translate(-50%, -50%);
          -ms-transform: translate(-50%, -50%);
          transform: translate(-50%, -50%);
        }
        .pro_mask {
          width: 100%;
          height: 100%;
          position: absolute;
          left: 0;
          top: 0;
          background: rgba(0, 0, 0, 0.5);
          opacity: 0;
          transition: opacity 1s;
          -webkit-transition: opacity 1s;
          .btns_group {
            display: flex;
            position: absolute;
            left: 50%;
            top: 50%;
            -webkit-transform: translate(-50%, -50%);
            -ms-transform: translate(-50%, -50%);
            transform: translate(-50%, -50%);
          }
        }
      }
      .item_group:hover {
        .pro_mask {
          opacity: 1;
        }
      }
      .pro_col {
        margin-top: 10px;
      }
    }
  }
}
.dialog_col {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  > p {
    width: 100px;
    font-size: 14px;
  }
  .sel_item {
    // width: 100%;
    flex: 1;
  }
}
</style>
