<template>
  <div>
    <div class="common-container">
      <breadcrumb class="breadcrumb-container" />
      <div class="top_head">
        <div class="inputs">
          <div class="input_group">
            <p>工作名称</p>
            <el-input
              v-model="paramsData.title"
              class="text_input"
              size="medium"
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
        <h3>工作列表</h3>
        <el-button @click="toAddWorks" size="medium" type="primary"
          >添加工作</el-button
        >
      </div>
      <div class="table_padding">
        <el-table
          :header-cell-style="{ background: '#F3F4F7', color: '#333333' }"
          :data="tableList"
          border
          style="width: 100%"
        >
          <el-table-column :width="60" align="center" label="id">
            <template slot-scope="{ $index }">
              <span v-text="$index + 1"></span>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="title" label="工作名称">
          </el-table-column>
          <el-table-column align="center" prop="cleanerCount" label="人数">
          </el-table-column>
          <el-table-column align="center" prop="workDay" label="工作">
          </el-table-column>
          <el-table-column width="180" align="center" label="操作">
            <template slot-scope="{ row, $index }">
              <el-button @click="editItem(row, $index)" size="mini"
                >编辑</el-button
              >
              <el-button @click="delItem(row, $index)" size="mini" type="danger"
                >删除</el-button
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
        v-show="total > 0"
        :total="total"
      />
    </div>

    <!-- 工作添加 -->
    <el-dialog
      :title="'添加'"
      :lock-scroll="false"
      :visible.sync="workPop"
      :close-on-click-modal="false"
      width="35%"
      center
    >
      <div class="pop_content">
        <div class="dialog_item">
          <p>工作名称</p>
          <div class="flex1">
            <el-input
              v-model="addParams.title"
              style="width: 100%"
              size="medium"
              class="text_input"
              placeholder="请输入内容"
            ></el-input>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="workPop = false" size="medium">取 消</el-button>
        <el-button @click="addSubmit" size="medium" type="primary"
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
  _intervalTaskList,
  _intervalTaskAddEdit,
  _intervalTaskDel,
} from "@/services/system";
export default {
  name: "CustomWorkList",
  data() {
    return {
      workPop: false,
      addParams: {
        title: "",
        id: "",
        projectId: this.$store.state.projectInfo.projectId,
        workDay: "",
      },

      paramsData: {
        title: "",
        projectId: this.$store.state.projectInfo.projectId,
        pageNo: 1,
        pageSize: 10,
      },
      tableList: [],
      total: 0,
    };
  },
  components: {
    Breadcrumb,
    Pagination,
  },
  mounted() {
    this.getList();
  },
  methods: {
    getList() {
      _intervalTaskList(this.paramsData).then((res) => {
        if (res.code == 1) {
          this.tableList = res.data.list;
          this.total = res.data.total;
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    getListFromPage(val) {
      this.paramsData.pageNo = val.page;
      this.paramsData.pageSize = val.limit;
      this.getList();
    },
    toAddWorks() {
      this.title = "";
      this.workPop = true;
    },
    editItem(row, $index) {
      let params = {
        id: row.id,
      };
      this.pushTo("CustomWorkDetail", params);
    },
    addSubmit() {
      if (this.addParams.title == "")
        return this.$message({ type: "warning", message: "请输入工作名称" });
      _intervalTaskAddEdit(this.addParams).then((res) => {
        if (res.code == 1) {
          this.$message.success(res.msg);
          this.workPop = false;
          this.getList();
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    searchList() {
      this.paramsData.pageNo = 1;
      this.getList();
    },
    delItem(row, index) {
      let _this = this;
      this.$confirm("确定删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "",
      })
        .then(() => {
          _intervalTaskDel(row.id).then((res) => {
            if (this.paramsData.pageNo > 1 && this.tableList == 1) {
              this.paramsData.pageNo--;
            }
            this.$message({
              type: "success",
              message: "删除成功!",
            });
            this.getList();
          });
        })
        .catch(() => {});
    },
  },
};
</script>
<style lang="less">
.detail_container {
  padding-left: 6px;
  .title_item {
    padding: 18px 0 0 0;
    display: flex;
  }
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
.dialog_item {
  margin-top: 16px;
  display: flex;
  align-items: center;
  .el-input {
    width: inherit;
  }
  > p {
    text-align: left;
    font-size: 14px;
    width: 80px;
  }

  .flex1 {
    flex: 1;
    > span {
      font-size: 14px;
      padding: 0 10px;
    }
  }
}
</style>