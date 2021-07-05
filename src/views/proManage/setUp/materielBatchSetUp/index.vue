<template>
  <div>
    <div class="common-container">
      <breadcrumb id="breadcrumb-container" class="breadcrumb-container" />
    </div>
    <div class="table_container">
      <div class="table_head">
        <h3>物料批次列表</h3>
        <el-button class="submit_btn" @click="add" size="medium" type="primary"
          >添加
        </el-button>
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
          <el-table-column align="center" prop="name" label="批次名称">
          </el-table-column>
          <el-table-column align="center" prop="startDate" label="开始时间">
          </el-table-column>
          <el-table-column
            align="center"
            prop="applyDeadDate"
            label="申请截止日期"
          >
          </el-table-column>
          <el-table-column align="center" prop="endDate" label="结束时间">
          </el-table-column>
          <el-table-column align="center" prop="status" label="状态">
            <template slot-scope="{ row, $index }">
              {{
                row.status == 1
                  ? "未开始"
                  : row.status == 2
                  ? "进行中"
                  : "已结束"
              }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作">
            <template slot-scope="{ row, $index }">
              <el-button
                type="warning"
                @click="editItem(row, $index)"
                size="mini"
                >修改</el-button
              >
              <el-button type="danger" @click="delItem(row, $index)" size="mini"
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
        v-show="total > 0"
        :total="total"
        :page="queryForm.pageNo"
        :limit="queryForm.pageSize"
        @pagination="resetTable"
      />
    </div>

    <el-dialog
      custom-class="dialog_min_width"
      title="物料批次"
      :lock-scroll="false"
      :visible.sync="addShow"
      :close-on-click-modal="false"
      width="35%"
      center
    >
      <div class="pop_content">
        <div class="pop_input_item">
          <p>名称</p>
          <el-input
            v-model="addForm.name"
            size="medium"
            style="width: 220px"
          ></el-input>
        </div>
        <div class="pop_input_item">
          <p>开始时间</p>
          <el-date-picker
            value-format="yyyy-MM-dd"
            format="yyyy-MM-dd"
            size="medium"
            v-model="addForm.startDate"
          >
          </el-date-picker>
        </div>
        <div class="pop_input_item">
          <p>结束时间</p>
          <el-date-picker
            value-format="yyyy-MM-dd"
            format="yyyy-MM-dd"
            size="medium"
            v-model="addForm.endDate"
          >
          </el-date-picker>
        </div>
        <div class="pop_input_item">
          <p>申请截止日期</p>
          <el-date-picker
            value-format="yyyy-MM-dd"
            format="yyyy-MM-dd"
            size="medium"
            v-model="addForm.applyDeadDate"
            placeholder="选择日期"
          >
          </el-date-picker>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button
          size="medium"
          type="primary"
          @click="addAndEdit"
          v-text="isAdd ? '确定' : '修改'"
        ></el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import Breadcrumb from "@/components/Breadcrumb";
import Pagination from "@/components/Pagination";
import {
  addMaterialBatch,
  delMaterialBatch,
  materialBatchList,
  editMaterialBatch,
} from "@/services/home";
export default {
  name: "MaterielBatchSetUp",
  data() {
    return {
      addShow: false,
      isAdd: true,
      queryForm: {
        pageNo: 1,
        pageSize: 10,
        projectId: this.$store.state.projectInfo.projectId,
      },
      addForm: {
        projectId: this.$store.state.projectInfo.projectId,
        startDate: "",
        endDate: "",
        applyDeadDate: "",
        name: "",
      },

      tableData: [],
      total: 0,
    };
  },
  components: {
    Breadcrumb,
    Pagination,
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      materialBatchList(this.queryForm).then((res) => {
        if (res.code == 1) {
          // console.log(res)
          this.tableData = res.data.list;
          this.total = res.data.total;
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    //分页
    resetTable(current) {
      this.queryForm.pageSize = current.limit;
      this.queryForm.pageNo = current.page;
      this.init();
    },
    add() {
      this.addForm = {
        projectId: this.$store.state.projectInfo.projectId,
        name: "",
        startDate: "",
        endDate: "",
        applyDeadDate: "",
      };
      this.isAdd = true;
      this.addShow = true;
    },
    addAndEdit() {
      if (this.addForm.name == "")
        return this.$message({ type: "warning", message: "请输入名称" });
      if (this.addForm.startDate == "")
        return this.$message({
          type: "warning",
          message: "请输入选择开始时间",
        });
      if (this.addForm.endDate == "")
        return this.$message({
          type: "warning",
          message: "请输入选择结束时间",
        });
      if (new Date(this.addForm.startDate) >= new Date(this.addForm.endDate))
        return this.$message({
          type: "warning",
          message: "结束时间必须大于开始时间",
        });
      if (this.addForm.applyDeadDate == "")
        return this.$message({
          type: "warning",
          message: "请输入选择截至时间",
        });
      if (this.isAdd) {
        addMaterialBatch(this.addForm).then((res) => {
          if (res.code == 1) {
            this.$message.success("添加成功！");
            this.addShow = false;
            this.init();
          } else {
            this.$message.error(res.msg);
          }
        });
      } else {
        editMaterialBatch(this.addForm).then((res) => {
          if (res.code == 1) {
            this.$message.success("修改成功！");
            this.addShow = false;
            this.init();
          } else {
            this.$message.error(res.msg);
          }
        });
      }
    },
    editItem(row) {
      this.isAdd = false;
      this.addForm = row;
      this.addShow = true;
    },
    delItem(row, index) {
      let that = this;
      that
        .$confirm("确定删除?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "",
        })
        .then(() => {
          delMaterialBatch({ id: row.id }).then((res) => {
            if (res.code == 1) {
              let a = that.queryForm.pageNo;
              let b = that.queryForm.pageSize;
              let totalSizes = that.total - 1 - (a - 1) * b;
              // console.log(totalSizes)
              if (totalSizes <= 0) {
                that.queryForm.pageNo--;
              }
              that.init();
              that.$message({
                type: "success",
                message: "删除成功!",
              });
              that.addShow = false;
            } else {
              that.$message.error(res.msg);
            }
          });
        })
        .catch(() => {});
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

.pop_input_item {
  display: flex;
  align-items: center;
  margin-bottom: 20px;

  > p {
    width: 100px;
  }
}

.pop_input_item:last-child {
  margin-bottom: 0;
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
