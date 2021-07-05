<template>
  <div class="common-container">
    <breadcrumb id="breadcrumb-container" class="breadcrumb-container" />
    <div class="basics">
      <div class="input_group margin-btm-18">
        <div class="detail_from_info">
          <p><span>*</span>员工姓名</p>
          <el-input
            class="text_input"
            size="medium"
            v-model="dataParams.name"
            placeholder="请输入内容"
          ></el-input>
        </div>
        <div class="detail_from_info">
          <p><span>*</span>手机号</p>
          <el-input
            class="text_input"
            size="medium"
            v-model="dataParams.phone"
            placeholder="请输入内容"
          ></el-input>
        </div>
      </div>
      <div class="input_group margin-btm-18">
        <div class="detail_from_info">
          <p>员工身份</p>
          <div>
            <el-radio
              v-for="(item, index) in identityList"
              :key="index"
              v-model="dataParams.type"
              :label="item.id"
              >{{ item.value }}</el-radio
            >
          </div>
        </div>
      </div>
      <div class="input_group margin-btm-18" v-show="dataParams.type != 8">
        <div class="detail_from_info">
          <p><span>*</span>负责区域</p>
          <el-select
            class="text_sel"
            size="medium"
            @change="areaChange"
            v-model="dataParams.areaId"
            placeholder="请选择区域"
          >
            <el-option
              v-for="item in areaList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
               :disabled="item.disabled"
            >
            </el-option>
          </el-select>
          <div v-show="branchList.length != 0">
            <el-select
              v-if="
                dataParams.areaId != '' &&
                dataParams.areaId != null &&
                dataParams.type == 1
              "
              class="text_sel"
              size="medium"
              v-model="dataParams.organizationBranchId"
              placeholder="请选择网点"
            >
              <el-option
                v-for="item in branchList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </div>
        </div>
      </div>
      <div class="input_group margin-btm-18">
        <div class="detail_from_info" style="align-items: flex-start">
          <p>头像</p>
          <el-upload
            class="avatar-uploader"
            action="#"
            :show-file-list="false"
            :before-upload="handleBeforeUpload"
          >
            <img
              v-if="dataParams.profile"
              :src="dataParams.baseUrl + dataParams.profile"
              class="avatar"
            />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </div>
      </div>
    </div>
    <div class="project">
      <div class="table_container1">
        <el-button
          class="submit_btn"
          @click="submitDetail"
          size="medium"
          type="primary"
          >提交</el-button
        >
      </div>
    </div>
  </div>
