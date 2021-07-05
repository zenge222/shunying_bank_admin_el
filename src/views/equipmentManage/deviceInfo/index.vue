<template>
  <div>
    <div class="common-container">
      <breadcrumb id="breadcrumb-container" class="breadcrumb-container" />
      <div class="top_head">
        <div class="inputs">
          <div class="input_group">
            <p>设备名称</p>
            <el-input
              class="text_input"
              size="medium"
              v-model="fromParams.name"
              placeholder="请输入内容"
            ></el-input>
          </div>
          <div class="input_group">
            <p>类型</p>
            <el-select class="text_input" v-model="fromParams.type" clearable>
              <el-option
                :label="item.value"
                :value="item.id"
                v-for="item in typeList"
                :key="item.id"
              ></el-option>
            </el-select>
          </div>
          <div class="input_group">
            <p>项目</p>
            <el-input
              class="text_input"
              size="medium"
              v-model="fromParams.projectName"
              placeholder="请输入内容"
            ></el-input>
          </div>
          <div class="input_group">
            <p>网点</p>
            <el-input
              class="text_input"
              size="medium"
              v-model="fromParams.orgBranchName"
              placeholder="请输入内容"
            ></el-input>
          </div>
        </div>
      </div>
      <div class="top_head top_head2">
        <div class="inputs">
          <div class="input_group">
            <p>负责人</p>
            <el-select
              class="text_input"
              v-model="fromParams.dutyPersonId"
              clearable
            >
              <el-option
                :label="item.name"
                :value="item.id"
                v-for="item in dutyList"
                :key="item.id"
              ></el-option>
            </el-select>
          </div>
          <div class="input_group">
            <p>状态</p>
            <el-select class="text_input" v-model="fromParams.status" clearable>
              <!-- <el-option label="全部" :value="0"></el-option> -->
              <el-option
                :label="item.value"
                :value="item.id"
                v-for="item in statusList"
                :key="item.id"
              ></el-option>
            </el-select>
          </div>
          <div class="input_group">
            <p>编号</p>
            <el-input
              class="text_input"
              size="medium"
              v-model="fromParams.no"
              oninput="value=value.replace(/[^\d]/g,'')"
              placeholder="请输入内容"
            ></el-input>
          </div>
        </div>
        <el-button
          @click="searchList"
          size="medium"
          type="primary"
          icon="el-icon-search"
          >搜索</el-button
        >
      </div>
    </div>
    <div class="table_container">
      <div class="table_head">
        <h3>设备信息列表</h3>
        <div class="table_top_btns">
          <el-button
            :disabled="multipleSelection.length == 0"
            @click="downloadQcode"
            size="medium"
            type="success"
            >二维码导出</el-button
          >
          <download-excel
            :data="list"
            :fields="json_fields"
            class="export-excel-wrapper"
            name="物料单.xls"
          >
            <el-button
              size="medium"
              type="warning"
              @click="exportList"
              v-text="'表单模板'"
            ></el-button>
          </download-excel>
          <div class="pload_div">
            <el-button size="medium" type="info">表单导入</el-button>
            <input
              class="outputlist_upload"
              type="file"
              ref="inputer"
              @change="importf(this)"
              accept=".xls, .xlsx"
            />
          </div>

          <el-button size="medium" @click="addDevice" type="primary"
            >新增设备</el-button
          >
        </div>
      </div>
      <div class="table_padding">
        <el-table
          ref="multipleTable"
          tooltip-effect="dark"
          @selection-change="handleSelectionChange"
          :header-cell-style="{ background: '#F3F4F7', color: '#333333' }"
          :data="listData"
          border
          style="width: 100%"
        >
          <el-table-column align="center" type="selection"> </el-table-column>
          <el-table-column :width="60" align="center" label="id">
            <template slot-scope="{ $index }">
              <span v-text="$index + 1"></span>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="no" label="编号">
          </el-table-column>
          <el-table-column align="center" prop="name" label="设备名称">
          </el-table-column>
          <el-table-column align="center" prop="type" label="类型">
            <template slot-scope="{ row }">
              {{
                row.type == 1
                  ? "电子设备"
                  : row.type == 2
                  ? "办公家具类"
                  : row.type == 3
                  ? "电气设备类"
                  : row.type == 4
                  ? "机械设备类"
                  : row.type == 5
                  ? "交通运输类"
                  : "其他"
              }}
            </template>
          </el-table-column>
          <el-table-column align="center" prop="projectName" label="项目">
          </el-table-column>
          <el-table-column
            align="center"
            prop="organizationBranchName"
            label="网点"
          >
          </el-table-column>
          <el-table-column align="center" prop="dutyPerson" label="负责人">
          </el-table-column>
          <el-table-column align="center" prop="status" label="状态">
            <template slot-scope="{ row }">
              {{ row.status == 1 ? "使用中" : "已报废" }}
            </template>
          </el-table-column>
          <el-table-column width="260" align="center" label="操作">
            <template slot-scope="{ row }">
              <el-button size="small" @click="editItem(row)">修改</el-button>
              <el-button @click="delItem(row)" type="danger" size="small"
                >删除</el-button
              >
              <el-button
                @click="toEquipmentRepair(row.no)"
                type="warning"
                size="small"
                >检修记录</el-button
              >
              <!-- <el-button
                type="success"
                @click="downloadQcodeItem(row)"
                size="small"
                >二维码导出</el-button
              > -->
            </template>
          </el-table-column>
        </el-table>
        <QrCode
          :qrCodeData="multipleSelection"
          @closeDownload="closeDownload"
          zipName="打包"
          v-if="downloadLoading"
        />
      </div>
      <pagination
        style="text-align: right"
        v-show="total > 0"
        :total="total"
        :limit="fromParams.pageSize"
        :page="fromParams.pageNo"
        @pagination="resetData"
      />
    </div>
    <!-- 详情 -->
    <el-dialog
      custom-class="dialog_min_width"
      :title="isAdd ? '新增设备' : '修改设备'"
      :lock-scroll="false"
      :visible.sync="detailShow"
      :close-on-click-modal="false"
      width="50%"
      center
    >
      <div class="pop_content">
        <div class="pop_item">
          <p><span v-if="isAdd">*</span>编号</p>
          <!--     readonly="true" -->
          <el-input
            class="pop_input"
            v-model="fromDetail.no"
            size="medium"
            placeholder="请输入编号"
          ></el-input>
        </div>
        <div class="pop_item">
          <p><span>*</span>名称</p>
          <el-input
            class="pop_input"
            v-model="fromDetail.name"
            size="medium"
            placeholder="请输入名称"
          ></el-input>
        </div>
        <div class="pop_item">
          <p><span>*</span>类型</p>
          <el-select class="text_input" v-model="fromDetail.type">
            <el-option
              :label="item.value"
              :value="item.id"
              v-for="item in typeList"
              :key="item.id"
            ></el-option>
          </el-select>
        </div>
        <div class="pop_item">
          <p><span>*</span>规格</p>
          <el-input
            class="pop_input"
            v-model="fromDetail.sku"
            size="medium"
            placeholder="请输入规格"
          ></el-input>
        </div>
        <div class="pop_item">
          <p><span>*</span>负责人</p>
          <el-select class="text_input" v-model="fromDetail.dutyPersonId">
            <el-option
              :label="item.name"
              :value="item.id"
              v-for="item in dutyList"
              :key="item.id"
            ></el-option>
          </el-select>
        </div>
        <!-- :before-upload="handleBeforeUpload" -->
        <div class="pop_item pop_item2">
          <p><span>*</span>图片</p>
          <el-upload
            class="avatar-uploader"
            action="#"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="handleBeforeUpload"
          >
            <img
              v-if="fromDetail.img"
              :src="fromDetail.baseUrl + fromDetail.img"
              class="avatar"
            />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </div>
        <div class="pop_item">
          <p><span>*</span>厂家</p>
          <el-input
            class="pop_input"
            v-model="fromDetail.businessName"
            size="medium"
            placeholder="请输入厂家"
          ></el-input>
        </div>
        <div class="pop_item">
          <p><span>*</span>厂家电话</p>
          <el-input
            class="pop_input"
            v-model="fromDetail.businessContactPhone"
            size="medium"
            placeholder="请输入厂家电话"
          ></el-input>
        </div>
        <div class="sel_group">
          <div class="pop_item">
            <p><span>*</span>设备位置</p>
            <el-select
              class="text_input"
              placeholder="请选择项目"
              v-model="fromDetail.projectId"
              @change="selProject"
            >
              <el-option
                :label="item.name"
                :value="item.id"
                v-for="item in projectList"
                :key="item.id"
              ></el-option>
            </el-select>
            <el-select
              v-show="fromDetail.projectId"
              style="margin-left: 20px"
              class="text_input"
              placeholder="请选择网点"
              v-model="fromDetail.organizationBranchId"
            >
              <el-option
                :label="item.name"
                :value="item.id"
                v-for="item in branchList"
                :key="item.id"
              ></el-option>
            </el-select>
          </div>
        </div>
        <div class="pop_item">
          <p><span>*</span>检修周期</p>
          <el-input
            class="pop_input"
            v-model="fromDetail.checkCycle"
            size="medium"
            placeholder="请输入检修周期"
          ></el-input>
        </div>
        <div class="pop_item">
          <p><span>*</span>购买日期</p>
          <el-date-picker
            v-model="fromDetail.buyDate"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="选择日期"
          >
          </el-date-picker>
        </div>
        <div class="pop_item">
          <p><span>*</span>保质期</p>
          <el-date-picker
            v-model="fromDetail.qualityDate"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="选择日期"
          >
          </el-date-picker>
        </div>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button
          @click="submitDetail"
          size="medium"
          type="primary"
          v-text="'确定'"
        ></el-button>
        <el-button
          size="medium"
          @click="detailShow = false"
          v-text="'取消'"
        ></el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import Breadcrumb from "@/components/Breadcrumb";
