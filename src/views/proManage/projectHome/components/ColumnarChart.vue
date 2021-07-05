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
    chartData: {
      type: Object,
      required: true,
    },
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
  data() {
    return {
      chart: null,
    };
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
    setOptions() {
      this.chart.setOption({
        legend: {},
        tooltip: {},
        dataset: {
          dimensions: this.chartData.textList,
          source: this.chartData.dataList,
        },
        xAxis: { type: "category" },
        yAxis: {},
        series: [
          {
            type: "bar",
            name: "已使用配额",
            itemStyle: {
              normal: {
                color: "#F56C6C",
                lineStyle: {
                  color: "#F56C6C",
                  width: 2,
                },
              },
            },
            smooth: false, // 弧线
            // data: totalData,
            animationDuration: 2800,
            animationEasing: "cubicInOut",
          },
          {
            type: "bar",
            name: "区域配额",
            itemStyle: {
              normal: {
                color: "#E6A23C",
                lineStyle: {
                  color: "#E6A23C",
                  width: 2,
                },
              },
            },
            smooth: false, // 弧线
            // data: totalData,
            animationDuration: 2800,
            animationEasing: "cubicInOut",
          },
        ],
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.a {
  position: relative;
  z-index: 999999;
}
</style>