</template>
<script>
import Breadcrumb from "@/components/Breadcrumb";
import {
  _getIdentityList,
  _getorgEmployeeAreaList,
  _getorgEmployeeOrgBranchList,
  _uploadPic,
  _orgEmployeeAdd,
  _orgEmployeeDetail,
  _orgEmployeeEdit,
} from "@/services/home";
import { mapState } from "vuex";
export default {
  name: "MechanismDetail",
  data() {
    return {
      isEdit: false,
      dataParams: {
        baseUrl: "",
        areaId: "",
        areaName: "",
        id: 0,
        name: "",
        organizationBranchId: "",
        organizationBranchName: "",
        phone: "",
        profile: "",
        projectId: 0,
        type: 0,
      },
      identityList: [],
      areaList: [],
      branchList: [],
    };
  },
  components: {
    Breadcrumb,
  },
  computed: {
    ...mapState({
      projectId: (state) => state.projectInfo.projectId,
    }),
  },
  mounted() {
    this.dataParams.projectId = this.projectId;
    this.getIdentityList();
    this.geAreaList();
    this.isEdit = this.$route.params.isEdit;
    // 修改进入
    if (this.isEdit) {
      _orgEmployeeDetail(this.$route.params.id).then((res) => {
        this.dataParams.baseUrl = res.data.baseUrl;
        this.dataParams.areaId = res.data.areaId;
        this.dataParams.areaName = res.data.areaName;
        this.dataParams.id = res.data.id;
        this.dataParams.name = res.data.name;
        this.dataParams.organizationBranchId = res.data.organizationBranchId;
        this.dataParams.organizationBranchName =
          res.data.organizationBranchName;
        this.dataParams.phone = res.data.phone;
        this.dataParams.profile = res.data.profile;
        this.dataParams.type = res.data.type;
        if (
          this.dataParams.areaName != "" &&
          this.dataParams.areaName != null
        ) {
          this.geBranchList(this.dataParams.areaId);
        }
      });
    }
  },
  methods: {
    getIdentityList() {
      _getIdentityList().then((res) => {
        this.identityList = res.data;
      });
    },
    geAreaList() {
      _getorgEmployeeAreaList(this.projectId).then((res) => {
        this.areaList = res.data;
        // res.data.forEach((val, index) => {
        //   if (val.deleteFlag == 2) {
        //     this.areaList[index].disabled = true;
        //   }
        // });
      });
    },
    geBranchList(id) {
      _getorgEmployeeOrgBranchList(id).then((res) => {
        this.branchList = res.data;
        console.log(this.branchList);
      });
    },
    areaChange(val) {
      this.geBranchList(val);
    },
    handleBeforeUpload(file) {
      if (
        !(
          file.type === "image/png" ||
          file.type === "image/jpg" ||
          file.type === "image/jpeg"
        )
      ) {
        this.$message({
          message: "请上传格式为image/png, image/jpg, image/jpeg的图片",
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
          this.dataParams.baseUrl = res.data.baseUrl;
          this.dataParams.profile = res.data.key;
        } else {
          this.$message({ message: res.msg, type: "warning" });
        }
      });
    },
    submitDetail() {
      let phoneReg = /^((13|14|15|17|18)[0-9]{1}\d{8})$/;
      if (this.dataParams.name == "")
        return this.$message({ type: "warning", message: "请输入员工姓名" });
      if (this.dataParams.phone == "" || !phoneReg.test(this.dataParams.phone))
        return this.$message({
          type: "warning",
          message: "请输入正确的手机号",
        });
      if (this.dataParams.type != 8) {
        if (this.dataParams.areaId == "")
          return this.$message({ type: "warning", message: "请选择区域" });
      }
      if (this.dataParams.type == 1) {
        if (this.branchList.length > 0) {
          if (this.dataParams.organizationBranchId == "")
            return this.$message({ type: "warning", message: "请选择网点" });
        }
        // 网点名称
        this.branchList.forEach((val) => {
          if (val.id == this.dataParams.organizationBranchId) {
            this.dataParams.organizationBranchName = val.name;
            return;
          }
        });
      }
      // 区域名称
      this.areaList.forEach((val) => {
        if (val.id == this.dataParams.areaId) {
          this.dataParams.areaName = val.name;
          return;
        }
      });
      if (this.isEdit) {
        _orgEmployeeEdit(this.dataParams).then((res) => {
          if (res.code == 1) {
            this.$router.go(-1);
            this.$message({ message: "修改成功", type: "success" });
          } else {
            this.$message({ message: res.msg, type: "warning" });
          }
        });
        return;
      } else {
        _orgEmployeeAdd(this.dataParams).then((res) => {
          if (res.code == 1) {
            this.$router.go(-1);
            this.$message({ message: "添加成功", type: "success" });
          } else {
            this.$message({ message: res.msg, type: "warning" });
          }
        });
      }
    },
  },
};
</script>
<style lang="less">
.basics,
.project {
  padding: 0 0 0 6px;
  margin-bottom: 20px;
  > h3 {
    font-size: 14px;
    font-weight: bold;
    margin-bottom: 10px;
  }
}
.basics {
  margin-top: 20px;
  border-bottom: 1px solid #f2f2f2;
}
.project {
  .add_btn {
    margin: 10px 0;
  }
}
.input_group {
  // margin-bottom: 18px;
  display: flex;
  align-items: center;
  font-size: 12px;
  .count_input {
    width: 100px;
    margin: 0 10px;
  }
}
.submit_btn {
  margin: 20px 0;
}
.detail_from_info {
  margin-right: 80px;
  display: flex;
  align-items: center;
  .text_input {
    flex: 1;
  }
  > p {
    font-size: 14px;
    width: 100px;
    > span {
      color: #f56c6c;
      padding-right: 2px;
    }
  }
  .text_sel {
    width: 150px;
    margin-right: 20px;
  }
}
</style>