<template>
  <div v-loading="isLoading">
    <div class="common-container">
      <breadcrumb id="breadcrumb-container" class="breadcrumb-container" />
      <div class="top_head">
        <div class="inputs">
          <div class="input_group">
            <p>领班</p>
            <el-input
              class="text_input"
              size="medium"
              v-model="paramsData.areaLeaderName"
              placeholder="请输入内容"
            ></el-input>
          </div>
          <div class="input_group">
            <p>网点名称</p>
            <el-input
              class="text_input"
              size="medium"
              v-model="paramsData.orgBranchName"
              placeholder="请输入内容"
            ></el-input>
          </div>
          <div class="input_group">
            <p>满意度</p>
            <el-select
              class="text_input"
              size="medium"
              v-model="paramsData.satisfaction"
              placeholder="请选择"
            >
              <el-option
                class="text_input"
                v-for="item in scoreList"
                :key="item.id"
                :label="item.value"
                :value="item.id"
              >
              </el-option>
            </el-select>
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
      <div class="top_head">
        <div class="input_group">
          <p>考核月份</p>
          <el-date-picker
            class="text_input"
            value-format="yyyy-MM"
            format="yyyy-MM"
            v-model="startDate"
            @change="startChange"
            type="month"
            placeholder="开始日期"
          >
          </el-date-picker>
          <span> 至 </span>
          <el-date-picker
            class="text_input"
            value-format="yyyy-MM"
            format="yyyy-MM"
            v-model="endDate"
            @change="endChange"
            type="month"
            placeholder="结束日期"
          >
          </el-date-picker>
        </div>
      </div>
    </div>
    <div class="table_container">
      <div class="table_head">
        <h3>网点月度考核</h3>
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
          <el-table-column align="center" label="日期">
            <template slot-scope="{ row }">
              {{ row.year }} - {{ row.month }}
            </template>
          </el-table-column>
          <el-table-column align="center" prop="title" label="考核月份">
          </el-table-column>
          <el-table-column align="center" prop="areaLeaderName" label="领班">
          </el-table-column>
          <el-table-column
            align="center"
            prop="organizationBranchName"
            label="网点名称"
          >
          </el-table-column>
          <el-table-column align="center" prop="bankUserName" label="考核人">
          </el-table-column>
          <el-table-column align="center" prop="subTitle" label="满意度">
          </el-table-column>
          <el-table-column align="center" prop="createTime" label="创建时间">
          </el-table-column>
          <el-table-column align="center" label="操作">
            <template slot-scope="{ row, $index }">
              <el-button
                type="success"
                @click="editItem(row, $index)"
                size="mini"
                >详情</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
      <pagination
        style="text-align: right"
        :limit.sync="paramsData.pageSize"
        :page.sync="paramsData.pageNo"
        @pagination="getListFromPage"
        v-show="total > 10"
        :total="total"
      />
    </div>

    <el-dialog
      custom-class="dialog_min_width"
      title="月考核详情"
      :lock-scroll="false"
      :visible.sync="addShow"
      :close-on-click-modal="false"
      width="35%"
      center
    >
      <div class="pop_content">
        <div class="detail_group">
          <img
            class="detail_logo"
            src="@/assets/404_images/404.png"
            alt="404"
          />
          <div class="detail_right">
            <div class="title_hean">
              <h3 v-text="detailData.title"></h3>
              <p v-text="detailData.subTitle"></p>
            </div>
            <div class="pop_item">
              <p>网点：</p>
              <span v-text="detailData.organizationBranchName"></span>
            </div>
            <div class="pop_item">
              <p>领班：</p>
              <span v-text="detailData.areaLeaderName"></span>
            </div>
            <div class="detail_time">
              <div class="pop_item">
                <p>考核人：</p>
                <span v-text="detailData.bankUserName"></span>
              </div>
              <p v-text="detailData.title">2020.10.21 13:00</p>
            </div>
          </div>
        </div>
        <div class="image_title">打分情况</div>
        <div class="detail_scored">
          <el-row :gutter="50">
            <el-col
              v-for="(item, index) in detailData.itemList"
              :key="index"
              class="detail_col"
              :span="12"
            >
              <div class="scored_item">
                <h3 v-text="item.title"></h3>
                <p v-text="item.subTitle"></p>
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
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
import {
  _getSatisfactionList,
  _getBranchAssessRecordList,
  _branchAssessRecordDetail,
} from "@/services/home";
import { mapState } from "vuex";
export default {
  name: "OutletsAssessment",
  data() {
    return {
      addShow: false,
      isLoading: false,
      paramsData: {
        areaLeaderName: "",
        orgBranchName: "",
        projectId: "",
        satisfaction: 0,
        startDateStr: "",
        endDateStr: "",
        pageNo: 1,
        pageSize: 10,
      },
      scoreList: [],
      listData: [],
      detailData: {
        areaLeaderName: "",
        bankUserId: "",
        bankUserName: "",
        createTime: "",
        id: "",
        itemList: [],
        month: 0,
        organizationBranchId: "",
        organizationBranchName: "",
        projectName: "",
        subTitle: "",
        title: "",
        year: 0,
      },
      total: 0,
      startDate: new Date(),
      endDate: new Date(),
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
    let date = new Date();
    this.isLoading = true;
    let month =
      date.getMonth() + 1 < 10
        ? "0" + (date.getMonth() + 1)
        : date.getMonth() + 1;
    this.paramsData.startDateStr = this.paramsData.endDateStr = `${date.getFullYear()}-${month}`;
    this.paramsData.projectId = this.projectId;
    this.getSatisfactionList();
    this.getBranchAssessRecordList();
  },
  methods: {
    getSatisfactionList() {
      _getSatisfactionList().then((res) => {
        if (res.code == 1) {
          this.scoreList = [
            {
              id: 0,
              value: "全部",
            },
          ];
          this.scoreList.push(...res.data);
        }
      });
    },
    getBranchAssessRecordList() {
      _getBranchAssessRecordList(this.paramsData).then((res) => {
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
      this.isLoading = true;
      this.paramsData.pageNo = 1;
      this.getBranchAssessRecordList();
    },
    getListFromPage(val) {
      this.isLoading = true;
      this.paramsData.pageNo = val.page;
      this.paramsData.pageSize = val.limit;
      this.getBranchAssessRecordList();
    },
    startChange(val) {
      this.paramsData.startDateStr = val;
    },
    endChange(val) {
      this.paramsData.endDateStr = val;
    },
    editItem(row, index) {
      _branchAssessRecordDetail(row.id).then((res) => {
        if (res.code == 1) {
          this.detailData = res.data;
        } else {
          this.$message({ message: res.msg, type: "warning" });
        }
      });

      this.addShow = true;
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
      width: 150px;
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
  .title_hean {
    display: flex;
    justify-content: space-between;
    > h3 {
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
</style>