<template>
  <div class="common-container" v-loading="isLoading">
    <breadcrumb id="breadcrumb-container" class="breadcrumb-container" />
    <div class="region">
      <div class="input_group">
        <p><span>*</span>工作标题</p>
        <el-input
          v-model="detailParams.title"
          style="margin-right: 20px"
          class="text_input"
          size="medium"
          placeholder="请输入内容"
          :disabled="!editChange"
        ></el-input>
        <el-button
          @click="changeTile"
          :type="editChange ? 'primary' : ''"
          size="small"
          v-text="editChange ? '保存' : '修改'"
        ></el-button>
      </div>

      <div class="input_group date_group">
        <p>日期</p>
        <el-row :gutter="0" class="date_list">
          <el-col
            @click.native="checkDate(item)"
            class="date_col"
            style="width: 14.28%"
            v-for="(item, index) in dateList"
            :key="index"
          >
            <p v-text="item.day"></p>
            <i v-show="item.check" class="date_check el-icon-success"></i>
          </el-col>
        </el-row>
      </div>

      <div class="input_group">
        <p style="width: initial">人员</p>
        <el-button @click="addPersonnel" size="small" type="primary "
          >添加</el-button
        >
      </div>
      <div class="input_group input_group2">
        <el-table
          :header-cell-style="{ background: '#F3F4F7', color: '#333333' }"
          :data="detailParams.cleanerVOList"
          border
          style="width: 100%"
        >
          <!-- <el-table-column align="center" prop="title" label="伦次编号">
            <template slot-scope="{ $index }">
              {{ $index + 1 }}
            </template>
          </el-table-column> -->
          <el-table-column align="center" prop="cleanerName" label="人员">
          </el-table-column>
          <el-table-column align="center" label="操作" width="180">
            <template slot-scope="{ row }">
              <!-- <el-button size="small" type="warning">修改</el-button> -->
              <el-button @click="cleanerDel(row)" size="mini" type="danger"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="input_group">
        <p style="width: initial">工作安排</p>
        <el-button @click="addWorks" size="small" type="primary "
          >添加</el-button
        >
      </div>
      <div class="input_group input_group2">
        <el-table
          :header-cell-style="{ background: '#F3F4F7', color: '#333333' }"
          :data="detailParams.itemVOList"
          border
          style="width: 100%"
        >
          <el-table-column align="center" prop="title" label="标题">
          </el-table-column>
          <el-table-column align="center" label="工作时间">
            <template slot-scope="{ row }">
              {{row.startTime}}-{{row.endTime}}
            </template>
          </el-table-column>
          <el-table-column align="center" prop="content" label="描述">
          </el-table-column>
          <el-table-column align="center" label="操作" width="180">
            <template slot-scope="{ row }">
              <!-- <el-button size="small" type="warning">修改</el-button> -->
              <el-button @click="workDel(row)" size="mini" type="danger"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="footer_btns">
      <el-button @click="backPage" size="medium">返回</el-button>
    </div>

    <!-- 人员添加 -->
    <el-dialog
      custom-class="dialog_min_width"
      :title="isAdd ? '添加' : '修改'"
      :lock-scroll="false"
      :visible.sync="personnelPop"
      :close-on-click-modal="false"
      width="30%"
      center
    >
      <div class="pop_content">
        <div class="pop_item">
          <p style="width: initial">人员</p>
          <el-select
            class="pop_input"
            multiple
            filterable
            remote
            reserve-keyword
            v-model="clearnerIds"
            placeholder="请选择"
            v-el-select-scroll="selectScroll"
          >
            <el-option
              v-for="item in cleanerList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button
          @click="addPSubmit"
          size="medium"
          type="primary"
          v-text="'确定'"
        ></el-button>
        <el-button
          size="medium"
          @click="personnelPop = false"
          v-text="'取消'"
        ></el-button>
      </span>
    </el-dialog>

    <!-- 工作添加 -->
    <el-dialog
      :title="isAdd2 ? '添加' : '修改'"
      :lock-scroll="false"
      :visible.sync="workPop"
      :close-on-click-modal="false"
      width="40%"
      center
    >
      <div class="pop_content">
        <div class="dialog_item">
          <p>标题</p>
          <div class="flex1">
            <el-input
              v-model="workPatams.title"
              style="width: 100%"
              size="medium"
              class="text_input"
              placeholder="请输入内容"
            ></el-input>
          </div>
        </div>
        <div class="dialog_item">
          <p>工作时间</p>
          <el-time-picker
            style="flex: 1"
            class="text_input"
            is-range
            v-model="seTime"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            format="HH:mm"
            value-format="HH:mm"
            placeholder="选择时间范围"
            @change="timeGroup"
          >
          </el-time-picker>
        </div>
        <div class="dialog_item dialog_item2">
          <p>详情描述</p>
          <div class="flex1">
            <el-input
              v-model="workPatams.content"
              type="textarea"
              :rows="3"
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
        <el-button @click="addWorkSubmit" size="medium" type="primary"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>
