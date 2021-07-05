<template>
  <div>
    <div class="common-container">
      <breadcrumb id="breadcrumb-container" class="breadcrumb-container" />
      <div class="top_head">
        <div class="inputs">
          <div class="input_group">
            <p>物料名称</p>
            <el-input
              class="text_input"
              size="medium"
              v-model="formData.name"
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
        <h3>物料统计列表</h3>
        <el-button class="submit_btn" @click="add" size="medium" type="primary"
          >添加</el-button
        >
      </div>
      <div class="table_padding">
        <el-table
          :header-cell-style="{ background: '#F3F4F7', color: '#333333' }"
          :data="tableData"
          border
          size="small"
          style="width: 100%"
        >
          <el-table-column :width="60" align="center" label="id">
            <template slot-scope="{ $index }">
              <span v-text="$index + 1"></span>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="name" label="物料名称">
          </el-table-column>
          <el-table-column align="center" prop="limitQuantity" label="人均配额">
          </el-table-column>
          <el-table-column align="center" prop="cost" label="成本单价">
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
        :page="formData.pageNo"
        :limit="formData.pageSize"
        @pagination="resetTable"
      />
    </div>

    <el-dialog
      custom-class="dialog_min_width"
      title="物料"
      :lock-scroll="false"
      :visible.sync="addShow"
      :close-on-click-modal="false"
      width="35%"
      center
    >
      <div class="pop_content">
        <div class="pop_input_item">
          <p>物料名称</p>
          <el-input
            class="pop_input"
            size="medium"
            v-model="addForm.name"
            placeholder="请输入名称"
          ></el-input>
        </div>
        <div class="pop_input_item">
          <p>人均配额</p>
          <el-input
            class="pop_input"
            oninput="value=value.replace(/[^\d^]/g,'')"
            size="medium"
            v-model="addForm.limitQuantity"
            placeholder="请输入配额"
          ></el-input>
        </div>
        <div class="pop_input_item">
          <p>成本单价</p>
          <el-input
            class="pop_input"
            oninput="value=value.replace(/[^\d\^.]/g,'')"
            size="medium"
            v-model="addForm.cost"
            placeholder="请输入单价"
          ></el-input>
        </div>
        <div class="pop_input_item">
          <p>图片</p>
          <el-upload
            action="#"
            class="avatar-uploader"
            accept="image/png,image/gif,image/jpg,image/jpeg"
            :show-file-list="false"
            :before-upload="handleBeforeUpload"
          >
            <img
              v-if="addForm.image"
              :src="addForm.baseUrl + addForm.image"
              class="avatar"
            />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
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
  addMaterial,
  delMaterial,
  materialList,
  _uploadPic,
} from "@/services/home";
export default {
  name: "MaterielSetUp",
  data() {
    return {
      addShow: false,
      tableIndex: 0,
      input: "",
      isAdd: true,
      tableData: [],
      total: 0,
      formData: {
        pageNo: 1,
        pageSize: 10,
        projectId: this.$store.state.projectInfo.projectId,
        name: "",
      },
      addForm: {
        cost: "",
        name: "",
        id: "",
        baseUrl: "",
        limitQuantity: "",
        projectId: this.$store.state.projectInfo.projectId,
        image: "",
      },
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
      materialList(this.formData).then((res) => {
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
      // console.log(current)
      this.formData.pageNo = current.page;
      this.formData.pageSize = current.limit;
      this.init();
    },
    add() {
      this.addForm.cost = "";
      this.addForm.name = "";
      this.addForm.id = "";
      this.addForm.limitQuantity = "";
      this.addForm.image = "";

      this.addShow = true;
      this.isAdd = true;
    },
    editItem(row, index) {
      this.isAdd = false;
      this.addForm = row;
      this.addShow = true;
    },
    delItem(row, index) {
      this.$confirm("确定删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "",
      })
        .then(() => {
          delMaterial({ id: row.id }).then((res) => {
            if (res.code == 1) {
              this.$message({
                type: "success",
                message: "删除成功!",
              });
              let a = this.formData.pageNo;
              let b = this.formData.pageSize;
              let totalSizes = this.total - 1 - (a - 1) * b;
              // console.log(totalSizes)
              if (totalSizes <= 0) {
                this.formData.pageNo--;
              }
              this.init();
            } else {
              this.$message.error(res.msg);
            }
          });
        })
        .catch(() => {});
    },
    addAndEdit() {
      if (this.addForm.name == "")
        return this.$message({ type: "warning", message: "请输入物料名称" });
      if (this.addForm.limitQuantity == "")
        return this.$message({ type: "warning", message: "请输入人均配额" });
      if (this.addForm.cost == "")
        return this.$message({ type: "warning", message: "请输入成本单价" });
      if (this.addForm.image == "")
        return this.$message({ type: "warning", message: "请上传图片" });
      addMaterial(this.addForm).then((res) => {
        if (res.code == 1) {
          if (this.isAdd) {
            this.$message.success("添加成功！");
          } else {
            this.$message.success("修改成功！");
          }
          this.addShow = false;
          this.init();
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    handleBeforeUpload(file) {
      if (
        !(
          file.type === "image/png" ||
          file.type === "image/jpg" ||
          file.type === "image/jpeg"
        )
      ) {
        this.$message({
          message: "请上传格式为image/png, image/jpg, image/jpeg的图片",
          type: "warning",
        });
        return;
      }
      let size = file.size / 1024 / 1024 / 2;
      if (size > 2) {
        this.$message({
          message: "图片大小必须小于2M",
          type: "warning",
        });
        return;
      }
      let fd = new FormData(); //通过form数据格式来传
      fd.append("filename", file); //传文件
      _uploadPic(fd).then((res) => {
        if (res.code == 1) {
          this.addForm.baseUrl = res.data.baseUrl;
          this.addForm.image = res.data.key;
        } else {
          this.$message({ message: res.msg, type: "warning" });
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

.pop_input_item {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  .pop_input {
    flex: 1;
  }
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