import Pagination from "@/components/Pagination";
import { _uploadPic } from "@/services/home";
import QrCode from "@/components/QRcode/index";
import {
  _equipmentTypeList,
  _dutyPersonList,
  _equipmentStatusList,
  _equipmentList,
  _belongProject,
  _orgBranchList,
  _equipmentAddEdit,
  _equipmentDel,
} from "@/services/system";
export default {
  name: "deviceInfo",
  data() {
    return {
      detailShow: false,
      isAdd: true,
      downloadLoading: false,
      multipleSelection: [],
      typeList: [],
      dutyList: [],
      statusList: [],
      projectList: [],
      branchList: [],
      list: [],
      json_fields: {
        编号: "no",
        名称: "name",
        // 类型: "typeStr",
        规格: "sku",
        // 负责人: "dutyPerson",
        厂商名称: "businessName",
        厂商联系电话: "businessContactPhone",
        // 项目名称: "projectName",
        // 网点名称: "organizationBranchName",
        检修周期: "checkCycle",
        购买日期: "buyDate",
        质保期: "qualityDate",
      },
      fromParams: {
        type: "",
        status: "",
        projectName: "",
        orgBranchName: "",
        name: "",
        dutyPersonId: "",
        no: "",
        pageNo: 1,
        pageSize: 10,
      },
      listData: [],
      total: 0,
      fromDetail: {
        address: "",
        businessContactPhone: "",
        businessName: "",
        buyDate: "",
        checkCycle: "",
        dutyPersonId: "",
        id: "",
        baseUrl: "",
        img: "",
        name: "",
        no: "",
        organizationBranchId: "",
        projectId: "",
        qualityDate: "",
        sku: "",
        type: "",
      },

      accountList: [],

      testVal: "",
      selList: [],
      timeVal: "",
    };
  },
  components: {
    Breadcrumb,
    Pagination,
    QrCode,
  },
  mounted() {
    this.getTypeList();
    this.getDutyList();
    this.getStatusList();
    this.getProjectList();
    this.getDataList();
  },

  methods: {
    // 类型列表
    getTypeList() {
      _equipmentTypeList().then((res) => {
        if (res.code == 1) {
          this.typeList = res.data;
        }
      });
    },
    // 负责人列表
    getDutyList() {
      _dutyPersonList().then((res) => {
        if (res.code == 1) {
          this.dutyList = res.data;
        }
      });
    },
    // 状态列表
    getStatusList() {
      _equipmentStatusList().then((res) => {
        if (res.code == 1) {
          this.statusList = res.data;
        }
      });
    },
    getDataList() {
      _equipmentList(this.fromParams).then((res) => {
        if (res.code == 1) {
          let resData = res.data.list;
          resData.forEach((val) => {
            val.statusStr = val.status == 1 ? "使用中" : "已报废";
            val.typeStr = val.type == 1 ? "电子设备" : "";
          });
          this.listData = res.data.list;
          this.total = res.data.total;
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    // 项目列表
    getProjectList() {
      _belongProject().then((res) => {
        if (res.code == 1) {
          this.projectList = res.data;
        }
      });
    },
    // 网点列表
    getOrgBranchList(id) {
      _orgBranchList(id).then((res) => {
        if (res.code == 1) {
          this.branchList = res.data;
        }
      });
    },
    selProject(val) {
      console.log(val);
      this.getOrgBranchList(val);
    },
    initDetailParams() {
      let data = {
        address: "",
        businessContactPhone: "",
        businessName: "",
        buyDate: "",
        checkCycle: "",
        dutyPersonId: "",
        id: "",
        baseUrl: "",
        img: "",
        name: "",
        no: "",
        organizationBranchId: "",
        projectId: "",
        qualityDate: "",
        sku: "",
        type: "",
      };
      this.fromDetail = Object.assign({}, data);
    },
    searchList() {
      this.fromParams.pageNo = 1;
      this.getDataList();
    },
    resetData(current) {
      this.fromParams.pageSize = current.limit;
      this.fromParams.pageNo = current.page;
      this.getDataList();
    },
    editItem(item) {
      this.isAdd = false;
      this.detailShow = true;
      if (item.projectId && item.projectId != "") {
        this.getOrgBranchList(item.projectId);
      }
      this.fromDetail = item;
      console.log(item);
    },
    delItem(row, index) {
      this.$confirm("确定删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "",
      })
        .then(() => {
          // console.log(row)
          _equipmentDel(row.id).then((res) => {
            // console.log(res)
            if (res.code == 1) {
              this.$message({
                type: "success",
                message: "删除成功!",
              });
              if (this.fromParams.pageNo > 1 && this.listData.length == 1) {
                this.fromParams.pageNo--;
              }
              this.getDataList();
            }
          });
        })
        .catch(() => {});
    },
    exportList() {
      // this.list = this.multipleSelection;
      this.list = [{ buyDate: "1990-01-01", qualityDate: "1990-01-01" }];
    },
    importf(obj) {
      this.accountList = [];
      let _this = this;
      let inputDOM = this.$refs.inputer; // 通过DOM取文件数据
      // this.file = event.currentTarget.files[0];
      let file = inputDOM.files[0];
      if (!file) return;
      var rABS = false; //是否将文件读取为二进制字符串
      var f = file;
      var reader = new FileReader(); //if (!FileReader.prototype.readAsBinaryString) {
      FileReader.prototype.readAsBinaryString = function (f) {
        var binary = "";
        var rABS = false; //是否将文件读取为二进制字符串
        var pt = this;
        var wb; //读取完成的数据
        var outdata;
        var reader = new FileReader();
        reader.onload = function (e) {
          var bytes = new Uint8Array(reader.result);
          var length = bytes.byteLength;
          for (var i = 0; i < length; i++) {
            binary += String.fromCharCode(bytes[i]);
          }
          var XLSX = require("xlsx");
          if (rABS) {
            wb = XLSX.read(btoa(fixdata(binary)), {
              //手动转化
              type: "base64",
            });
          } else {
            wb = XLSX.read(binary, {
              type: "binary",
            });
          } // outdata就是你想要的东西 excel导入的数据
          outdata = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]); // excel 数据再处理
          _this.handleFormData(outdata).then((arr) => {
            console.log(arr);
            // _this.accountList = [...arr];
            // 重置change事件
            _this.$refs.inputer.value = null;
            // console.log(_this.accountList);
            _equipmentAddEdit(arr).then((res) => {
              if (res.code == 1) {
                _this.getDataList();
                _this.$message.success(res.msg);
              } else {
                _this.$message.error(res.msg);
              }
            });
          });
        };
        reader.readAsArrayBuffer(f);
      };
      if (rABS) {
        reader.readAsArrayBuffer(f);
      } else {
        reader.readAsBinaryString(f);
      }
    },
    toEquipmentRepair(no) {
      console.log(no);
      let params = {
        no: no,
      };
      this.pushTo("EquipmentRepair", params);
    },
    addDevice() {
      this.initDetailParams();
      this.detailShow = true;
    },
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
    },
    handleBeforeUpload(file) {
      this.picture = true;
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
          console.log(res);
          this.fromDetail.baseUrl = res.data.baseUrl;
          this.fromDetail.img = res.data.key;
          this.picture = false;
        } else {
          this.$message({ message: res.msg, type: "warning" });
          this.picture = false;
        }
      });
    },
    closeDownload() {
      this.downloadLoading = false;
    },
    downloadQcode() {
      this.downloadLoading = true;
    },
    handleSelectionChange(val) {
      // val.forEach((e, i) => {
      //   val[i].qid = `${e.name}`; //二维码图片名称标识
      //   val[i].url = `https://www.baidu.com/s?wd=${e.address}`; //二维码文本内容
      // });

      val.forEach((e, i) => {
        val[i].qid = `${e.no}-${e.name}`; //二维码图片名称标识
        // val[i].url = `https://www.baidu.com/s?wd=${e.name}`; //二维码文本内容
        // val[i].url = JSON.stringify(e); //二维码文本内容
        val[i].url = `${e.id}`;
      });
      this.multipleSelection = val;
    },
    // 处理导入数据
    handleFormData(arr) {
      return new Promise((resolve) => {
        let resArr = [];
        for (let i = 0; i < arr.length; i++) {
          let obj = {};
          if (!arr[i].编号 || !arr[i].编号.toString().trim()) {
            this.$message.error(`第${i + 1}条编号出现错误`);
            return [];
          }
          obj.no = arr[i].编号;
          if (!arr[i].名称 || !arr[i].名称.toString().trim()) {
            this.$message.error(`第${i + 1}条名称出现错误`);
            return [];
          }
          obj.name = arr[i].名称;
          // if (!arr[i].类型 || !arr[i].类型.toString().trim()) {
          //   this.$message.error(`第${i + 1}条类型出现错误`);
          //   return [];
          // }
          // let resType = this.typeList.find((val) => {
          //   if (val.value == arr[i].类型) {
          //     obj.type = val.id;
          //     obj.typeStr = arr[i].类型;
          //     return true;
          //   }
          // });
          // if (!resType) {
          //   this.$message.error(`第${i + 1}条出现错误 无此类型`);
          //   return [];
          // }

          // if (!arr[i].规格 || !arr[i].规格.toString().trim()) {
          //   this.$message.error(`第${i + 1}条规格出现错误`);
          //   return [];
          // }
          obj.sku = arr[i].规格;
          // if (!arr[i].负责人 || !arr[i].负责人.toString().trim()) {
          //   this.$message.error(`第${i + 1}条负责人出现错误`);
          //   return [];
          // }
          // let resDuty = this.dutyList.find((val) => {
          //   if (val.name == arr[i].负责人) {
          //     obj.dutyPersonId = val.id;
          //     obj.dutyPerson = arr[i].负责人;
          //     return true;
          //   }
          // });
          // if (!resDuty) {
          //   this.$message.error(`第${i + 1}条出现错误 无此负责人`);
          //   return [];
          // }

          // if (!arr[i].厂商名称 || !arr[i].厂商名称.toString().trim()) {
          //   this.$message.error(`第${i + 1}条厂商名称出现错误`);
          //   return [];
          // }
          obj.businessName = arr[i].厂商名称;

          // if (!arr[i].厂商联系电话 || !arr[i].厂商联系电话.toString().trim()) {
          //   this.$message.error(`第${i + 1}条厂商联系电话出现错误`);
          //   return [];
          // }
          obj.businessContactPhone = arr[i].厂商联系电话;
          // if (!arr[i].项目名称 || !arr[i].项目名称.toString().trim()) {
          //   this.$message.error(`第${i + 1}条项目名称出现错误`);
          //   return [];
          // }
          // let resProject = this.projectList.find((val) => {
          //   if (val.name == arr[i].项目名称) {
          //     obj.projectId = val.id;
          //     obj.projectName = arr[i].项目名称;
          //     return true;
          //   }
          // });
          // if (!resProject) {
          //   this.$message.error(`第${i + 1}条出现错误 无此项目名称`);
          //   return [];
          // }
          // _orgBranchList(obj.projectId).then((res) => {
          //   if (res.code == 1) {
          //     if (!arr[i].网点名称 || !arr[i].网点名称.toString().trim()) {
          //       this.$message.error(`第${i + 1}条网点名称出现错误`);
          //       return [];
          //     }
          //     let resBranch = res.data.find((val) => {
          //       if (val.name == arr[i].网点名称) {
          //         obj.organizationBranchId = val.id;
          //         obj.organizationBranchName = arr[i].网点名称;
          //         obj.address = arr[i].项目名称 + arr[i].网点名称;
          //         return true;
          //       }
          //     });
          //     if (!resBranch) {
          //       this.$message.error(`第${i + 1}条出现错误 无此网点名称`);
          //       return [];
          //     }
          //   }

          // if (!arr[i].检修周期 || !arr[i].检修周期.toString().trim()) {
          //   this.$message.error(`第${i + 1}条检修周期错误`);
          //   return [];
          // }
          obj.checkCycle = arr[i].检修周期;

          let buyDate = this.exportDate(arr[i].购买日期);
          obj.buyDate =
            buyDate == "非法日期格式" ? "" : this.exportDate(arr[i].购买日期);

          let jiqDate = this.exportDate(arr[i].质保期);
          // if (jiqDate == "非法日期格式") {
          //   this.$message.error(`第${i + 1}条质保期错误`);
          //   return [];
          // }
          obj.qualityDate =
            jiqDate == "非法日期格式" ? "" : this.exportDate(arr[i].质保期);

          resArr.push(obj);
          resolve(resArr);
          // });
        }
      });
    },
    exportDate(numb) {
      function formatTime(date) {
        return year + "-" + month + "-" + day;
      }
      if (numb > 0) {
        //  先解析时间
        const time = new Date((numb - 1) * 24 * 3600000 + 1);
        let h = time.getHours() + 16;
        let yeraData = new Date(1900, 0, numb - 1);
        let year = yeraData.getFullYear();
        let month = yeraData.getMonth() + 1;
        month = month < 10 ? "0" + month : month;
        let day = yeraData.getDate();
        day = day < 10 ? "0" + day : day;

        if (h > 23) {
          h = h - 24;
        }
        let m =
          time.getMinutes() < 10 ? "0" + time.getMinutes() : time.getMinutes();
        let s =
          time.getSeconds() < 10 ? "0" + time.getSeconds() : time.getSeconds();
        return `${year}-${month}-${day}`;
      } else {
        // console.log(numb)
        return "非法日期格式";
      }
    },

    submitDetail() {
      if (this.fromDetail.no == "") return this.$message.warning("请输入编号");
      if (this.fromDetail.name == "")
        return this.$message.warning("请输入名称");
      if (this.fromDetail.type == "")
        return this.$message.warning("请选择类型");
      if (this.fromDetail.sku == "") return this.$message.warning("请输入规格");
      if (this.fromDetail.dutyPersonId == "")
        return this.$message.warning("请选择负责人");
      if (this.fromDetail.businessName == "")
        return this.$message.warning("请输入厂家");
      if (this.fromDetail.businessContactPhone == "")
        return this.$message.warning("请输入厂家电话");
      if (
        this.fromDetail.projectId == "" ||
        this.fromDetail.organizationBranchId == ""
      )
        return this.$message.warning("请选择设备位置");
      if (this.fromDetail.checkCycle == "")
        return this.$message.warning("请输入检修周期");
      if (this.fromDetail.buyDate == "")
        return this.$message.warning("请输入购买日期");
      if (this.fromDetail.qualityDate == "")
        return this.$message.warning("请输入保质期");
      this.dutyList.forEach((val) => {
        if (val.id == this.fromDetail.dutyPersonId) {
          this.fromDetail.dutyPerson = val.name;
        }
      });
      this.projectList.forEach((val) => {
        if (val.id == this.fromDetail.projectId) {
          this.fromDetail.projectName = val.name;
        }
      });
      this.branchList.forEach((val) => {
        if (val.id == this.fromDetail.organizationBranchId) {
          this.fromDetail.organizationBranchName = val.name;
          this.fromDetail.address = val.address;
        }
      });
      _equipmentAddEdit([this.fromDetail]).then((res) => {
        if (res.code == 1) {
          this.getDataList();
          this.detailShow = false;
          this.$message.success(res.msg);
        } else {
          this.$message.error(res.msg);
        }
      });
    },
  },
};
</script>
<style lang="less" scoped>
.top_head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 30px;

  .inputs {
    display: flex;
    align-items: center;
  }

  .input_group {
    display: flex;
    align-items: center;

    > p {
      text-align: right;
      width: 80px;
      font-size: 14px;
      margin-right: 20px;
    }

    .text_input {
      width: 130px;
    }
  }
}
.top_head2 {
  justify-content: space-between;
}
.table_container {
  border-radius: 6px;
  background: #ffffff;
  padding: 20px 0;
  margin: 20px;

  .table_head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #f2f2f2;
    padding: 0 20px 20px 20px;

    > h3 {
      font-size: 16px;
    }
  }
}
.table_padding {
  padding: 20px;
}

