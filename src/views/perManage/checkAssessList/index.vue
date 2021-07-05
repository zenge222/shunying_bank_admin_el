<template>
  <div>
    <div class="common-container">
      <breadcrumb id="breadcrumb-container" class="breadcrumb-container" />
      <div class="top_head">
        <div class="inputs">
          <div class="input_group">
            <p>员工姓名</p>
            <el-input
              class="text_input"
              size="medium"
              v-model="queryForm.name"
              placeholder="请输入内容"
            ></el-input>
          </div>
          <div class="input_group">
            <p>工号</p>
            <el-input
              class="text_input"
              size="medium"
              v-model="queryForm.workNo"
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
        <h3>巡检考核列表</h3>
        <div class="input_group">
          <el-date-picker
            @change="dateChange"
            v-model="currentDate"
            format="yyyy-MM"
            value-format="yyyy-MM"
            type="month"
            :clearable="false"
          >
          </el-date-picker>
        </div>
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
          <el-table-column align="center" prop="workNo" label="工号">
          </el-table-column>
          <el-table-column align="center" prop="name" label="员工">
          </el-table-column>
          <el-table-column align="center" prop="orgBranchCount" label="网点数">
          </el-table-column>
          <el-table-column
            align="center"
            prop="orgCheckCount"
            label="网点巡检次数"
          >
          </el-table-column>
          <el-table-column align="center" prop="feedbackCount" label="反馈数">
          </el-table-column>
          <el-table-column align="center" prop="aveScore" label="网点平均分">
          </el-table-column>
          <el-table-column
            width="130"
            align="center"
            label="管辖网点满意度情况(满意/一般/不满)"
          >
            <template slot-scope="{ row, index }">
              {{
                row.satisfyingCount + "/" + row.general + "/" + row.unSatisfying
              }}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            width="130"
            label="反馈处理准时度情况(准时/超时)"
          >
            <template slot-scope="{ row, index }">
              {{ row.onTime + "/" + row.outTime }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作">
            <template slot-scope="{ row, $index }">
              <el-button @click="checkItem(row, $index)" size="mini"
                >详情</el-button
              >
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
        @pagination="resetData"
      />
    </div>
    <el-dialog
      custom-class="dialog_min_width"
      title="巡检数据详情"
      :lock-scroll="false"
      :visible.sync="popShow"
      :close-on-click-modal="false"
      width="70%"
    >
      <div class="pop_content">
        <h3 class="pop_title">{{ name }}</h3>
        <el-table
          :header-cell-style="{ background: '#F3F4F7', color: '#333333' }"
          :data="detailInfo"
          border
          style="width: 100%"
        >
          <el-table-column prop="projectName" align="center" label="项目名称">
          </el-table-column>
          <el-table-column
            align="center"
            prop="orgBranchCount"
            label="管辖网点数"
          >
          </el-table-column>
          <el-table-column align="center" prop="orgCheckCount" label="巡检次数">
          </el-table-column>
          <el-table-column align="center" prop="feedbackCount" label="反馈数">
          </el-table-column>
          <el-table-column align="center" prop="aveScore" label="网点平均分">
          </el-table-column>
          <el-table-column
            width="130"
            align="center"
            label="管辖网点满意度情况(满意/一般/不满意)"
          >
            <template slot-scope="{ row, index }">
              {{ row.satisfyingCount }}/{{ row.general }}/{{ row.unSatisfying }}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            width="130"
            label="反馈处理准时度情况(准时/超时)"
          >
            <template slot-scope="{ row, index }">
              {{ row.onTime }}/{{ row.outTime }}
            </template>
          </el-table-column>
        </el-table>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="medium" type="primary" @click="popShow = false"
          >确定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>
<script>
import Breadcrumb from "@/components/Breadcrumb";
import Pagination from "@/components/Pagination";
import { parseTime } from "@/utils";
import {
  getInspectionAssessmentList,
  getInspectionAssessmentDetail,
} from "@/services/person";
export default {
  name: "CheckAssessList",
  data() {
    return {
      currentDate:
        parseTime(new Date(), "{y}") + "-" + parseTime(new Date(), "{m}"),
      queryForm: {
        pageNo: 1,
        pageSize: 10,
        year: parseTime(new Date(), "{y}"),
        month: parseTime(new Date(), "{m}"),
        name: "",
        workNo: "",
      },
      total: 0,
      popShow: false,
      tableData: [],
      detailInfo: [],
      name: "",
    };
  },
  components: {
    Breadcrumb,
    Pagination,
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      getInspectionAssessmentList(this.queryForm).then((res) => {
        if (res.code == 1) {
          // console.log(res)
          this.tableData = res.data.list;
          this.total = res.data.total;
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    resetData(current) {
      this.pageNo = current.page;
      this.pageSize = current.pageSize;
      this.init();
    },
    toAddShop() {
      this.pushTo("StaffInfo");
    },
    checkItem(row, $index) {
      this.popShow = true;
      let data = {
        id: row.id,
        endDateStr: this.queryForm.endDateStr,
        startDateStr: this.queryForm.startDateStr,
      };
      getInspectionAssessmentDetail(data).then((res) => {
        if (res.code == 1) {
          // console.log(res)
          this.detailInfo = res.data;
          if (res.data.length > 0) {
            this.name = res.data[0].name;
          }
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    dateChange(e) {
      let str = e.split("-");
      this.queryForm.year = str[0];
      this.queryForm.month = str[1];
      this.pageNo = 1;
      this.init();
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
      width: 130px;
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
  .pop_title {
    font-size: 14px;
    margin-bottom: 20px;
  }
}
</style>
