<template>
  <div class="common-container" v-loading="isLoading">
    <breadcrumb id="breadcrumb-container" class="breadcrumb-container" />
    <div class="region">
      <div class="input_group">
        <p><span>*</span>职责名称</p>
        <el-input
          class="text_input"
          size="medium"
          v-model="paramsData.title"
          placeholder="请输入内容"
        ></el-input>
      </div>
      <div class="input_group">
        <p><span>*</span>所属网点</p>
        <el-select
          class="text_input"
          size="medium"
          v-model="paramsData.organizationBranchId"
          placeholder="请选择"
        >
          <el-option
            v-for="item in outList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </div>
      <div class="input_group">
        <p>驻点员工</p>
        <el-select
          filterable
          class="text_input"
          size="medium"
          v-model="paramsData.cleanerId"
          placeholder="请选择"
        >
          <el-option
            v-for="item in userList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </div>
      <div class="input_group">
        <p>周工作日期</p>
        <el-checkbox-group v-model="weekList">
          <el-checkbox :label="1">周一</el-checkbox>
          <el-checkbox :label="2">周二</el-checkbox>
          <el-checkbox :label="4">周三</el-checkbox>
          <el-checkbox :label="8">周四</el-checkbox>
          <el-checkbox :label="16">周五</el-checkbox>
          <el-checkbox :label="32">周六</el-checkbox>
          <el-checkbox :label="64">周日</el-checkbox>
        </el-checkbox-group>
      </div>
      <div class="input_group">
        <p>工作时间</p>
        <el-time-picker
          size="medium"
          value-format="HH:mm"
          format="HH:mm"
          v-model="paramsData.startTime"
          :picker-options="{
            selectableRange: '00:00:00 - 23:59:59',
          }"
          placeholder="开始时间"
        >
        </el-time-picker>
        <span> 至 </span>
        <el-time-picker
          size="medium"
          value-format="HH:mm"
          format="HH:mm"
          v-model="paramsData.endTime"
          :picker-options="{
            selectableRange: '00:00:00 - 23:59:59',
          }"
          placeholder="结束时间"
        >
        </el-time-picker>
      </div>

      <div class="input_group">
        <p>工作安排</p>
        <el-button @click="addItem" size="medium " type="primary "
          >添加</el-button
        >
      </div>
      <div class="input_group input_group2">
        <el-table
          :header-cell-style="{ background: '#F3F4F7', color: '#333333' }"
          :data="paramsData.taskItemList"
          border
          style="width: 100%"
        >
          <el-table-column align="center" prop="title" label="标题">
          </el-table-column>
          <el-table-column align="center" label="工作时间">
            <template slot-scope="{ row }">
              {{ row.startTime }} - {{ row.endTime }}
            </template>
          </el-table-column>
          <el-table-column align="center" prop="content" label="描述">
          </el-table-column>
          <el-table-column align="center" label="操作" width="180">
            <template slot-scope="{ row, $index }">
              <el-button size="small" @click="editPop($index)" type="warning"
                >修改</el-button
              >
              <el-button @click="delItem(row, $index)" size="mini" type="danger"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="footer_btns">
      <el-button size="medium" @click="submitFrom" type="primary"
        >提交</el-button
      >
    </div>

    <el-dialog
      title="工作安排"
      :lock-scroll="false"
      :visible.sync="addShow"
      :close-on-click-modal="false"
      width="50%"
      center
    >
      <div class="pop_content">
        <div class="dialog_item">
          <p>标题</p>
          <div class="flex1">
            <el-input
              style="width: 100%"
              size="medium"
              class="text_input"
              v-model="cutTaskData.title"
              placeholder="请输入内容"
            ></el-input>
          </div>
        </div>
        <div class="dialog_item">
          <p>工作时间</p>
          <div class="flex1">
            <el-time-picker
              class="text_input"
              size="medium"
              value-format="HH:mm"
              format="HH:mm"
              v-model="cutTaskData.startTime"
              :picker-options="{
                selectableRange: '00:00:00 - 23:59:59',
              }"
              placeholder="开始时间"
            >
            </el-time-picker>
            <span> 至 </span>
            <el-time-picker
              size="medium"
              class="text_input"
              value-format="HH:mm"
              format="HH:mm"
              v-model="cutTaskData.endTime"
              :picker-options="{
                selectableRange: '00:00:00 - 23:59:59',
              }"
              placeholder="结束时间"
            >
            </el-time-picker>
          </div>
        </div>
        <div class="dialog_item dialog_item2">
          <p>详情描述</p>
          <div class="flex1">
            <el-input
              class="text_input"
              type="textarea"
              :rows="3"
              placeholder="请输入内容"
              v-model="cutTaskData.content"
            >
            </el-input>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="medium" @click="addShow = false">取 消</el-button>
        <el-button size="medium" @click="addDutyItem" type="primary"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>
