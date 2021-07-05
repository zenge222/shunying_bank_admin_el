<template>
  <div>
    <div class="common-container">
      <breadcrumb id="breadcrumb-container" class="breadcrumb-container" />
      <div class="top_head">
        <div class="inputs">
          <div class="input_group">
            <p>网点名称</p>
            <el-input
              class="text_input"
              size="medium"
              v-model="queryForm.orgBranchName"
              placeholder="请输入内容"
            ></el-input>
          </div>
          <div class="input_group">
            <p>申请人</p>
            <el-input
              class="text_input"
              size="medium"
              v-model="queryForm.applyName"
              placeholder="请输入内容"
            ></el-input>
          </div>
          <div class="input_group">
            <p>审核状态</p>
            <el-select
              class="text_input"
              size="medium"
              v-model="queryForm.status"
              placeholder="请选择"
            >
              <el-option
                class="text_input"
                v-for="item in status"
                :key="item.value"
                :label="item.value"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </div>
        </div>
        <el-button
          size="medium"
          type="primary"
          icon="el-icon-search"
          @click="search"
          >搜索</el-button
        >
      </div>
      <div class="top_head">
        <div class="input_group">
          <p>申请时间</p>
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
          </el-date-picker>
        </div>
      </div>
    </div>
    <div class="table_container">
      <div class="table_head">
        <h3>物料申请列表</h3>
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
          <el-table-column align="center" prop="cleanerName" label="申请人">
          </el-table-column>
          <el-table-column
            align="center"
            prop="organizationBranchName"
            label="网点"
          >
          </el-table-column>
          <el-table-column align="center" prop="areaName" label="区域">
          </el-table-column>
          <el-table-column align="center" prop="reason" label="理由">
          </el-table-column>
          <el-table-column align="center" prop="statusText" label="审核状态">
          </el-table-column>
          <el-table-column align="center" prop="createTime" label="申请时间">
          </el-table-column>
          <el-table-column align="center" label="操作">
            <template slot-scope="{ row, $index }">
              <el-button type="success" @click="check(row, $index)" size="mini"
                >查看
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
        :limit="queryForm.pageSize"
        :page="queryForm.pageNo"
        @pagination="getData"
      />
    </div>

    <el-dialog
      custom-class="dialog_min_width"
      title="详情"
      :lock-scroll="false"
      :visible.sync="addShow"
      :close-on-click-modal="false"
      width="35%"
    >
      <el-row>
        <el-col class="item_detail">
          申请人：{{ itemDetail.cleanerName }}
        </el-col>
        <el-col :span="24" class="item_detail">
          申请网点：{{ itemDetail.organizationBranchName }}
        </el-col>
        <el-col :span="24" class="item_detail">
          申请理由：{{ itemDetail.reason }}
        </el-col>
        <el-col :span="24" class="item_detail">
          状态：{{
            itemDetail.status == 1
              ? "待审批"
              : itemDetail.status == 2
              ? "已审批"
              : itemDetail.status == 3
              ? "已发放"
              : itemDetail.status == 4
              ? "已失效"
              : "未通过"
          }}
        </el-col>
        <el-col :span="24" class="item_detail"> 物料单： </el-col>
        <el-col :span="24" class="item_detail">
          <el-table
            :header-cell-style="{ background: '#F3F4F7', color: '#333333' }"
            :data="itemDetail.itemVOList"
            border
            style="width: 100%"
          >
            <el-table-column align="center" prop="toolsName" label="物料名称">
            </el-table-column>
            <el-table-column align="center" prop="quantity" label="申请数量">
            </el-table-column>
            <el-table-column
              align="center"
              prop="passQuantity"
              label="发放数量"
            >
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button size="medium" type="primary" @click="addShow = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>
<script>
import Breadcrumb from "@/components/Breadcrumb";
import Pagination from "@/components/Pagination";
import { parseTime } from "@/utils/index";
import { mapState } from "vuex";
import {
  applyMaterial,
  detailMaterial,
  materialStatus,
} from "@/services/person";
export default {
  name: "MaterialApplicationRecord",
  data() {
    return {
      currentDate: [],
      queryForm: {
        pageNo: 1,
        pageSize: 10,
        projectId: "",
        endDateStr: "", // parseTime( new Date().getTime() + 1000 * 60 * 60 * 24 * 30,"{y}-{m}-{d}")
        startDateStr: "", // parseTime(new Date(), "{y}-{m}-{d}")
        applyName: "",
        orgBranchName: "",
        status: 0,
      },
      total: 0,
      status: [],
      addShow: false,
      tableData: [],
      itemDetail: {},
    };
  },
  computed: {
    ...mapState({
      projectId: (state) => state.projectInfo.projectId,
    }),
  },
  components: {
    Breadcrumb,
    Pagination,
  },
  mounted() {
    this.queryForm.projectId = this.projectId;
    this.init();
    this.getMaterialStatus();
  },
  methods: {
    init() {
      applyMaterial(this.queryForm).then((res) => {
        if (res.code == 1) {
          // console.log(res)
          this.tableData = res.data.list;
          this.total = res.data.total;
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    getMaterialStatus() {
      materialStatus().then((res) => {
        if (res.code == 1) {
          this.status = [
            {
              id: 0,
              value: "全部",
            },
          ];
          this.status.push(...res.data);
          console.log(this.status);
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    search() {
      this.init();
    },
    getData(current) {
      this.queryForm.pageNo = current.page;
      this.queryForm.pageSize = current.limit;
      this.init();
    },
    dateChange(e) {
      // console.log(e[0]);
      // console.log(e[1]);
      this.queryForm.startDateStr = e[0];
      this.queryForm.endDateStr = e[1];
    },
    check(row) {
      this.addShow = true;
      detailMaterial({ id: row.id }).then((res) => {
        if (res.code == 1) {
          console.log(res);
          this.itemDetail = res.data;
        } else {
          this.$message.error(res.msg);
        }
      });
    },
  },
};
</script>
<style lang="less">
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
.item_detail {
  margin: 12px 0;
  font-size: 16px;
}
</style>
