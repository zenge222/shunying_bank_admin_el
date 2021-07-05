<template>
  <div>
    <div class="common-container">
      <breadcrumb id="breadcrumb-container" class="breadcrumb-container" />
      <div class="top_head">
        <div class="inputs">
          <div class="input_group">
            <p>网点</p>
            <el-input
              class="text_input"
              size="medium"
              v-model="queryForm.orgBranchName"
              placeholder="请输入内容"
            ></el-input>
          </div>
          <div class="input_group">
            <p>主管</p>
            <el-input
              class="text_input"
              size="medium"
              v-model="queryForm.areaManagerName"
              placeholder="请输入内容"
            ></el-input>
          </div>
        </div>
        <el-button
          size="medium"
          type="primary"
          icon="el-icon-search"
          @click="init"
          >搜索</el-button
        >
      </div>
    </div>
    <div class="table_container">
      <div class="table_head">
        <h3>区域物料列表</h3>
        <!--                <el-date-picker-->
        <!--                    v-model="exportDate"-->
        <!--                    size="medium"-->
        <!--                    type="month"-->
        <!--                    value-format="yyyy-MM-dd"-->
        <!--                    placeholder="选择月"-->
        <!--                    @change="chooseMonth"-->
        <!--                >-->
        <!--                </el-date-picker>-->
        <el-select
          v-model="queryForm.toolsBatchId"
          placeholder="请选择批次"
          @change="changeBatch"
          clearable
        >
          <el-option
            v-for="item in batchList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </div>
      <div class="table_padding">
        <el-table
          :header-cell-style="{ background: '#F3F4F7', color: '#333333' }"
          :data="tableData"
          border
          style="width: 100%"
        >
          <el-table-column :width="60" align="center" label="id">
            <template slot-scope="{ $index }">
              <span v-text="$index + 1"></span>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="areaName" label="区域">
          </el-table-column>
          <el-table-column
            align="center"
            prop="areaManagerName"
            label="主管"
          >
          </el-table-column>
          <el-table-column align="center" prop="cost" label="申领物料金额">
          </el-table-column>
          <el-table-column align="center" prop="limitCost" label="配额成本金额">
          </el-table-column>
          <el-table-column align="center" prop="remainCost" label="剩余金额">
          </el-table-column>
          <el-table-column width="260" align="center" label="操作">
            <template slot-scope="{ row, $index }">
              <el-button
                type="success"
                @click="checkItem(row, $index)"
                size="mini"
                >明细
              </el-button>
              <el-button type="info" @click="accounting(row)" size="mini"
                >核算
              </el-button>
              <el-button
                type="warning"
                @click="exportMaterials(row)"
                size="mini"
                >物料单导出
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!--  :page.sync="formParams.page"
            :limit.sync="formParams.limit" -->
      <pagination
        style="text-align: right"
        v-show="total > 0"
        :total="total"
        :page="queryForm.pageNo"
        :limit="queryForm.pageSize"
        @pagination="resetData"
      />
    </div>
    <el-dialog
      custom-class="dialog_min_width"
      title="物料单导出"
      :lock-scroll="false"
      :visible.sync="exportShow"
      :close-on-click-modal="false"
      width="35%"
      center
    >
      <div class="pop_content">
        <div class="pop_item">
          <p>区域：{{ exportParams.areaName }}</p>
        </div>
        <div class="pop_item">
          <p>物料批次</p>
          <el-select
            v-model="exportParams.toolsBatchId"
            placeholder="请选择批次"
            @change="changeExportParams"
          >
            <el-option
              v-for="item in batchList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <download-excel
          :data="list"
          :fields="json_fields"
          class="export-excel-wrapper"
          name="物料单.xls"
        >
          <el-button
            size="medium"
            type="primary"
            @click="exportList2"
            v-text="'导出'"
          ></el-button>
        </download-excel>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import Breadcrumb from "@/components/Breadcrumb";
import Pagination from "@/components/Pagination";
import {
  getAreaMaterialList,
  getMaterialBatch,
  _exporToolsApplyList,
} from "@/services/person";

