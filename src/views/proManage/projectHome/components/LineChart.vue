<template>
  <div :class="className" :style="{ height: height, width: width }" />
</template>

<script>
import echarts from "echarts";
require("echarts/theme/macarons"); // echarts theme
import resize from "./mixins/resize";

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: "chart",
    },
    width: {
      type: String,
      default: "100%",
    },
    height: {
      type: String,
      default: "350px",
    },
    autoResize: {
      type: Boolean,
      default: true,
    },
    chartData: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      chart: null,
    };
  },
  watch: {
    chartData: {
      deep: true,
      handler(val) {
        console.log("watch");
        this.setOptions(val);
      },
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart();
    });
  },
  beforeDestroy() {
    if (!this.chart) {
      return;
    }
    this.chart.dispose();
    this.chart = null;
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el, "macarons");
      this.setOptions(this.chartData);
    },
    setOptions({ countData1, countData2, countData3, disposableData } = {}) {
      this.chart.setOption({
        xAxis: {
          data: this.chartData.dateList,
          // data: ["海曙区", "鄞州区", "江北区", "北仑区", "镇海区"],
          boundaryGap: false,
          axisTick: {
            show: true,
          },
        },
        grid: {
          left: 30,
          right: 30,
          bottom: 20,
          top: 30,
          containLabel: true,
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
          },
          padding: [5, 10],
        },
        yAxis: {
          axisTick: {
            show: false,
          },
        },
        legend: {
          data: this.chartData.textList,
          // data: ["已使用配额", "区域配额"],
        },
        // series: this.chartData.dataInfo
        series: [
          {
            name: this.chartData.textList[0],
            itemStyle: {
              normal: {
                color: "#f56c6c",
                lineStyle: {
                  color: "#f56c6c",
                  width: 2,
                },
              },
            },
            smooth: false, // 弧线
            type: "line",
            data: countData1,
            animationDuration: 2800,
            animationEasing: "cubicInOut",
          },
          {
            name: this.chartData.textList[1],
            smooth: false,
            type: "line",
            itemStyle: {
              normal: {
                color: "#E6A23C",
                lineStyle: {
                  color: "#E6A23C",
                  width: 2,
                },
                areaStyle: {
                  color: "#f3f8ff",
                },
              },
            },
            data: countData2,
            animationDuration: 2800,
            animationEasing: "quadraticOut",
          },
          {
            name: this.chartData.textList[2],
            smooth: false,
            type: "line",
            itemStyle: {
              normal: {
                color: "#67c23a",
                lineStyle: {
                  color: "#67c23a",
                  width: 2,
                },
                areaStyle: {
                  color: "#f3f8ff",
                },
              },
            },
            data: countData3,
            animationDuration: 2800,
            animationEasing: "quadraticOut",
          },
        ],
      });
    },
  },
};
</script>
