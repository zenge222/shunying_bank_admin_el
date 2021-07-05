<template>
  <div>
    <div class="common-container">
      <breadcrumb id="breadcrumb-container" class="breadcrumb-container" />
      <div class="top_head">
        <div class="inputs">
          <div class="input_group">
            <p>编号</p>
            <el-input
              class="text_input"
              size="medium"
              v-model="fromParams.no"
              placeholder="请输入编号"
            ></el-input>
          </div>
          <div class="input_group">
            <p>设备名称</p>
            <el-input
              class="text_input"
              size="medium"
              v-model="fromParams.name"
              placeholder="请输入设备名称"
            ></el-input>
          </div>
          <div class="input_group">
            <p>项目</p>
            <el-input
              class="text_input"
              size="medium"
              v-model="fromParams.projectName"
              placeholder="请输入项目"
            ></el-input>
          </div>
          <div class="input_group">
            <p>网点</p>
            <el-input
              class="text_input"
              size="medium"
              v-model="fromParams.orgBranchName"
              placeholder="请输入网点"
            ></el-input>
          </div>
        </div>
      </div>
      <div class="top_head top_head2">
        <div class="inputs">
          <div class="input_group">
            <p>报修人</p>
            <el-input
              class="text_input"
              size="medium"
              v-model="fromParams.repairEmployeeName"
              placeholder="请输入报修人"
            ></el-input>
          </div>
          <div class="input_group">
            <p>状态</p>
            <el-select
              class="text_input"
              v-model="fromParams.status"
              placeholder="请选择状态"
              clearable
            >
              <el-option
                v-for="item in statusList"
                :key="item.id"
                :label="item.value"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </div>
          <div class="input_group">
            <p>报废时间</p>
            <el-date-picker
              v-model="dates"
              @change="dateChange"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            >
            </el-date-picker>
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
        <h3>设备报废列表</h3>
      </div>
      <div class="table_padding">
        <el-table
          :header-cell-style="{ background: '#F3F4F7', color: '#333333' }"
          :data="listData"
          border
          style="width: 100%"
        >
          <el-table-column :width="60" align="center" label="id">
            <template slot-scope="{ $index }">
              <span v-text="$index + 1"></span>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="equipmentNo" label="设备编号">
          </el-table-column>
          <el-table-column align="center" prop="equipmentName" label="设备名称">
          </el-table-column>
          <el-table-column align="center" prop="projectName" label="项目">
          </el-table-column>
          <el-table-column
            align="center"
            prop="organizationBranchName"
            label="网点"
          >
          </el-table-column>
          <el-table-column
            align="center"
            prop="repairEmployeeName"
            label="维修员"
          >
          </el-table-column>
          <el-table-column align="center" prop="createTime" label="提交时间">
          </el-table-column>
          <el-table-column align="center" label="状态">
            <template slot-scope="{ row }">
              {{
                row.status == 1
                  ? "待审核"
                  : row.status == 2
                  ? "未通过"
                  : "已通过"
              }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作">
            <template slot-scope="{ row }">
              <el-button size="small" @click="editItem(row)">详情</el-button>
            </template>
          </el-table-column>
        </el-table>
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
      :visible.sync="detailShow"
      width="40%"
      center
      title="设备报废详情"
    >
      <el-row :gutter="24">
        <el-col :span="24" style="padding: 10px 0; text-indent: 12px">
          设备编号：{{ detailData.equipmentName }}
        </el-col>
        <el-col :span="24" style="padding: 10px 0; text-indent: 12px">
          设备名称：{{ detailData.equipmentName }}
        </el-col>
        <el-col :span="24" style="padding: 10px 0; text-indent: 12px">
          项目：{{ detailData.projectName }}
        </el-col>
        <el-col :span="24" style="padding: 10px 0; text-indent: 12px">
          网点：{{ detailData.organizationBranchName }}
        </el-col>
        <el-col :span="24" style="padding: 10px 0; text-indent: 12px">
          维修员：{{ detailData.repairEmployeeName }}
        </el-col>
        <el-col :span="24" style="padding: 10px 0; text-indent: 12px">
          提交时间：{{ detailData.createTime }}
        </el-col>
        <el-col :span="24" style="padding: 10px 0; text-indent: 12px">
          状态：
          {{
            detailData.status == 1
              ? "待审核"
              : detailData.status == 2
              ? "未通过"
              : "已通过"
          }}
        </el-col>
        <el-col :span="24" style="padding: 10px 0; text-indent: 12px">
          审核人：{{ detailData.checkName }}
        </el-col>
        <el-col :span="24" style="padding: 10px 0; text-indent: 12px">
          报废情况：
          <p
            style="
              margin: 20px 0 0 12px;
              font-size: 12px;
              text-indent: 0;
              line-height: 1.2;
            "
          >
            {{ detailData.content }}
          </p>
          <el-row :gutter="24">
            <el-col
              :span="6"
              style="padding: 10px 0"
              v-for="(item, index) in scrapApplicationImgs"
              :key="index"
            >
              <img width="100" :src="detailData.baseUrl + item"
            /></el-col>
          </el-row>
        </el-col>
      </el-row>

      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="detailShow = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import Breadcrumb from "@/components/Breadcrumb";
import Pagination from "@/components/Pagination";
import { _uploadPic } from "@/services/home";
import {
  _equipmentScrapRecordStatusList,
  _equipmentScrapRecordList,
} from "@/services/system";
export default {
  name: "EquipmentScrapping",
  data() {
    return {
      detailShow: false,
      fromParams: {
        name: "",
        no: "",
        startDateStr: "",
        endDateStr: "",
        orgBranchName: "",
        projectName: "",
        repairEmployeeName: "",
        status: "",
        pageNo: 1,
        pageSize: 10,
      },
      detailData: {},
      dates: [], // new Date(), new Date()
      total: 0,
      statusList: [],
      listData: [],
      scrapApplicationImgs: [],

      testVal: "",
      timeVal: "",
    };
  },
  components: {
    Breadcrumb,
    Pagination,
  },
  mounted() {
    this.getStatusList();
    this.getDataList();
  },
  methods: {
    // 状态列表
    getStatusList() {
      _equipmentScrapRecordStatusList().then((res) => {
        if (res.code == 1) {
          this.statusList = res.data;
        }
      });
    },
    getDataList() {
      _equipmentScrapRecordList(this.fromParams).then((res) => {
        if (res.code == 1) {
          this.listData = res.data.list;
          this.total = res.data.total;
          this.isLoading = false;
        } else {
          this.$message({ message: res.msg, type: "warning" });
        }
      });
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
    dateChange(e) {
      this.fromParams.startDateStr = e[0];
      this.fromParams.endDateStr = e[1];
    },
    editItem(item) {
      this.scrapApplicationImgs = [];
      this.scrapApplicationImgs = item.img.split(",");
      this.detailData = item;
      this.detailShow = true;
    },
    addDevice() {
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
          // this.fromParams.baseUrl = res.data.baseUrl;
          // this.fromParams.profile = res.data.key;
          // this.picture = false;
        } else {
          this.$message({ message: res.msg, type: "warning" });
          // this.picture = false;
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
  max-height: 500px;
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
</style>