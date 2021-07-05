<template>
  <div>
    <div class="common-container">
      <breadcrumb id="breadcrumb-container" class="breadcrumb-container" />
      <div class="top_head">
        <div class="inputs">
          <div class="input_group">
            <p>所属项目</p>
            <el-select v-model="queryForm.projectId" clearable>
              <el-option label="全部" :value="0"></el-option>
              <el-option
                :label="item.name"
                :value="item.id"
                v-for="(item, index) in projectList"
                :key="index"
              ></el-option>
            </el-select>
          </div>
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
            <p>主管</p>
            <el-input
              class="text_input"
              size="medium"
              v-model="queryForm.areaManagerName"
              placeholder="请输入内容"
            ></el-input>
          </div>
          <div class="input_group">
            <p>工作时间</p>
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
        <el-button
          size="medium"
          type="primary"
          icon="el-icon-search"
          @click="init"
          >搜索</el-button
        >
      </div>
      <div class="top_head">
        <div class="inputs">
          <div class="input_group">
            <p>提交时间</p>
            <el-date-picker
              @change="dateChangeTwo"
              v-model="currentDateTwo"
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
    </div>
    <div class="table_container">
      <div class="table_head">
        <h3>临时排班记录</h3>
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
          <el-table-column align="center" prop="projectName" label="所属项目">
          </el-table-column>
          <el-table-column
            align="center"
            prop="organizationBranchName"
            label="网点"
          >
          </el-table-column>
          <el-table-column align="center" prop="workDate" label="工作日期">
          </el-table-column>
          <el-table-column align="center" label="工作时间">
            <template slot-scope="{ row }">
              {{ row.startTime }}-{{ row.endTime }}
            </template>
          </el-table-column>
          <el-table-column align="center" prop="createTime" label="提交时间">
          </el-table-column>
          <el-table-column align="center" prop="areaManagerName" label="主管">
          </el-table-column>
          <el-table-column align="center" prop="cleanerName" label="指派员工">
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
  </div>
</template>
<script>
import Breadcrumb from "@/components/Breadcrumb";
import Pagination from "@/components/Pagination";
import { parseTime } from "@/utils";
import { temporarySchedulingList, belongProject } from "@/services/person";
export default {
  name: "StaffAttendanceList",
  data() {
    return {
      projectList: [],
      currentDate: [],
      currentDateTwo: [],
      queryForm: {
        pageNo: 1,
        pageSize: 10,
        commitEndDateStr: "",
        commitStartDateStr: "",
        workEndDateStr: "",
        workStartDateStr: "",
        areaManagerName: "",
        orgBranchName: "",
        projectId: 0,
        type: 2, //1机构、2临时
      },
      total: 0,
      popShow: false,
      tableData: [],
    };
  },
  components: {
    Breadcrumb,
    Pagination,
  },
  created() {
    this.getProject();
  },
  methods: {
    init() {
      temporarySchedulingList(this.queryForm).then((res) => {
        if (res.code == 1) {
          // console.log(res)
          this.tableData = res.data.list;
          this.total = res.data.total;
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    getProject() {
      belongProject().then((res) => {
        if (res.code == 1) {
          // console.log(res)
          this.projectList = res.data;
          this.init();
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    dateChange(e) {
      // console.log(e[0]);
      // console.log(e[1]);
      this.queryForm.commitStartDateStr = e[0];
      this.queryForm.commitEndDateStr = e[1];
    },
    dateChangeTwo(e) {
      // console.log(e[0]);
      // console.log(e[1]);
      this.queryForm.workStartDateStr = e[0];
      this.queryForm.workEndDateStr = e[1];
    },
    resetData(current) {
      this.queryForm.pageSize = current.limit;
      this.queryForm.pageNo = current.page;
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
