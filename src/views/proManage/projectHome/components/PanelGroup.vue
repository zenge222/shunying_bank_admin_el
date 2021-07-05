<template>
  <div class="home_card">
    <div class="card_flex">
      <div class="card_item">
        <img src="../../../../assets/card_1.png" alt />
        <div>
          <count-to
            :start-val="0"
            :end-val="countData[0]"
            :duration="2600"
            class="card-panel-num"
          />
          <p>区域数</p>
        </div>
      </div>
    </div>
    <!-- <div class="card_flex">
      <div class="card_item">
        <img src="../../../../assets/card_2.png" alt />
        <div>
          <count-to
            :start-val="0"
            :end-val="20"
            :duration="2600"
            class="card-panel-num"
          />
          <p>门店数</p>
        </div>
      </div>
    </div> -->
    <div class="card_flex">
      <div class="card_item">
        <img src="../../../../assets/card_3.png" alt />
        <div>
          <count-to
            :start-val="0"
            :end-val="countData[1]"
            :duration="2600"
            class="card-panel-num"
          />
          <p>网点数</p>
        </div>
      </div>
    </div>
    <div class="card_flex">
      <div class="card_item">
        <img src="../../../../assets/card_4.png" alt />
        <div>
          <count-to
            :start-val="0"
            :end-val="countData[2]"
            :duration="2600"
            class="card-panel-num"
          />
          <p>员工人数</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CountTo from "vue-count-to";

export default {
  props: {
    countData: {
      type: Array,
      required: false,
    },
  },
  components: {
    CountTo,
  },
  methods: {},
};
</script>

<style lang="less" scoped>
.home_card {
  display: flex;
  .card_flex {
    flex: 1;
    .card_item {
      padding: 25px;
      background: #ffffff;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-radius: 2px;
      margin: 0 10px;
      text-align: right;
      .card-panel-num {
        font-size: 28px;
        font-weight: bold;
      }
      img {
        width: 50px;
      }
      h3 {
        font-size: 28px;
      }
      p {
        font-size: 14px;
      }
    }
  }
  .card_flex:first-child {
    .card_item {
      margin: 0 10px 0 0;
    }
  }
  .card_flex:last-child {
    .card_item {
      margin: 0 0 0 10px;
    }
  }
}
</style>
