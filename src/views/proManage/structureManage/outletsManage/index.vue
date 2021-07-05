<template>
  <div v-loading="isLoading">
    <div class="common-container">
      <breadcrumb id="breadcrumb-container" class="breadcrumb-container" />
      <div class="top_head">
        <div class="inputs">
          <div class="input_group">
            <p>网点名称</p>
            <el-input
              class="text_input"
              size="medium"
              v-model="paramsData.name"
              placeholder="请输入内容"
            ></el-input>
          </div>
          <div class="input_group">
            <p>领班</p>
            <el-input
              class="text_input"
              size="medium"
              v-model="paramsData.areaManagerName"
              placeholder="请输入内容"
            ></el-input>
          </div>
          <div class="input_group">
            <p>手机</p>
            <el-input
              class="text_input"
              size="medium"
              v-model="paramsData.phone"
              placeholder="请输入内容"
            ></el-input>
          </div>
          <div class="input_group">
            <p>所属区域</p>
            <el-select
              class="text_input"
              size="medium"
              v-model="paramsData.areaId"
              placeholder="请选择"
            >
              <el-option
                v-for="item in branchAreaList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </div>
        </div>
        <el-button
          @click="searchList"
          size="medium"
          type="primary"
          icon="el-icon-search"
          >搜索</el-button
        >
      </div>
    </div>
    <div class="table_container">
      <div class="table_head">
        <h3>网点列表</h3>
        <el-button size="medium" @click="toAddOutlets" type="primary"
          >添加网点</el-button
        >
      </div>
      <div class="table_padding">
        <el-table
          :header-cell-style="{ background: '#F3F4F7', color: '#333333' }"
          :data="listData"
          border
          style="width: 100%"
        >
          <el-table-column :width="60" align="center" label="id">
            <template slot-scope="{ $index }">
              <span v-text="$index + 1"></span>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="name" label="网点名称">
          </el-table-column>
          <el-table-column align="center" prop="areaManagerName" label="领班">
          </el-table-column>
          <el-table-column align="center" prop="areaManagerPhone" label="手机">
          </el-table-column>
          <el-table-column align="center" prop="areaName" label="所属区域">
          </el-table-column>
          <el-table-column align="center" prop="address" label="地址">
          </el-table-column>
          <el-table-column width="180" align="center" label="操作">
            <template slot-scope="{ row, $index }">
              <el-button @click="editItem(row, $index)" size="mini"
                >编辑</el-button
              >
              <el-button @click="delItem(row, $index)" size="mini" type="danger"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!--  :page.sync="formParams.page"
      :limit.sync="formParams.limit" -->
      <pagination
        style="text-align: right"
        :limit.sync="paramsData.pageSize"
        :page.sync="paramsData.pageNo"
        @pagination="getListFromPage"
        v-show="total > 10"
        :total="total"
      />
    </div>
  </div>
</template>
<script>
import Breadcrumb from "@/components/Breadcrumb";
import Pagination from "@/components/Pagination";
import { mapState } from "vuex";
import {
  _getOrgBranchList,
  _getOrgBranchAreaList,
  _orgBranchDel,
} from "@/services/home";
export default {
  name: "OutletsManage",
  data() {
    return {
      isLoading: false,
      paramsData: {
        areaId: "0",
        name: "",
        areaManagerName: "",
        pageNo: 1,
        pageSize: 10,
        phone: "",
        projectId: "",
      },
      total: 0,
      listData: [],
      branchAreaList: [],
    };
  },
  computed: {
    ...mapState({
      projectId: (state) => state.projectInfo.projectId,
    }),
  },
  components: {
    Breadcrumb,
    Pagination,
  },
  mounted() {
    this.paramsData.projectId = this.projectId;
    this.getBranchList();
    this.getOrgBranchAreaList(this.projectId);
    if (this.$route.params.id) {
      this.paramsData.areaId = this.$route.params.id;
    }
  },
  methods: {
    getBranchList() {
      _getOrgBranchList(this.paramsData).then((res) => {
        if (res.code == 1) {
          this.listData = res.data.list;
          this.total = res.data.total;
          this.isLoading = false;
           if (this.listData.length == 0 && this.paramsData.pageNo != 1) {
            this.paramsData.pageNo--;
            this.getBranchList();
          }
        } else {
          this.$message({ message: res.msg, type: "warning" });
        }
      });
    },
    getOrgBranchAreaList(id) {
      _getOrgBranchAreaList(id).then((res) => {
        this.branchAreaList = [
          {
            id: "0",
            name: "全部",
          },
        ];
        this.branchAreaList.push(...res.data);
      });
    },
    toAddOutlets() {
      let params = {
        isEdit: false,
      };
      this.pushTo("OutletsInfo", params);
    },
    searchList() {
      this.isLoading = true;
      this.paramsData.pageNo = 1;
      this.getBranchList();
    },
    editItem(row, index) {
      let params = {
        isEdit: true,
        id: row.id,
      };
      this.pushTo("OutletsInfo", params);
    },
    getListFromPage(val) {
      this.paramsData.pageNo = val.page;
      this.paramsData.pageSize = val.limit;
      this.getBranchList();
    },
    delItem(row, index) {
      let _this = this;
      this.$confirm("确定删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "",
      })
        .then(() => {
          _orgBranchDel(row.id).then((res) => {
            if (res.code == 1) {
              this.getBranchList();
              this.$message({
                type: "success",
                message: "删除成功!",
              });
            } else {
              this.$message({ message: res.msg, type: "warning" });
            }
          });
        })
        .catch(() => {});
    },
  },
};
</script>
<style lang="less">
.top_head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 30px;
  .inputs {
    display: flex;
    align-items: center;
  }
  .input_group {
    display: flex;
    align-items: center;

    > p {
      text-align: right;
      width: 80px;
      font-size: 14px;
      margin-right: 20px;
    }
    .text_input {
      width: 120px;
    }
  }
}
.table_container {
  border-radius: 6px;
  background: #ffffff;
  padding: 20px 0;
  margin: 20px;
  .table_head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #f2f2f2;
    padding: 0 20px 20px 20px;
    > h3 {
      font-size: 16px;
    }
  }
}
.table_padding {
  padding: 20px;
}
</style>