<template>
  <div class="common-container">
    <breadcrumb id="breadcrumb-container" class="breadcrumb-container" />
    <div class="basics">
      <h3>员工考评基础配置</h3>
      <div class="input_group margin-btm-18">
        打卡范围半径
        <el-input
          v-model="settingInfo.limitDistance"
          oninput="value=value.replace(/[^\d]/g,'')"
          class="count_input"
          size="small"
          placeholder="单行输入"
        ></el-input>
        米
      </div>
    </div>
    <div class="project">
      <h3>员工考评项目配置</h3>
      <el-button class="add_btn" @click="addTile" size="small" type="primary"
        >添加
      </el-button>
      <div class="table_container1">
        <el-table
          :header-cell-style="{ background: '#F3F4F7', color: '#333333' }"
          :data="settingInfo.cleanerAssessConfigVOList"
          border
          style="width: 100%"
        >
          <el-table-column align="center" prop="title" label="标题">
          </el-table-column>
          <!--                    <el-table-column align="center" prop="score" label="分数">-->
          <!--                    </el-table-column>-->
          <el-table-column align="center" label="操作">
            <template slot-scope="{ row, $index }">
              <el-button
                type="warning"
                @click="editItem(row, $index)"
                size="mini"
                >修改
              </el-button>
              <el-button type="danger" @click="delItem(row, $index)" size="mini"
                >删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-button
          class="submit_btn"
          size="medium"
          type="primary"
          @click="submit"
          >提交</el-button
        >
      </div>
    </div>
    <el-dialog
      custom-class="dialog_min_width"
      title="标题"
      :lock-scroll="false"
      :visible.sync="addShow"
      :close-on-click-modal="false"
      width="35%"
      center
    >
      <div class="pop_content">
        <div class="pop_item">
          <el-input v-model="title" placeholder="请输入内容"></el-input>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button
          size="medium"
          type="primary"
          @click="changeTitle"
          v-text="isAdd ? '确定' : '修改'"
        ></el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import Breadcrumb from "@/components/Breadcrumb";
import {
  staffAppraisalSetting,
  editStaffAppraisalSetting,
} from "@/services/person";
export default {
  name: "StaffEvaluateConfig",
  data() {
    return {
      title: "",
      tableIndex: 0,
      addShow: false,
      isAdd: true,
      settingInfo: {
        limitDistance: "",
        cleanerAssessConfigVOList: [],
      },
    };
  },
  components: {
    Breadcrumb,
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      staffAppraisalSetting().then((res) => {
        if (res.code == 1) {
          // console.log(res)
          this.settingInfo = res.data;
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    addTile() {
      this.title = "";
      this.addShow = true;
    },
    changeTitle() {
      if (this.title == "") {
        this.$message({
          type: "warning",
          message: "请输入标题",
        });
        return;
      }
      if (this.isAdd) {
        this.settingInfo.cleanerAssessConfigVOList.push({
          title: this.title,
        });
      } else {
        this.settingInfo.cleanerAssessConfigVOList[
          this.tableIndex
        ].title = this.title;
      }
      this.addShow = false;
    },
    editItem(row, index) {
      this.isAdd = false;
      this.tableIndex = index;
      this.title = row.title;
      this.addShow = true;
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
          console.log();
          this.settingInfo.cleanerAssessConfigVOList.splice(index, 1);
        })
        .catch(() => {});
    },
    submit() {
      editStaffAppraisalSetting(this.settingInfo).then((res) => {
        if (res.code == 1) {
          // console.log(res)
          this.$message.success("提交成功！");
        } else {
          this.$message.error(res.msg);
        }
      });
    },
  },
};
</script>
<style lang="less">
.basics,
.project {
  padding: 0 0 0 6px;
  margin-bottom: 20px;

  > h3 {
    font-size: 14px;
    font-weight: bold;
    margin-bottom: 10px;
  }
}

.basics {
  margin-top: 20px;
  border-bottom: 1px solid #f2f2f2;
}

.project {
  .add_btn {
    margin: 10px 0;
  }
}

.input_group {
  // margin-bottom: 18px;
  display: flex;
  align-items: center;
  font-size: 12px;

  .count_input {
    width: 100px;
    margin: 0 10px;
  }
}

.submit_btn {
  margin: 20px 0;
}
</style>
