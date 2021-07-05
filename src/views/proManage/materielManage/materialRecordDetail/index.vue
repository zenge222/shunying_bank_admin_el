<template>
  <div class="common-container">
    <breadcrumb id="breadcrumb-container" class="breadcrumb-container" />
    <div class="detail_container">
      <div class="title_item">
        <p>申请人：</p>
        <span>xxw网点</span>
      </div>
      <div class="title_item">
        <p>申请网点：</p>
        <span>xxw网点</span>
      </div>
      <div class="title_item">
        <p>申请理由：</p>
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
          <el-table-column align="center" prop="name" label="物料名称">
          </el-table-column>
          <el-table-column align="center" prop="name" label="申请数量">
          </el-table-column>
          <el-table-column align="center" prop="name" label="发放数量">
          </el-table-column>
        </el-table>
      </div>
      <el-button size="medium" @click="goBack" type="primary">确定</el-button>
    </div>
  </div>
</template>
<script>
import Breadcrumb from "@/components/Breadcrumb";
export default {
  name: "MaterialRecordDetail",
  data() {
    return {
      tableData: [
        {
          name: "xx银行1",
        },
        {
          name: "xx银行2",
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
</style>