<template>
  <div>
    <div class="common-container">
      <breadcrumb id="breadcrumb-container" class="breadcrumb-container" />
      <div class="top_head">
        <div class="inputs">
          <div class="input_group">
            <p>员工姓名</p>
            <el-input
              class="text_input"
              size="medium"
              v-model="queryForm.name"
              placeholder="请输入内容"
            ></el-input>
          </div>
          <div class="input_group">
            <p>手机</p>
            <el-input
              class="text_input"
              size="medium"
              v-model="queryForm.phone"
              placeholder="请输入内容"
            ></el-input>
          </div>
          <div class="input_group">
            <p>工号</p>
            <el-input
              class="text_input"
              size="medium"
              v-model="queryForm.workNo"
              placeholder="请输入内容"
            ></el-input>
          </div>
          <div class="input_group">
            <p>身份</p>
            <el-select
              clearable
              class="text_input"
              size="medium"
              v-model="queryForm.type"
              placeholder="请选择"
            >
              <el-option label="全部" :value="0"></el-option>
              <el-option
                v-for="item in typeList"
                :key="item.id"
                :label="item.value"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </div>
        </div>
        <el-button
          size="medium"
          type="primary"
          icon="el-icon-search"
          @click="init"
          >搜索
        </el-button>
      </div>
    </div>
    <div class="table_container">
      <div class="table_head">
        <h3>员工列表</h3>
        <el-button size="medium" @click="toAddShop" type="primary"
          >添加员工
        </el-button>
      </div>
      <div class="table_padding">
        <el-table
          :header-cell-style="{ background: '#F3F4F7', color: '#333333' }"
          :data="tableData"
          border
          style="width: 100%"
        >
          <el-table-column :width="60" align="center" label="id">
            <template slot-scope="{ $index }">
              <span v-text="$index + 1"></span>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="workNo" label="工号">
          </el-table-column>
          <el-table-column align="center" prop="name" label="员工名称">
          </el-table-column>
          <el-table-column align="center" prop="phone" label="手机">
          </el-table-column>
          <el-table-column align="center" prop="gender" label="性别">
            <template slot-scope="scope">
              {{
                scope.row.gender == 1
                  ? "男"
                  : scope.row.gender == 0
                  ? "女"
                  : "未知"
              }}
            </template>
          </el-table-column>
          <el-table-column align="center" prop="type" label="身份">
            <template slot-scope="scope">
              {{
                scope.row.type == 1
                  ? "银行(网点负责人)"
                  : scope.row.type == 2
                  ? "保洁员（驻点）"
                  : scope.row.type == 3
                  ? "保洁员（机动）"
                  : scope.row.type == 4
                  ? "领班"
                  : scope.row.type == 5
                  ? "主管"
                  : scope.row.type == 6
                  ? "区域经理"
                  : scope.row.type == 7
                  ? "银行(区域负责人)"
                  : scope.row.type == 8
                  ? "银行(项目负责人)"
                  : "维修工"
              }}
            </template>
          </el-table-column>
          <el-table-column width="240" label="操作" align="left">
            <template slot-scope="{ row, $index }">
              <el-button @click="editItem(row, $index)" size="mini"
                >编辑</el-button
              >
              <el-button
                size="mini"
                type="warning"
                @click="assessment(row)"
                v-if="row.type == 2 || row.type == 3 || row.type == 4"
                >考核</el-button
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
        v-show="total > 0"
        :page="queryForm.pageNo"
        :limit="queryForm.pageSize"
        :total="total"
        @pagination="resetTable"
      />
    </div>
    <add-and-edit-employee
      ref="addAndEditEmployee"
      @success="init"
    ></add-and-edit-employee>
  </div>
</template>
<script>
import Breadcrumb from "@/components/Breadcrumb";
import Pagination from "@/components/Pagination";
import addAndEditEmployee from "@/views/perManage/staffManage/components/addAndEditEmployee";
import {
  employeeList,
  getIdentity,
  delEmployee,
} from "../../../services/person";

export default {
  name: "RegionManage",
  data() {
    return {
      total: 0,
      typeList: [],
      queryForm: {
        pageNo: 1,
        pageSize: 10,
        name: "",
        phone: "",
        type: 0,
        workNo: "",
      },
      tableData: [],
    };
  },
  components: {
    Breadcrumb,
    Pagination,
    addAndEditEmployee,
  },
  mounted() {
    this.init();
    this.getIdentityList();
  },
  methods: {
    //获取身份列表
    getIdentityList() {
      getIdentity().then((res) => {
        // console.log(res)
        if (res.code == 1) {
          this.typeList = res.data;
        } else {
          this.$message({ type: "error", message: res.msg });
        }
      });
    },
    //获取员工列表
    init() {
      employeeList(this.queryForm).then((res) => {
        // console.log(res)
        if (res.code == 1) {
          this.tableData = res.data.list;
          this.total = res.data.total;
        } else {
          this.$message({ type: "error", message: res.msg });
        }
      });
    },
    //分页
    resetTable(current) {
      // console.log(current)
      this.queryForm.pageNo = current.page;
      this.queryForm.pageSize = current.limit;
      this.init();
    },
    //添加员工
    toAddShop() {
      this.$refs.addAndEditEmployee.visible = true;
      this.$refs.addAndEditEmployee.title = 1;
      setTimeout(() => {
        this.$refs.addAndEditEmployee.handleCancel();
      }, 50);
    },
    //修改员工
    editItem(row, $index) {
      this.$refs.addAndEditEmployee.visible = true;
      this.$refs.addAndEditEmployee.title = 2;
      setTimeout(() => {
        this.$refs.addAndEditEmployee.handleCancel();
        this.$refs.addAndEditEmployee.getDetail({ id: row.id });
      }, 50);
    },
    //删除员工
    delItem(row, index) {
      this.$confirm("确定删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "",
      })
        .then(() => {
          // console.log(row)
          delEmployee({ id: row.id }).then((res) => {
            // console.log(res)
            if (res.code == 1) {
              this.$message({
                type: "success",
                message: "删除成功!",
              });
              this.init();
            }
          });
        })
        .catch(() => {});
    },
    assessment(row) {
      this.pushTo("CleanAssessList", row);
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
