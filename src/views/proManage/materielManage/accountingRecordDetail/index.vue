<template>
  <div class="common-container">
    <breadcrumb id="breadcrumb-container" class="breadcrumb-container" />
    <div class="detail_container">
      <div class="title_item">
        <p>主管：</p>
        <span v-text=""></span>
      </div>
      <div class="title_item">
        <p>区域：</p>
        <span>xxw网点</span>
      </div>
      <div class="title_item">
        <p>提交时间：</p>
        <span>xxw网点</span>
      </div>
      <div class="title_item">
        <p>状态：</p>
        <span>xxw网点</span>
      </div>
      <div class="title_item">
        <p>物料单</p>
      </div>
      <div class="table_container1">
        <el-table
          :header-cell-style="{ background: '#F3F4F7', color: '#333333' }"
          :data="tableData"
          border
          style="width: 100%"
        >
          <el-table-column align="center" prop="name1" label="物料名称">
          </el-table-column>
          <el-table-column align="center" prop="name2" label="配额数量">
          </el-table-column>
          <el-table-column align="center" prop="name3" label="申请数量">
          </el-table-column>
          <el-table-column align="center" prop="name4" label="成本单价">
          </el-table-column>
          <el-table-column align="center" prop="name5" label="成本总价">
          </el-table-column>
        </el-table>
        <div class="count_box">合计：¥888</div>
      </div>
      <el-button size="medium" @click="goBack" type="primary">确定</el-button>
    </div>

    
  </div>
</template>
<script>
import Breadcrumb from "@/components/Breadcrumb";
export default {
  name: "AccountingRecordDetail",
  data() {
    return {
      tableData: [
        {
          name1: 1,
          name2: 1,
          name3: 1,
          name4: 1,
          name5: 1,
        },
        {
          name1: 1,
          name2: 1,
          name3: 1,
          name4: 1,
          name5: 1,
        },
      ],
    };
  },
  components: {
    Breadcrumb,
  },
  mounted() {},
  methods: {
    goBack() {
      this.$router.go(-1);
    },
    getSummaries(param) {
      // console.log(param)
    },
  },
};
</script>
<style lang="less">
.detail_container {
  padding-left: 6px;
  .title_item {
    padding: 18px 0 0 0;
    display: flex;
  }
}
.table_container1 {
  margin: 20px 0;
}
.count_box {
  border: 1px solid #ebeef5;
  border-top: none;
  padding: 12px 30px;
  font-size: 14px;
  line-height: 24px;
}
</style>