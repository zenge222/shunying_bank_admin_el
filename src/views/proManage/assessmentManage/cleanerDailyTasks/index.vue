<template>
  <div v-loading="isLoading">
    <div class="common-container">
      <breadcrumb id="breadcrumb-container" class="breadcrumb-container" />
      <div class="top_head">
        <div class="inputs">
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
            <p>保洁员</p>
            <el-input
              class="text_input"
              size="medium"
              v-model="paramsData.cleanerName"
              placeholder="请输入内容"
            ></el-input>
          </div>
          <div class="input_group">
            <p>状态</p>
            <el-select
              class="text_input"
              size="medium"
              v-model="paramsData.status"
              placeholder="请选择"
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
        <h3>日常任务</h3>
        <el-date-picker
          value-format="yyyy-MM-dd"
          format="yyyy-MM-dd"
          size="medium"
          v-model="dates"
          type="daterange"
          @change="dateChange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        >
        </el-date-picker>
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
          <el-table-column align="center" prop="createTime" label="日期">
          </el-table-column>
          <el-table-column
            align="center"
            prop="organizationBranchName"
            label="网点"
          >
          </el-table-column>
          <el-table-column align="center" prop="content" label="工作内容">
          </el-table-column>
          <el-table-column align="center" prop="cleanerName" label="保洁员">
          </el-table-column>
          <el-table-column align="center" label="安排时间">
            <template slot-scope="{ row }">
              {{ row.startTime }} - {{ row.endTime }}
            </template>
          </el-table-column>
          <el-table-column align="center" prop="statusText" label="状态">
          </el-table-column>
          <el-table-column align="center" label="完成时间">
            <template slot-scope="{ row }">
              {{ row.status == 1 ? "--" : row.updateTime }}
            </template>
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
      title="详情"
      :lock-scroll="false"
      :visible.sync="addShow"
      :close-on-click-modal="false"
      width="35%"
      center
    >
      <div class="pop_content">
        <div class="title_hean">
          <h3>{{ detailData.createTime }}日常任务</h3>
          <p>{{ detailData.statusText }}</p>
        </div>
        <div class="pop_item">
          <p>网点：</p>
          <span v-text="detailData.organizationBranchName"></span>
        </div>
        <div class="pop_item">
          <p>工作内容：</p>
          <span v-text="detailData.content"></span>
        </div>
        <div class="pop_item">
          <p>保洁：</p>
          <span v-text="detailData.cleanerName"></span>
        </div>
        <div class="pop_item">
          <p>安排时间：</p>
          <span> {{ detailData.startTime }} - {{ detailData.endTime }}</span>
        </div>
        <div class="pop_item">
          <p>完成时间：</p>
          <span>
            {{ detailData.status == 1 ? "--" : detailData.updateTime }}</span
          >
        </div>
        <div class="image_title">详情图片</div>
        <div class="detail_images">
          <el-row :gutter="20">
            <el-col
              v-for="(item, index) in detailData.images"
              :key="index"
              :span="12"
            >
              <img :src="detailData.baseUrl + item" alt="404"
            /></el-col>
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
import { mapState } from "vuex";
import {
  _getAccessStatusList,
  _getTaskItemRecordList,
  _taskItemRecordDetail,
} from "@/services/home";
export default {
  name: "CleanerDailyTasks",
  data() {
    return {
      addShow: false,
      isLoading: false,
      paramsData: {
        cleanerName: "",
        orgBranchName: "",
        pageNo: 1,
        pageSize: 10,
        status: 0,
        startDateStr: "",
        endDateStr: "",
        projectId: "",
      },
      total: 0,
      statusList: [],
      listData: [],
      dates: [new Date(), new Date()],
      detailData: {
        baseUrl: "",
        cleanerName: "",
        content: "",
        createTime: "",
        endTime: "",
        id: "",
        images: "",
        organizationBranchName: "",
        projectId: "",
        startTime: "",
        status: 1,
        statusText: "",
        title: "",
        updateTime: "",
      },
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
    this.getStatusList();
    this.getTaskItemRecordList();
  },
  methods: {
    getStatusList() {
      _getAccessStatusList().then((res) => {
        if (res.code == 1) {
          this.statusList = [
            {
              id: 0,
              value: "全部",
            },
          ];
          this.statusList.push(...res.data);
        }
      });
    },
    getTaskItemRecordList() {
      _getTaskItemRecordList(this.paramsData).then((res) => {
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
      this.getTaskItemRecordList();
    },
    getListFromPage(val) {
      this.isLoading = true;
      this.paramsData.pageNo = val.page;
      this.paramsData.pageSize = val.limit;
      this.getTaskItemRecordList();
    },
    toAddOutlets() {
      this.pushTo("OutletsInfo");
    },
    editItem(row, index) {
      _taskItemRecordDetail(row.id).then((res) => {
        if (res.code == 1) {
          let images = [];
          if (res.data.images != "") {
            images = res.data.images.split(",");
          }
          this.detailData = res.data;
          this.detailData.images = images;
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
      this.paramsData.pageNo = 1;
      this.getTaskItemRecordList();
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
  .image_title {
    margin: 20px 0;
    font-size: 14px;
  }
}
.detail_images {
  img {
    width: 100%;
  }
}
</style>