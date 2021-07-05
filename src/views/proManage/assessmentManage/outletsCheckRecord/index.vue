<template>
  <div v-loading="isLoading">
    <div class="common-container">
      <breadcrumb id="breadcrumb-container" class="breadcrumb-container" />
      <div class="top_head">
        <div class="inputs">
          <div class="input_group">
            <p>巡检人员</p>
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
            <p>创建时间</p>
            <el-date-picker
              value-format="yyyy-MM-dd"
              format="yyyy-MM-dd"
              size="medium"
              v-model="dates"
              style="width: 280px"
              type="daterange"
              @change="dateChange"
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
        <h3>网点巡检记录</h3>
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
          <el-table-column align="center" prop="areaManagerName" label="巡检员">
          </el-table-column>
          <el-table-column
            align="center"
            prop="organizationBranchName"
            label="网点名称"
          >
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
      <!--  :page.sync="formParams.page"
      :limit.sync="formParams.limit" -->
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
      title="详情"
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
              <h3 v-text="detailData.organizationBranchName"></h3>
              <p v-text="detailData.createTime"></p>
            </div>
            <div class="detail_time">
              <div class="pop_item">
                <p>巡检员：</p>
                <span v-text="detailData.areaManagerName"></span>
              </div>
            </div>
          </div>
        </div>
        <div class="image_title">打分情况</div>
        <div class="detail_scored">
          <el-row :gutter="50">
            <el-col v-for="(item,index) in detailData.itemVOList" :key="index" class="detail_col" :span="12">
              <div class="scored_item">
                <h3 v-text="item.title">打分项目1</h3>
                <p>{{item.checkScore}}分</p>
              </div>
            </el-col>
          </el-row>
        </div>
        <div class="image_title">客户沟通情况</div>
        <p class="content" v-text="detailData.bankChatContent"></p>
        <div class="image_title">保洁沟通情况</div>
        <p class="content" v-text="detailData.cleanerChatContent"></p>
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
import { _getOrgCheckRecordList, _orgCheckRecordDetail } from "@/services/home";
import { mapState } from "vuex";

export default {
  name: "OutletsCheckRecord",
  data() {
    return {
      addShow: false,
      isLoading: false,
      paramsData: {
        areaLeaderName: "",
        endDateStr: "",
        startDateStr: "",
        orgBranchName: "",
        projectId: "",
        pageNo: 1,
        pageSize: 10,
      },
      total: 0,
      listData: [],
      detailData: {
        id: "",
        areaManagerName: "",
        image: "",
        baseUrl: "",
        organizationBranchName: "",
        bankChatContent: "",
        cleanerChatContent: "",
        createTime: "",
        itemVOList: [],
      },
      dates: [new Date(), new Date()],
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
    this.isLoading = true;
    let date = new Date();
    let month =
      date.getMonth() + 1 < 10
        ? "0" + (date.getMonth() + 1)
        : date.getMonth() + 1;

    let day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
    this.paramsData.startDateStr = this.paramsData.endDateStr = `${date.getFullYear()}-${month}-${day}`;
    this.paramsData.projectId = this.projectId;
    this.getOrgCheckRecordList();
  },
  methods: {
    getOrgCheckRecordList() {
      _getOrgCheckRecordList(this.paramsData).then((res) => {
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
      this.getOrgCheckRecordList();
    },
    getListFromPage(val) {
      this.isLoading = true;
      this.paramsData.pageNo = val.page;
      this.paramsData.pageSize = val.limit;
      this.getOrgCheckRecordList();
    },
    toAddOutlets() {
      this.pushTo("OutletsInfo");
    },
    editItem(row, index) {
      _orgCheckRecordDetail(row.id).then((res) => {
        if (res.code == 1) {
          this.detailData = res.data;
          this.addShow = true;
        } else {
          this.$message({ message: res.msg, type: "warning" });
        }
      });
    },
    delItem(row, index) {
      let _this = this;
      this.$confirm("确定删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "",
      })
        .then(() => {
          this.$message({
            type: "success",
            message: "删除成功!",
          });
          _this.tableData.splice(index, 1);
        })
        .catch(() => {});
    },
    dateChange(e) {
      this.paramsData.startDateStr = e[0];
      this.paramsData.endDateStr = e[1];
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
  .title_hean {
    display: flex;
    justify-content: space-between;
    > h3 {
      font-size: 14px;
      font-weight: bold;
      color: #333333;
    }
    > p {
      font-size: 12px;
      color: #333333;
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
    padding: 12px 0 0 0;
    border-top: 1px solid #f2f2f2;
  }
  .content {
    padding: 20px 0 0 0;
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