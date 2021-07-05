<template>
  <div class="home_container">
    <!-- <breadcrumb id="breadcrumb-container" class="breadcrumb-container" /> -->
    <PanelGroup
      @handleSetLineChartData="getPath"
      :countData="[info.areaCount, info.orgBranchCount, info.employeeCount]"
    ></PanelGroup>
    <div class="situation_container">
      <h3>今日情况</h3>
      <el-row :gutter="40" class="situation_group">
        <el-col :xs="12" :sm="6" :md="6" :lg="6" class="card-panel-col">
          <div class="situation_item">
            <h3>日常处理</h3>
            <div class="item_info">
              <p>未处理</p>
              <span v-text="info.unHandleTaskItemRecordCount"></span>
            </div>
            <div class="item_info">
              <p>已处理</p>
              <span v-text="info.handleTaskItemRecordCount"></span>
            </div>
          </div>
        </el-col>
        <el-col :xs="12" :sm="6" :md="6" :lg="6" class="card-panel-col">
          <div class="situation_item">
            <h3>清扫反馈</h3>
            <div class="item_info">
              <p>未处理</p>
              <span v-text="info.unHandleFeedbackCount"></span>
            </div>
            <div class="item_info">
              <p>已处理</p>
              <span v-text="info.handleFeedbackCount"></span>
            </div>
          </div>
        </el-col>
        <el-col :xs="12" :sm="6" :md="6" :lg="6" class="card-panel-col">
          <div class="situation_item">
            <h3>事件上报</h3>
            <div class="item_info">
              <p>未处理</p>
              <span v-text="info.unHandleEmergencyCount"></span>
            </div>
            <div class="item_info">
              <p>已处理</p>
              <span v-text="info.handleEmergencyCount"></span>
            </div>
          </div>
        </el-col>
        <el-col :xs="12" :sm="6" :md="6" :lg="6" class="card-panel-col">
          <div class="situation_item">
            <h3>日常巡检</h3>
            <div class="item_info">
              <p>新增记录</p>
              <span v-text="info.orgCheckRecordCount"></span>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="circular_container">
      <div class="circular_left">
        <div class="c_head">
          <h3>今日考勤</h3>
        </div>
        <div class="work_group">
          <div class="progress_item">
            <div class="progress_div">
              <el-progress
                class="progress"
                :width="300"
                :percentage="percentage"
                status="success"
                type="circle"
                :show-text="false"
                :stroke-width="20"
                >asdasd
              </el-progress>
              <div class="progress_text">
                <p>
                  <span>{{ info.todayAttendanceRecordCount }}</span
                  >/{{ info.todayWorkPeopleCount }}
                </p>
                <p><span>打卡人数</span>/应到人数</p>
              </div>
            </div>
          </div>
          <div class="work_info">
            <div class="work_item">
              <p>迟到</p>
              <span v-text="info.later"></span>
            </div>
            <div class="work_item">
              <p>早退</p>
              <span v-text="info.early"></span>
            </div>
            <div class="work_item">
              <p>请假</p>
              <span v-text="info.workOffCount"></span>
            </div>
            <div class="work_item">
              <p>缺卡</p>
              <span v-text="info.lack"></span>
            </div>
            <div class="work_item">
              <p>旷工</p>
              <span v-text="info.absenteeism"></span>
            </div>
          </div>
        </div>
      </div>
      <div class="circular_right">
        <div class="c_head">
          <h3>网点月评比例</h3>
          <el-date-picker
            size="small"
            v-model="orgBranchDateStr"
            @change="changeDate1"
            format="yyyy-MM"
            value-format="yyyy-MM"
            type="month"
            placeholder="选择年月"
          >
          </el-date-picker>
        </div>
        <div class="chart-wrapper">
          <pie-chart :chart-data="orderChartData" />
        </div>
      </div>
    </div>
    <div class="circular_container">
      <div class="circular_left">
        <div class="c_head">
          <h3>各区域物料使用情况</h3>
          <el-select
            class="text_sel"
            size="small"
            v-model="toolsBatchId"
            @change="change1"
            placeholder="请选择批次"
          >
            <el-option
              v-for="item in batchList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </div>
        <div class="chart-wrapper">
          <!--  :chart-data="lineChartData" -->
          <columnar-chart :chart-data="columnarChartData" />
          <!-- <line-chart :chart-data="lineChartData"/> -->
        </div>
      </div>
      <div class="circular_right">
        <div class="c_head">
          <h3>各批次物料成本</h3>
          <el-select
            @change="change2"
            class="text_sel"
            size="small"
            v-model="batchId"
            placeholder="请选择批次"
          >
            <el-option
              v-for="item in batchList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </div>
        <div class="chart-wrapper">
          <line-chart :chart-data="lineChartData" />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