<script>
function createOptions(len, start = 0) {
  return [
    Array(len)
      .fill(0)
      .map((_, index) => ({
        value: `选项${start + index}`,
        label: `我是${start + index}`,
      })),
  ];
}
import Breadcrumb from "@/components/Breadcrumb";
import { mapState } from "vuex";
import {
  _intervalTaskAddEdit,
  _intervalTaskDetail,
  _intervalTaskCleanerList,
  _intervalTaskCleanerAddEdit,
  _intervalTaskCleanerUpdate,
  _intervalTaskItemAdd,
  _intervalTaskItemUpdate,
} from "@/services/system";
export default {
  name: "CustomWorkDetail",
  data() {
    return {
      isLoading: false,
      editChange: false,
      isAdd: true,
      detailParams: {
        cleanerCount: 0,
        cleanerVOList: [],
        id: "",
        itemVOList: [],
        projectId: this.$store.state.projectInfo.projectId,
        taskItemCount: 0,
        title: "",
        workDay: "",
      },
      seTime: "",
      workPatams: {
        content: "",
        startTime: "",
        endTime: "",
        id: "",
        title: "",
      },
      cleanerList: [],
      clearnerIds: [],
      personnelPop: false,
      isAdd2: true,
      workPop: false,
      dateList: [],
      addShow: false,
      isEdit: false,
      options: createOptions(10),
      pageIndex: 0,
    };
  },
  computed: {
    ...mapState({
      projectId: (state) => state.projectInfo.projectId,
    }),
  },
  components: {
    Breadcrumb,
  },
  mounted() {
    let list = [];
    for (let i = 0; i < 31; i++) {
      let obj = { day: i + 1, check: false };
      list.push(obj);
    }
    this.dateList = list;
    this.detailParams.id = this.$route.params.id;
    this.getCleanerList();
    this.getDetail();
  },
  methods: {
    getCleanerList() {
      _intervalTaskCleanerList().then((res) => {
        if (res.code == 1) {
          this.cleanerList = res.data;
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    timeGroup(val) {
      this.workPatams.startTime = val[0];
      this.workPatams.endTime = val[1];
    },
    addWorks() {
      let params = {
        content: "",
        startTime: "",
        endTime: "",
        id: "",
        intervalTaskId: this.detailParams.id,
        title: "",
      };
      this.seTime = "";
      Object.assign(this.workPatams, params);
      this.workPop = true;
    },
    addWorkSubmit() {
      if (!this.workPatams.title)
        return this.$message({ type: "warning", message: "请输入标题" });
      if (!this.workPatams.endTime)
        return this.$message({ type: "warning", message: "请选择时间" });
      if (!this.workPatams.content)
        return this.$message({ type: "warning", message: "请输入详情描述" });
      _intervalTaskItemAdd(this.workPatams).then((res) => {
        if (res.code == 1) {
          this.$message.success(res.msg);
          this.workPop = false;
          this.getDetail();
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    backPage() {
      this.$router.go(-1);
    },
    getDetail() {
      _intervalTaskDetail(this.detailParams.id).then((res) => {
        if (res.code == 1) {
          this.detailParams = res.data;
          let dates = res.data.workDay.split(",");
          dates.forEach((val) => {
            this.dateList.forEach((val2) => {
              if (val == val2.day) {
                val2.check = true;
              }
            });
          });
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    addPersonnel() {
      this.clearnerIds = [];
      this.personnelPop = true;
    },
    addPSubmit() {
      if (!this.clearnerIds.length)
        return this.$message({ type: "warning", message: "请选择人员" });
      let params = {
        userIds: this.clearnerIds.join(","),
        intervalTaskId: this.detailParams.id,
      };
      _intervalTaskCleanerAddEdit(params).then((res) => {
        if (res.code == 1) {
          this.personnelPop = false;
          this.getDetail();
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    workDel(row) {
      this.$confirm("确定删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "",
      })
        .then(() => {
          let params = {
            id: row.id,
            intervalTaskId: this.detailParams.id,
          };
          _intervalTaskItemUpdate(params).then((res) => {
            if (res.code == 1) {
              this.getDetail();
            } else {
              this.$message.error(res.msg);
            }
          });
        })
        .catch(() => {});
    },
    cleanerDel(row, index) {
      this.$confirm("确定删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "",
      })
        .then(() => {
          let params = {
            id: row.id,
            intervalTaskId: this.detailParams.id,
          };
          _intervalTaskCleanerUpdate(params).then((res) => {
            if (res.code == 1) {
              this.getDetail();
            } else {
              this.$message.error(res.msg);
            }
          });
        })
        .catch(() => {});
    },
    changeTile() {
      this.editChange = !this.editChange;
      if (!this.editChange) {
        if (this.detailParams.title == "")
          return this.$message({ type: "warning", message: "请输入工作名称" });
        let params = {
          title: this.detailParams.title,
          id: this.detailParams.id,
          projectId: this.detailParams.projectId,
        };
        _intervalTaskAddEdit(params).then((res) => {
          if (res.code == 1) {
            this.$message.success(res.msg);
          } else {
            this.$message.error(res.msg);
          }
        });
      }
    },
    checkDate(item) {
      item.check = !item.check;
      let dateList = [];
      this.dateList.forEach((val) => {
        if (val.check) {
          dateList.push(val.day);
        }
      });
      this.detailParams.workDay = dateList.join(",");
      let params = {
        id: this.detailParams.id,
        projectId: this.detailParams.projectId,
        title: this.detailParams.title,
        workDay: this.detailParams.workDay,
      };
      _intervalTaskAddEdit(params).then((res) => {
        if (res.code == 1) {
          // this.$message.success(res.msg);
        } else {
          // this.$message.error(res.msg);
        }
      });
    },
    selectScroll() {
      console.log("selectScroll");
      // Select 滚动到底部 执行该方法
      // 这里可以做一些懒加载之类的事情，eg：
      this.pageIndex++;
      this.options.push(...createOptions(10, 10 * this.pageIndex));
    },
    remoteMethod(query) {
      if (query !== "") {
        this.loading = true;
        setTimeout(() => {
          this.loading = false;
          this.options = this.list.filter((item) => {
            return item.label.toLowerCase().indexOf(query.toLowerCase()) > -1;
          });
        }, 200);
      } else {
        this.options = [];
      }
    },
  },
};
</script>
<style lang="less">
.region {
  .input_group {
    margin-top: 20px;
    display: flex;
    align-items: center;

    > p {
      text-align: right;
      width: 70px;
      font-size: 14px;
      margin-right: 20px;
      > span {
        color: #f56c6c;
        padding: 3px 4px 0 0;
        font-size: 14px;
      }
    }
    .text_input {
      width: 200px;
    }
    > span {
      font-size: 14px;
      padding: 0 10px;
    }
  }
  .input_group2 {
    align-items: flex-start;
    > p {
      padding-top: 20px;
    }
  }
}
.footer_btns {
  margin-top: 40px;
  display: flex;
  justify-content: left;
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
.dialog_item2 {
  align-items: flex-start;
}
.region .date_group {
  display: flex;
  align-items: flex-start;
  .date_list {
    width: 600px;
    border-top: 1px solid #f0f0f0;
    border-left: 1px solid #f0f0f0;
    > .date_col {
      cursor: pointer;
      width: 14.28%;
      position: relative;
      border-right: 1px solid #f0f0f0;
      border-bottom: 1px solid #f0f0f0;
      padding: 10px 10px 30px 10px;
      .date_check {
        position: absolute;
        right: 5px;
        bottom: 5px;
        font-size: 20px;
        color: #409eff;
      }
    }
  }
}
.pop_item {
  display: flex;
  align-items: center;
  padding-top: 20px;
  > p {
    width: 80px;
    font-size: 14px;
    padding-right: 20px;
    text-align: right;
    > span {
      color: #f56c6c;
      padding: 3px 4px 0 0;
      font-size: 14px;
    }
  }
  .pop_input {
    flex: 1;
  }
}
.pop_item2 {
  align-items: flex-start;
}
</style>