<script>
import Breadcrumb from "@/components/Breadcrumb";
import { mapState } from "vuex";
import { _getWeekList } from "@/api/common";
import {
  _orgTaskDetail,
  _getTaskBranchAreaList,
  _getTaskUserList,
  _taskAdd,
  _taskUpdate,
} from "@/services/home";
export default {
  name: "DutyInfo",
  data() {
    return {
      isLoading: false,
      isEdit: false,
      itemEdit: false,
      itemIndex: 0,
      addShow: false,
      weekList: [],
      paramsData: {
        cleanerId: "",
        cleanerName: "",
        cleanerPhone: "",
        cleanerProfile: "",
        endTime: "",
        id: "",
        organizationBranchId: "",
        organizationBranchName: "",
        projectId: "",
        startTime: "",
        taskItemList: [],
        title: "",
        week: 0,
      },
      outList: [],
      userList: [],
      cutTaskData: {
        title: "",
        content: "",
        startTime: "",
        endTime: "",
        id: "",
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
  },
  mounted() {
    this.paramsData.projectId = this.projectId;
    this.weekList = [];

    this.isEdit = this.$route.params.isEdit;
    if (this.isEdit) {
      this.orgTaskDetail(this.$route.params.id);
    }
    this.getTaskBranchAreaList();
    this.getTaskUserList();
  },
  methods: {
    orgTaskDetail(id) {
      _orgTaskDetail(id).then((res) => {
        if (res.code == 1) {
          this.paramsData = res.data;
          console.log("详情返回cleanerId：", this.paramsData.cleanerId);
          this.weekList = _getWeekList(this.paramsData.week);
          console.log(this.weekList);
        }
      });
    },
    getTaskUserList() {
      let params = {
        projectId: this.projectId,
        id: this.$route.params.id || "",
      };
      _getTaskUserList(params).then((res) => {
        if (res.code == 1) {
          this.userList = res.data;
          console.log("接口列表返回id", this.userList[0].id);
        }
      });
    },
    getTaskBranchAreaList() {
      _getTaskBranchAreaList(this.projectId).then((res) => {
        if (res.code == 1) {
          this.outList = res.data;
        }
      });
    },
    addItem() {
      if (this.paramsData.startTime == "")
        return this.$message({
          type: "warning",
          message: "请选择职责开始时间",
        });
      if (this.paramsData.endTime == "")
        return this.$message({
          type: "warning",
          message: "请选择职责结束时间",
        });
      this.itemEdit = false;
      this.cutTaskData = {
        title: "",
        content: "",
        startTime: "",
        endTime: "",
        id: "",
      };
      this.addShow = true;
    },
    editPop(index) {
      this.itemIndex = index;
      this.itemEdit = true;
      this.cutTaskData = Object.assign({}, this.paramsData.taskItemList[index]);
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
          _this.paramsData.taskItemList.splice(index, 1);
        })
        .catch(() => {});
    },
    submitFrom() {
      if (this.paramsData.title == "")
        return this.$message({ type: "warning", message: "请输入职责名称" });
      if (this.paramsData.organizationBranchId == "")
        return this.$message({ type: "warning", message: "请选择网点" });
      if (this.paramsData.startTime == "")
        return this.$message({ type: "warning", message: "请选择开始时间" });
      if (this.paramsData.endTime == "")
        return this.$message({ type: "warning", message: "请选择结束时间" });
      if (!this.compareDate(this.paramsData.startTime, this.paramsData.endTime))
        return this.$message({
          type: "warning",
          message: "请合理选择工作时间",
        });
      console.log(this.paramsData);
      // 网点
      this.outList.forEach((val) => {
        if (val.id == this.paramsData.organizationBranchId) {
          this.paramsData.organizationBranchName = val.name;
          return;
        }
      });
      // 员工
      if (this.paramsData.cleanerId != "") {
        this.userList.forEach((val) => {
          if (val.id == this.paramsData.cleanerId) {
            this.paramsData.cleanerName = val.name;
            this.paramsData.cleanerPhone = val.phone;
            return;
          }
        });
      }
      let weekCount = 0;
      if (this.weekList.length > 0) {
        this.weekList.forEach((val) => {
          weekCount += val;
        });
      }
      this.paramsData.week = weekCount;
      // 提交请求
      if (this.isEdit) {
        /// 修改
        _taskUpdate(this.paramsData).then((res) => {
          if (res.code == 1) {
            this.$message({ type: "success", message: "修改成功" });
            this.$router.go(-1);
          } else {
            this.$message({ message: res.msg, type: "warning" });
          }
        });
      } else {
        /// 添加
        _taskAdd(this.paramsData).then((res) => {
          if (res.code == 1) {
            this.$message({ type: "success", message: "添加成功" });
            this.$router.go(-1);
          } else {
            this.$message({ message: res.msg, type: "warning" });
          }
        });
      }
    },

    addDutyItem() {
      if (this.cutTaskData.title == "")
        return this.$message({ type: "warning", message: "请输入标题" });
      if (this.cutTaskData.startTime == "")
        return this.$message({ type: "warning", message: "请选择开始时间" });
      if (this.cutTaskData.endTime == "")
        return this.$message({ type: "warning", message: "请选择结束时间" });
      if (
        !this.compareDate(this.cutTaskData.startTime, this.cutTaskData.endTime)
      )
        return this.$message({
          type: "warning",
          message: "请合理选择工作时间",
        });
      if (
        !this.compareDate(this.paramsData.startTime, this.cutTaskData.startTime)
      )
        return this.$message({
          type: "warning",
          message: "工作开始时间不能小于职责开始时间",
        });
        if (
        !this.compareDate(this.cutTaskData.endTime,this.paramsData.endTime )
      )
        return this.$message({
          type: "warning",
          message: "工作结束时间不能大于职责结束时间",
        });
      if (this.cutTaskData.content == "")
        return this.$message({ type: "warning", message: "请输入描述" });
      if (this.itemEdit) {
        this.$set(
          this.paramsData.taskItemList,
          this.itemIndex,
          this.cutTaskData
        );
        // this.$forceUpdate();
      } else {
        this.paramsData.taskItemList.push(this.cutTaskData);
      }
      this.addShow = false;
    },
    compareDate(t1, t2) {
      var date = new Date();
      var a = t1.split(":");
      var b = t2.split(":");
      return date.setHours(a[0], a[1]) <= date.setHours(b[0], b[1]);
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
</style>