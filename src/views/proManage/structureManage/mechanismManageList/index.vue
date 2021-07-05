<template>
  <div v-loading="isLoading">
    <div class="common-container">
      <breadcrumb id="breadcrumb-container" class="breadcrumb-container" />
      <div class="top_head">
        <div class="inputs">
          <div class="input_group">
            <p>姓名</p>
            <el-input
              class="text_input"
              size="medium"
              v-model="dataParams.name"
              placeholder="请输入内容"
            ></el-input>
          </div>
          <div class="input_group">
            <p>手机</p>
            <el-input
              class="text_input"
              size="medium"
              v-model="dataParams.phone"
              placeholder="请输入内容"
            ></el-input>
          </div>
          <div class="input_group">
            <p>身份</p>
            <el-select
              class="sel_input"
              size="medium"
              v-model="dataParams.type"
              placeholder="请选择"
            >
              <el-option
                v-for="(item,index) in identityList"
                :key="index"
                :label="item.value"
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
        <h3>机构负责人列表</h3>
        <el-button size="medium" @click="toAddOutlets" type="primary"
          >添加员工</el-button
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
          <el-table-column align="center" prop="name" label="员工姓名">
          </el-table-column>
          <el-table-column align="center" prop="phone" label="手机">
          </el-table-column>
          <el-table-column
            align="center"
            prop="orgName"
            label="所属机构"
          >
          </el-table-column>
          <el-table-column align="center" prop="typeStr" label="身份">
          </el-table-column>
          <el-table-column align="center" prop="manageArea" label="负责区域">
          </el-table-column>
          <el-table-column width="180" align="center" label="操作">
            <template slot-scope="{ row, $index }">
              <el-button @click="editItem(row, $index)" size="mini"
                >修改</el-button
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
        :limit.sync="dataParams.pageSize"
        :page.sync="dataParams.pageNo"
        @pagination="getListFromPage"
        v-show="100 > 0"
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
  _getIdentityList,
  _getOrgEmployeeList,
  _orgEmployeeDel,
} from "@/services/home";
import { _idTypeStr } from "@/api/common";
export default {
  name: "MechanismManageList",
  data() {
    return {
      isLoading: false,
      dataParams: {
        name: "",
        pageNo: 1,
        pageSize: 10,
        phone: "",
        projectId: "",
        type: 0,
      },
      total: 0,
      value: "",
      identityList: [],
      listData: [],
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
    this.isLoading = true;
    this.dataParams.projectId = this.projectId;
    this.getIdentityList();
    this.getDataList();
  },
  methods: {
    getIdentityList() {
      _getIdentityList().then((res) => {
        this.identityList = [
          {
            id: 0,
            value: "全部",
          },
        ];
        this.identityList.push(...res.data);
      });
    },
    getDataList() {
      _getOrgEmployeeList(this.dataParams).then((res) => {
        if (res.code == 1) {
          res.data.list.forEach((val) => {
            val.typeStr = _idTypeStr(val.type);
          });
          this.listData = res.data.list;
          this.total = res.data.total;
          this.isLoading = false;
          if (this.listData.length == 0 && this.dataParams.pageNo != 1) {
            this.dataParams.pageNo--;
            this.getDataList();
          }
        } else {
          this.$message({ message: res.msg, type: "warning" });
        }
      });
    },
    searchList() {
      this.isLoading = true;
      this.dataParams.pageNo = 1;
      this.getDataList();
    },
    toAddOutlets() {
      let params = {
        isEdit: false,
      };
      this.pushTo("MechanismDetail", params);
    },
    getListFromPage(val) {
      this.dataParams.pageNo = val.page;
      this.dataParams.pageSize = val.limit;
      this.getDataList();
    },
    editItem(item, index) {
      let params = {
        isEdit: true,
        id: item.id,
      };
      this.pushTo("MechanismDetail", params);
    },
    delItem(row, index) {
      let _this = this;
      this.$confirm("确定删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "",
      })
        .then(() => {
          _orgEmployeeDel(row.id).then((res) => {
            if (res.code == 1) {
              this.getDataList();
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
      width: 130px;
    }
    .sel_input {
      width: 200px;
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