export default {
  name: "RegionDataList",
  data() {
    return {
      exportShow: false,
      list: [], //表格数据来源
      json_fields: {
        网点: "orgBranchName",
        保洁员: "cleanerName",
        联系电话: "phone",
        物料名称: "toolsName",
        数量: "quantity",
      },
      queryForm: {
        pageNo: 1,
        pageSize: 10,
        projectId: this.$store.state.projectInfo.projectId,
        areaManagerName: "",
        orgBranchName: "",
        toolsBatchId: "",
      },
      total: 0,
      tableData: [],
      batchList: [],
      exportParams: {
        toolsBatchId: "",
        id: "",
        areaName: "",
      },
    };
  },
  components: {
    Breadcrumb,
    Pagination,
  },
  created() {
    this.getBatch();
  },
  mounted() {
    // this.exportList();
  },
  methods: {
    init() {
      getAreaMaterialList(this.queryForm).then((res) => {
        if (res.code == 1) {
          // console.log(res)
          this.tableData = res.data.list;
          this.total = res.data.total;
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    getBatch() {
      getMaterialBatch({
        projectId: this.$store.state.projectInfo.projectId,
      }).then((res) => {
        if (res.code == 1) {
          // console.log(res)
          this.batchList = res.data;
          this.queryForm.toolsBatchId = this.exportParams.toolsBatchId = this.batchList[0].id;
          this.init();
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    checkItem() {
      this.pushTo("MaterialApplicationRecord");
    },
    resetData(current) {
      this.queryForm.pageSize = current.limit;
      this.queryForm.pageNo = current.page;
      this.init();
    },
    exportMaterials(item) {
      this.list = [];
      this.exportParams.id = item.id;
      this.exportParams.toolsBatchId = this.queryForm.toolsBatchId;
      this.exportParams.areaName = item.areaName;
      this.exportShow = true;
      this.exportList();
    },
    changeBatch(value) {
      this.queryForm.toolsBatchId = this.exportParams.toolsBatchId = value;
      this.init();
    },
    changeExportParams(value) {
      this.exportParams.toolsBatchId = value;
    },
    exportList() {
      _exporToolsApplyList(this.exportParams).then((res) => {
        if (res.code == 1) {
          this.list = res.data;
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    exportList2() {
      _exporToolsApplyList(this.exportParams).then((res) => {
        if (res.code == 1) {
          if (!res.data.length) return this.$message.warning("无数据导出");
          this.list = res.data;
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    accounting(row) {
      this.pushTo("AccountingRecord", row);
    },
  },
};
</script>
<style lang="less">
.export-excel-wrapper {
  display: inline-block;
  margin-left: 10px;
}
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
      width: 120px;
    }

    > span {
      padding: 0 10px;
      font-size: 14px;
    }
  }
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
  .detail_group {
    display: flex;
    align-items: center;

    .detail_logo {
      width: 80px;
      display: block;
      margin-right: 16px;
    }

    .detail_right {
      flex: 1;
    }
  }

  .time_group {
    display: flex;
    justify-content: space-between;
  }

  .title_hean {
    display: flex;
    justify-content: space-between;

    > h3 {
      color: #333333;
      font-size: 14px;
      font-weight: bold;
    }

    > p {
      font-size: 14px;
      color: #f56c6c;
    }
  }

  .pop_item {
    padding-top: 12px;
    display: flex;
    align-items: center;
    > p {
      padding-right: 12px;
      font-size: 14px;
    }
  }

  .detail_time {
    display: flex;
    justify-content: space-between;

    > p {
      padding-top: 12px;
    }
  }

  .image_title {
    display: flex;
    justify-content: space-between;
    margin: 20px 0 0 0;
    font-size: 14px;
  }
}

.detail_scored {
  .detail_col {
    margin-top: 20px;
  }

  .scored_item {
    display: flex;
    justify-content: space-between;

    > p {
      color: #f56c6c;
    }
  }
}

.dialog_min_width {
  min-width: 500px;
}

.detail_images {
  margin-top: 20px;

  img {
    width: 100%;
  }
}

.image_title {
  margin: 20px 0 0 0;
  font-size: 14px;
  padding: 12px 0 0 0;
  border-top: 1px solid #f2f2f2;
}

.top_content {
  padding: 0 0 20px 0;
}
</style>
