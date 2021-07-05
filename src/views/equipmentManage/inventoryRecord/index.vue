<template>
  <div>
    <div class="common-container">
      <breadcrumb id="breadcrumb-container" class="breadcrumb-container" />
      <div class="top_head">
        <div class="inputs">
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
          <div class="input_group">
            <p>盘点人</p>
            <el-select v-model="fromParams.managerId">
              <el-option
                :label="item.name"
                :value="item.id"
                v-for="item in managerList"
                :key="item.id"
              ></el-option>
            </el-select>
          </div>
          <div class="input_group">
            <p>记录情况</p>
            <el-select v-model="fromParams.status">
              <el-option
                :label="item.value"
                :value="item.id"
                v-for="item in recordList"
                :key="item.id"
              ></el-option>
            </el-select>
          </div>
        </div>
      </div>
      <div class="top_head top_head2">
        <div class="inputs">
          <div class="input_group">
            <p>上传时间</p>
            <el-date-picker
              @change="dateChange"
              v-model="currentDate"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            >
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
        <h3>固定资产盘点记录</h3>
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
          <el-table-column align="center" prop="projectName" label="项目">
          </el-table-column>
          <el-table-column
            align="center"
            prop="organizationBranchName"
            label="网点"
          >
          </el-table-column>
          <el-table-column align="center" prop="managerName" label="盘点人">
          </el-table-column>
          <el-table-column align="center" prop="projectName" label="记录情况">
            <template slot-scope="{ row }">
              {{ row.status == 1 ? "正常" : "异常" }}
            </template>
          </el-table-column>
          <el-table-column align="center" prop="createTime" label="上传时间">
          </el-table-column>
          <el-table-column align="center" label="操作">
            <template slot-scope="{ row }">
              <el-button size="small" @click="checkItem(row)">详情</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <pagination
        style="text-align: right"
        v-show="1 > 0"
        :total="10"
        :limit="1"
        :page="1"
      />
    </div>
    <el-dialog
      custom-class="dialog_min_width"
      title="固定资产盘点详情"
      :lock-scroll="false"
      :visible.sync="visible"
      :close-on-click-modal="false"
      width="70%"
      center
    >
      <div class="pop_content">
        <p>项目名称：{{ detailData.projectName }}</p>
        <p>网点：{{ detailData.organizationBranchName }}</p>
        <p>盘点人：{{ detailData.managerName }}</p>
        <p>盘点日期：{{ detailData.createTime }}</p>
        <p>上传时间：{{ detailData.createTime }}</p>
        <h3>固定资产</h3>
        <el-table
          :header-cell-style="{ background: '#F3F4F7', color: '#333333' }"
          :data="detailData.itemVOList"
          border
          style="width: 100%"
        >
          <el-table-column :width="60" align="center" label="id">
            <template slot-scope="{ $index }">
              <span v-text="$index + 1"></span>
            </template>
          </el-table-column>
          <el-table-column prop="equipmentNo" align="center" label="编号">
          </el-table-column>
          <el-table-column align="equipmentType" prop="" label="类别">
            <template slot-scope="{ row }">
              {{ row.equipmentType == 1 ? "电子设备" : "" }}
            </template>
          </el-table-column>
          <el-table-column align="equipmentName" prop="" label="物品名称">
          </el-table-column>
          <el-table-column align="equipmentSku" prop="" label="规格/型号">
          </el-table-column>
          <el-table-column align="equipmentDutyPerson" prop="" label="负责人">
          </el-table-column>
          <el-table-column align="equipmentBuyDate" prop="" label="购置日期">
          </el-table-column>
          <el-table-column align="center" prop="status" label="是否盘点">
            <template slot-scope="{ row }">
              <p :style="{ color: row.status == 1 ? '#67C23A' : '#F56C6C' }">
                {{ row.status == 1 ? "已盘点" : "未盘点" }}
              </p>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="medium" type="primary" @click="visible = false"
          >确定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>
<script>
import Breadcrumb from "@/components/Breadcrumb";
import Pagination from "@/components/Pagination";
import {
  _areaManagerList,
  _propertyCheckRecordList,
  _checkRecordList,
  _checkRecordDetail,
} from "@/services/system";
export default {
  name: "InventoryRecord",
  data() {
    return {
      visible: false,
      listData: [],
      managerList: [],
      recordList: [],
      currentDate: [],
      fromParams: {
        startDateStr: "",
        endDateStr: "",
        orgBranchName: "",
        projectName: "",
        status: "",
        managerId: "",
        pageNo: 1,
        pageSize: 10,
      },
      detailData: {
        id: "",
        organizationBranchName: "",
        projectName: "",
        managerName: "",
        status: "",
        createTime: "",
        itemVOList: [],
      },
    };
  },
  components: {
    Breadcrumb,
    Pagination,
  },
  mounted() {
    this.getAreaManagerList();
    this.getRecordList();
    this.getDataList();
  },
  methods: {
    getAreaManagerList() {
      _areaManagerList().then((res) => {
        if (res.code == 1) {
          // this.managerList = [
          //   {
          //     id: 0,
          //     name: "全部",
          //   },
          // ];
          this.managerList.push(...res.data);
        }
      });
    },
    getRecordList() {
      _propertyCheckRecordList().then((res) => {
        if (res.code == 1) {
          // this.recordList = [
          //   {
          //     id: 0,
          //     value: "全部",
          //   },
          // ];
          this.recordList.push(...res.data);
        }
      });
    },
    getDataList() {
      _checkRecordList(this.fromParams).then((res) => {
        if (res.code == 1) {
          this.listData = res.data.list;
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    searchList() {
      this.fromParams.pageNo = 1;
      this.getDataList();
    },
    dateChange(e) {
      this.fromParams.startDateStr = e[0];
      this.fromParams.endDateStr = e[1];
    },
    checkItem(item) {
      _checkRecordDetail(item.id).then((res) => {
        if (res.code == 1) {
          this.detailData = res.data;
          this.visible = true;
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
</style>