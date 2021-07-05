<template>
  <div class="common-container" v-loading="isLoading">
    <breadcrumb id="breadcrumb-container" class="breadcrumb-container" />
    <div class="region">
      <div class="input_group">
        <p><span>*</span>区域名称</p>
        <el-input
          class="text_input"
          size="medium"
          v-model="paramsData.name"
          placeholder="请输入内容"
        ></el-input>
      </div>
      <div class="input_group">
        <p><span>*</span>区域经理</p>
        <el-select
          class="text_input"
          size="medium"
          v-model="paramsData.areaManagerId"
          placeholder="请选择"
        >
          <el-option
            v-for="item in managerList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </div>
      <div class="input_group input_group2">
        <p>下辖网点</p>
        <el-table
          :header-cell-style="{ background: '#F3F4F7', color: '#333333' }"
          :data="paramsData.orgBranchVOList"
          border
          style="width: 100%"
        >
          <el-table-column align="center" prop="name" label="网点名称">
          </el-table-column>
          <el-table-column align="center" label="操作" width="180">
            <template slot-scope="{ row, $index }">
              <el-button @click="delItem(row, $index)" size="mini" type="danger"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="footer_btns">
      <el-button @click="submitDetail" size="medium" type="primary"
        >提交</el-button
      >
    </div>
  </div>
</template>
<script>
import Breadcrumb from "@/components/Breadcrumb";
import {
  _areaDetail,
  _areaManagerListDetail,
  _areaUpdate,
  _areaAdd,
} from "@/services/home";
import { mapState } from "vuex";
export default {
  name: "RegionInfo",
  data() {
    return {
      isEdit: false,
      isLoading: false,
      paramsData: {
        areaManagerId: "",
        areaManagerName: "",
        areaManagerPhone: "",
        id: 0,
        name: "",
        orgBranchVOList: [],
        projectId:0
      },
      managerList: [],

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
  computed: {
    ...mapState({
      projectId: (state) => state.projectInfo.projectId,
    }),
  },
  components: {
    Breadcrumb,
  },
  mounted() {
    this.paramsData.projectId = this.projectId;
    this.isEdit = this.$route.params.isEdit;
    this.getManagerList();
    if (this.isEdit) {
      this.isLoading = true;
      this.paramsData.id = this.$route.params.id;
      _areaDetail(this.paramsData.id).then((res) => {
        if (res.code == 1) {
          this.paramsData = res.data;
          this.isLoading = false;
        } else {
          this.$message({ message: res.msg, type: "warning" });
        }
      });
      return;
    } else {
    }
  },
  methods: {
    getManagerList() {
      _areaManagerListDetail().then((res) => {
        if (res.code == 1) {
          this.managerList = res.data;
        } else {
          this.$message({ message: res.msg, type: "warning" });
        }
      });
    },
    delItem(row, index) {
      let _this = this;
      this.$confirm("确定删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "",
      })
        .then(() => {
          _this.paramsData.orgBranchVOList.splice(index, 1);
        })
        .catch(() => {});
    },
    submitDetail() {
      if (this.paramsData.name == "")
        return this.$message({ type: "warning", message: "请输入区域名称" });
      if (this.paramsData.areaManagerId == "")
        return this.$message({ type: "warning", message: "请选择区域经理" });
      this.managerList.forEach((val) => {
        if (val.id == this.paramsData.areaManagerId) {
          this.paramsData.areaManagerName = val.name;
          this.paramsData.areaManagerPhone = val.phone;
          return;
        }
      });
      if (this.isEdit) {
        _areaUpdate(this.paramsData).then((res) => {
          if (res.code == 1) {
            this.$router.go(-1);
            this.$message({ message: "修改成功", type: "success" });
          } else {
            this.$message({ message: res.msg, type: "warning" });
          }
        });
        return;
      } else {
        _areaAdd(this.paramsData).then((res) => {
          if (res.code == 1) {
            this.$router.go(-1);
            this.$message({ message: "添加成功", type: "success" });
          } else {
            this.$message({ message: res.msg, type: "warning" });
          }
        });
      }
    },
  },
};
</script>
<style lang="less">
.region {
  .input_group {
    margin-top: 20px;
    display: flex;
    align-items: center;

    > p {
      text-align: right;
      width: 70px;
      font-size: 14px;
      margin-right: 20px;
      > span {
        color: #f56c6c;
        padding: 3px 4px 0 0;
        font-size: 14px;
      }
    }
    .text_input {
      width: 200px;
    }
  }
  .input_group2 {
    align-items: flex-start;
    > p {
      padding-top: 20px;
    }
  }
}
.footer_btns {
  margin-top: 40px;
  display: flex;
  justify-content: left;
}
</style>