.pop_content {
  .pop_title {
    font-size: 14px;
    margin-bottom: 20px;
  }
  > p {
    font-size: 14px;
    padding-bottom: 12px;
  }
  > h3 {
    font-size: 14px;
    font-weight: bold;
    padding-bottom: 12px;
  }
}
.pop_content {
  max-height: 530px;
  overflow-y: scroll;

  .pop_title {
    font-size: 14px;
    margin-bottom: 20px;
  }
}
.pop_content::-webkit-scrollbar {
  display: none; // 重点
}

.user_head {
  width: 60px;
}
.pop_item {
  display: flex;
  align-items: center;
  padding-top: 20px;
  > p {
    width: 110px;
    font-size: 14px;
    padding-right: 20px;
    text-align: right;
    > span {
      color: #f56c6c;
      padding: 3px 4px 0 0;
      font-size: 14px;
    }
  }
  .pop_input {
    flex: 1;
  }
}
.pop_item2 {
  align-items: flex-start;
}
.sel_group {
  display: flex;
}
.export-excel-wrapper {
  display: inline-block;
  margin: 0 10px 0 10px;
}
.pload_div {
  display: inline-block;
  margin: 0 10px 0 10px;
  position: relative;
  .outputlist_upload {
    position: absolute;
    left: 0;
    top: 0;
    opacity: 0;
    height: 36px;
    width: 100px;
    cursor: pointer;
  }
}
</style>