// import Breadcrumb from "../../components/Breadcrumb";
import PanelGroup from "./components/PanelGroup";
import LineChart from "./components/LineChart";
import PieChart from "./components/PieChart";
import ColumnarChart from "./components/ColumnarChart";
import {
  _getProjectHome,
  _getHomeAssess,
  _getHomeAreaInfo,
  _getHomeToolsBatch,
  _getHomeToolsBatchTools,
} from "@/services/home";
import { parseTime } from "@/utils";

const lineChartData = {
  newVisitis: {
    totalData: [90, 20, 162, 25, 75, 98, 162],
    paidData: [120, 82, 91, 154, 162, 140, 145],
    expiredData: [60, 45, 35, 87, 25, 46, 84],
    disposableData: [30, 54, 14, 85, 140, 35, 54],
  },
  messages: {
    expectedData: [200, 192, 120, 144, 160, 130, 140],
    actualData: [180, 160, 151, 106, 145, 150, 130],
  },
  purchases: {
    expectedData: [80, 100, 121, 104, 105, 90, 100],
    actualData: [120, 90, 100, 138, 142, 130, 130],
  },
  shoppings: {
    expectedData: [130, 140, 141, 142, 145, 150, 160],
    actualData: [120, 82, 91, 154, 162, 140, 130],
  },
};
export default {
  data() {
    return {
      projectId: this.$store.state.projectInfo.projectId,
      orgBranchDateStr: parseTime(new Date(), "{y}-{m}-{d}"),
      info: {},
      percentage: 0,
      resData: {
        absenteeism: 0,
        areaCount: 0,
        early: 0,
        employeeCount: 0,
        handleEmergencyCount: 0,
        handleFeedbackCount: 0,
        handleTaskItemRecordCount: 0,
        lack: 0,
        later: 0,
        orgBranchCount: 0,
        orgCheckRecordCount: 0,
        todayAttendanceRecordCount: 0,
        todayWorkPeopleCount: 0,
        unHandleEmergencyCount: 0,
        unHandleFeedbackCount: 0,
        unHandleTaskItemRecordCount: 0,
        workOffCount: 0,
      },

      orderChartData: {},
      batchId: "",
      toolsBatchId: "",
      batchList: [],
      dateStr1: "", // 网点月评
      columnarChartData: {
        textList: ["product", "已使用配额", "区域配额"],
        dataList: [
          // { product: "海曙区", 已使用配额: 10000, 区域配额: 15000 },
          // { product: "鄞州区", 已使用配额: 15000, 区域配额: 20001 },
          // { product: "江北区", 已使用配额: 10000, 区域配额: 12000 },
          // { product: "北仑区", 已使用配额: 8000, 区域配额: 5000 },
          // { product: "镇海区", 已使用配额: 9000, 区域配额: 9000 },
        ],
      },
      lineChartData: {
        dateList: [],
        // [
        //   "2020-01",
        //   "2020-02",
        //   "2020-03",
        //   "2020-04",
        //   "2020-05",
        //   "2020-06",
        //   "2020-07",
        //   "2020-08",
        //   "2020-09",
        //   "2020-10",
        // ],
        textList: ["已使用配额", "剩余配额", "总配额"],
        countData1: [], //[20, 162, 25, 75, 98, 20, 162, 25, 75, 98],
        countData2: [], //[82, 91, 154, 162, 140, 82, 91, 154, 162, 140],
        countData3: [], //[10, 91, 120, 78, 150, 20, 65, 51, 105, 28],
      },
    };
  },
  components: {
    // Breadcrumb,
    PanelGroup,
    LineChart,
    PieChart,
    ColumnarChart,
  },
  created() {},
  mounted() {
    let date = new Date();
    let month =
      date.getMonth() + 1 < 10
        ? "0" + (date.getMonth() + 1)
        : date.getMonth() + 1;
    this.dateStr1 = `${date.getFullYear()}-${month}`;
    this.getProjectHome();
    this.getHomeAssess();
    // this.getHomeToolsBatch(); // 报错
  },
  methods: {
    // 首页数据
    getProjectHome() {
      let params = {
        projectId: this.projectId,
        orgBranchDateStr: parseTime(new Date(), "{y}-{m}-{d}"),
      };
      _getProjectHome(params).then((res) => {
        if (res.code == 1) {
          // console.log(res)
          this.info = res.data;
          this.percentage =
            parseFloat(
              this.info.todayAttendanceRecordCount /
                this.info.todayWorkPeopleCount
            ) || 0;
          // this.percentage = parseFloat(16/1)||0
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    // 物料批次列表
    getHomeToolsBatch() {
      let params = {
        projectId: this.projectId,
      };
      _getHomeToolsBatch(params).then((res) => {
        if (res.code == 1) {
          this.batchList = res.data;

          this.batchId = this.toolsBatchId = this.batchList[0].id;

          this.getHomeAreaInfo();
          this.getHomeToolsBatchTools();
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    // 网点月评比例
    getHomeAssess() {
      if (!this.dateStr1) return;
      let params = {
        year: this.dateStr1.split("-")[0],
        month: this.dateStr1.split("-")[1],
        projectId: this.projectId,
      };
      _getHomeAssess(params).then((res) => {
        if (res.code == 1) {
          this.orderChartData = {
            textList: ["满意", "一般", "不满意"],
            dataInfo: [
              {
                value: res.data.satisfying,
                name: "满意",
                itemStyle: {
                  normal: {
                    color: "#67c23a",
                    lineStyle: { color: "#67c23a" },
                    areaStyle: { color: "#f3f8ff" },
                  },
                },
              },
              {
                value: res.data.general,
                name: "一般",
                itemStyle: {
                  normal: {
                    color: "#E6A23C",
                    lineStyle: { color: "#E6A23C" },
                    areaStyle: { color: "#f3f8ff" },
                  },
                },
              },
              {
                value: res.data.unSatisfying,
                name: "不满意",
                itemStyle: {
                  normal: {
                    color: "#f56c6c",
                    lineStyle: { color: "#f56c6c" },
                    areaStyle: { color: "#f3f8ff" },
                  },
                },
              },
            ],
          };
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    // 各区域物料使用情况
    getHomeAreaInfo() {
      let params = {
        toolsBatchId: this.toolsBatchId,
        projectId: this.projectId,
      };
      _getHomeAreaInfo(params).then((res) => {
        if (res.code == 1) {
          let list = [];
          res.data.forEach((val) => {
            let obj = {
              product: val.areaName,
              已使用配额: val.applyQuantity,
              区域配额: val.limit,
            };
            list.push(obj);
          });
          this.columnarChartData.dataList = list;
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    // 各批次物料成本
    getHomeToolsBatchTools() {
      let params = {
        projectId: this.projectId,
        toolsBatchId: this.batchId,
      };
      _getHomeToolsBatchTools(params).then((res) => {
        console.log(res);
        if (res.code == 1) {
          let dateList = [];
          let list1 = [];
          let list2 = [];
          let list3 = [];
          res.data.forEach((val) => {
            dateList.push(val.date);
            list1.push(val.used);
            list2.push(val.remaining);
            list3.push(val.all);
          });
          this.lineChartData.dateList = dateList;
          this.lineChartData.countData1 = list1;
          this.lineChartData.countData2 = list2;
          this.lineChartData.countData3 = list3;
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    changeDate1(val) {
      this.dateStr1 = val;
      this.getHomeAssess();
    },
    change1(val) {
      this.toolsBatchId = val;
      this.getHomeAreaInfo();
    },
    change2(val) {
      this.batchId = val;
      this.getHomeToolsBatchTools();
    },

    getPath() {},
  },
};
</script>
<style lang="less">
.home_container {
  margin: 20px;
}

.situation_container {
  margin-top: 20px;
  padding: 12px;
  background: #ffffff;
  border-radius: 4px;

  > h3 {
    padding: 8px 0;
    font-size: 16px;
  }
}

.situation_group {
  .card-panel-col {
    margin-top: 12px;
  }

  .situation_item {
    border: 1px solid #dddddd;
    border-radius: 4px;
    height: 113px;

    > h3 {
      font-size: 14px;
      background: #f2f2f2;
      padding: 10px;
      font-weight: bold;
    }

    .item_info {
      border-bottom: 1px solid #f2f2f2;
      padding: 12px 10px;
      display: flex;
      justify-content: space-between;

      > p {
        font-size: 12px;
      }

      > span {
        color: #f56c6c;
      }
    }

    .item_info:last-child {
      border-bottom: none;
    }
  }
}

.circular_container {
  margin-top: 20px;
  display: flex;

  .circular_left,
  .circular_right {
    background: #ffffff;
    flex: 1;
    border-radius: 4px;

    .c_head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px;

      > h3 {
        font-size: 16px;
        line-height: 32px;
      }
    }
  }

  .circular_left {
    margin-right: 10px;
  }

  .circular_right {
    margin-left: 10px;
  }
}

.chart-wrapper {
  background: #fff;
  padding: 16px 16px 0;
  margin-bottom: 32px;
  width: 100%;
}

.work_group {
  display: flex;

  .progress_item {
    flex: 1;
    text-align: center;

    .progress_div {
      position: relative;
      // .progress {
      // }
      .progress_text {
        position: absolute;
        left: 50%;
        top: 50%;
        -webkit-transform: translate(-50%, -50%);
        -ms-transform: translate(-50%, -50%);
        transform: translate(-50%, -50%);

        p {
          font-size: 14px;
          padding: 15px 0;
        }

        > p:first-child {
          font-weight: bold;
          font-size: 24px;

          > span {
            font-weight: bold;
            color: #67c23a;
          }
        }

        > p:last-child {
          font-size: 16px;

          > span {
            color: #67c23a;
          }
        }
      }
    }
  }

  .work_info {
    width: 200px;
    padding: 0 20px;

    .work_item {
      display: flex;
      justify-content: space-between;
      padding: 24px 0;

      > p {
        font-size: 14px;
      }

      > span {
        font-size: 14px;
        font-weight: bold;
      }
    }
  }
}
</style>
