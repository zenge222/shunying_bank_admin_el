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
      default: "360px",
    },
    chartData: {
      type: Object,
      required: true,
    },
  },
  watch: {
    chartData: function (newVal, oldVal) {
      this.chart.setOption(
        {
          tooltip: {
            trigger: "item",
            formatter: "{a} <br/>{b} : {c} ({d}%)",
          },
          legend: {
            left: "center",
            bottom: "10",
            data: newVal.textList,
          },
          series: [
            {
              name: "满意度",
              type: "pie",
              roseType: "radius",
              radius: [15, 95],
              center: ["50%", "38%"],
              data: this.chartData.dataInfo,
              animationEasing: "cubicInOut",
              animationDuration: 2600,
            },
          ],
        },
        true
      );
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
      this.chart.setOption({
        // title: {
        //   text: "作日订单统计",
        //   subtext: "嘉美美家",
        //   x: "center",
        //   left: "50%",
        //   top: "0%",
        //   textAlign: "center"
        // },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)",
        },
        legend: {
          left: "center",
          bottom: "10",
          data: this.chartData.textList,
        },
        series: [],
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
