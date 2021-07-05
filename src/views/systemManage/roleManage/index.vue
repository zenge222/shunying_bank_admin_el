<template>
  <div>
    <!-- <div class="common-container">
      <breadcrumb id="breadcrumb-container" class="breadcrumb-container" />
      <div class="top_head">
        <div class="inputs">
          <div class="input_group">
            <p>角色名称</p>
            <el-input
              class="text_input"
              size="medium"
              v-model="queryForm.name"
              placeholder="请输入内容"
            ></el-input>
          </div>
        </div>
        <el-button size="medium" type="primary" icon="el-icon-search"
          >搜索</el-button
        >
      </div>
    </div> -->

    <div class="table_container">
      <div style="padding: 0 14px">
        <breadcrumb id="breadcrumb-container" class="breadcrumb-container" />
      </div>

      <div class="table_head">
        <h3>角色列表</h3>
        <el-button
          size="medium"
          @click="addRolePop"
          type="primary"
          v-text="'添加角色'"
        ></el-button>
      </div>

      <div class="table_padding">
        <el-table
          ref="multipleTable"
          tooltip-effect="dark"
          @selection-change="handleSelectionChange"
          :header-cell-style="{ background: '#F3F4F7', color: '#333333' }"
          :data="tableData"
          border
          style="width: 100%"
        >
          <!--  type="selection" -->
          <el-table-column :width="60" align="center" label="id">
            <template slot-scope="{ $index }">
              <span v-text="$index + 1"></span>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="name" label="角色名称">
          </el-table-column>
          <!-- <el-table-column align="center" prop="id" label="角色名称">
          </el-table-column> -->
          <!-- <el-table-column align="center" prop="id" label="创建时间">
          </el-table-column> -->
          <el-table-column align="center" width="200" label="操作">
            <!-- slot-scope="{ row, $index }" -->
            <template slot-scope="{ row, $index }">
              <div class="handle_group">
                <el-button
                  type="success"
                  @click.native="editRolePop(row)"
                  size="mini"
                  >编辑</el-button
                >
                <el-button
                  type="danger"
                  @click.native="delRole(row.id)"
                  size="mini"
                  >删除</el-button
                >
                <!-- <el-button type="success" @click.native="selMore(0)" size="mini"
                  >用户</el-button
                >
                <div class="handle_line"></div> -->
                <!-- <el-button type="info" @click.native="toAuthorize" size="mini"
                  >工单授权</el-button
                >
                <div class="handle_line"></div> -->
                <!-- <el-dropdown :hide-on-click="true">
                  <el-button size="mini" type="primary">
                    更多<i class="el-icon-arrow-down el-icon--right"></i>
                  </el-button>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item @click.native="selMore(0)"
                      >授权</el-dropdown-item
                    >
                    <el-dropdown-item @click.native="selMore(1)"
                      >编辑</el-dropdown-item
                    >
                    <el-dropdown-item @click.native="selMore(2)"
                      >删除</el-dropdown-item
                    >
                  </el-dropdown-menu>
                </el-dropdown> -->
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!--  :page.sync="formParams.page"
            :limit.sync="formParams.limit" -->
      <pagination
        style="text-align: right"
        v-show="total > 0"
        :total="total"
        :limit="fromParams.pageSize"
        :page="fromParams.pageNo"
        @pagination="resetData"
      />
    </div>

    <!-- 新增 -->
    <el-dialog
      custom-class="dialog_min_width"
      :title="isAdd ? '新增' : '修改'"
      :lock-scroll="false"
      :visible.sync="roleShow"
      :close-on-click-modal="false"
      width="50%"
      center
    >
      <div class="pop_content">
        <div class="pop_item">
          <p><span>*</span>角色名称</p>
          <el-input
            class="pop_input"
            v-model="roleParams.name"
            size="medium"
            placeholder="请输入配额"
          ></el-input>
        </div>
        <div class="pop_item pop_item2">
          <p>角色权限配置</p>
          <el-tree
            style="flex: 1"
            show-checkbox
            :data="jurisdictionData"
            default-expand-all
            node-key="id"
            :default-checked-keys="defaultCheck"
            ref="tree2"
            :check-strictly="true"
            :expand-on-click-node="false"
            @check-change="handleCheckChange2"
            @check="checkeTree"
          ></el-tree>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button
          size="medium"
          type="primary"
          @click="roleSubmit"
          v-text="'确定'"
        ></el-button>
        <el-button
          size="medium"
          @click="roleShow = false"
          v-text="'取消'"
        ></el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import Breadcrumb from "@/components/Breadcrumb";
import Pagination from "@/components/Pagination";
import {
  _roleList,
  _menuList,
  _roleAddEdit,
  _roleDelete,
} from "@/services/system";

export default {
  name: "RoleManage",
  data() {
    return {
      defaultCheck: [],
      isAdd: true,
      roleShow: false,
      currentDate: [],
      fromParams: {
        pageNo: 1,
        pageSize: 10,
      },
      total: 0,
      popShow: false,
      tableData: [],
      roleParams: {
        id: "",
        menuIds: "",
        name: "",
      },
      jurisdictionData: [],
    };
  },
  components: {
    Breadcrumb,
    Pagination,
  },
  created() {},
  mounted() {
    this.getMenuList();
    this.getList();
  },
  methods: {
    initData() {
      let data = {
        id: "",
        menuIds: "",
        name: "",
      };
      if (this.$refs.tree2) {
        this.$refs.tree2.setCheckedKeys([]);
      }
      Object.assign(this.roleParams, data);
    },
    getList() {
      _roleList(this.fromParams).then((res) => {
        if (res.code == 1) {
          this.tableData = res.data.list;
          this.total = res.data.total;
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    getMenuList() {
      _menuList().then((res) => {
        if (res.code == 1) {
          this.jurisdictionData = res.data;
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    /// 复选框
    handleCheckChange(data, checked, indeterminate) {
      data.select = checked;
      console.log(data, checked, indeterminate);
    },
    /// 复选框
    handleCheckChange2(data, checked, indeterminate) {
      let thisNode = this.$refs.tree2.getNode(data.id);
      let keys = this.$refs.tree2.getCheckedKeys(); // 获取已勾选节点的key值
      if (!checked) {
        let list1 = thisNode.data.children;
        if (list1.length > 0) {
          // 逐级遍历自己取id 重置keys
          list1.forEach((val) => {
            for (let i = 0; i < keys.length; i++) {
              if (keys[i] == val.id) {
                keys.splice(i, 1);
              }
            }
            if (val.children.length > 0) {
              val.children.forEach((val2) => {
                for (let j = 0; j < keys.length; j++) {
                  if (keys[j] == val2.id) {
                    keys.splice(j, 1);
                  }
                }
              });
            }
          });
        }
        this.$refs.tree2.setCheckedKeys(keys);
      }
    },
    checkeTree(data) {
      let thisNode = this.$refs.tree2.getNode(data.id); // 获取当前节点
      const keys = this.$refs.tree2.getCheckedKeys(); // 获取已勾选节点的key值
      if (thisNode.checked) {
        // 当前节点若被选中
        for (let i = thisNode.level; i > 1; i--) {
          // 判断是否有父级节点
          if (!thisNode.parent.checked) {
            // 父级节点未被选中，则将父节点替换成当前节点，往上继续查询，并将此节点key存入keys数组
            thisNode = thisNode.parent;
            keys.push(thisNode.data.id);
          }
        }
      }
      this.$refs.tree2.setCheckedKeys(keys); // 将所有keys数组的节点全选中
    },
    resetData(current) {
      this.fromParams.pageNo = current.page;
      this.fromParams.pageSize = current.limit;
      this.getList();
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      console.log(this.multipleSelection);
    },
    addRolePop() {
      this.isAdd = true;
      this.initData();
      this.roleShow = true;
    },
    editRolePop(item) {
      console.log(item);
      this.defaultCheck = item.menuIds.split(",");
      this.isAdd = false;
      this.roleShow = true;
      this.roleParams.id = item.id;
      this.roleParams.name = item.name;
    },
    delRole(id) {
      this.$confirm("确定删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "",
      })
        .then(() => {
          _roleDelete(id).then((res) => {
            if (res.code == 1) {
              this.$message({
                type: "success",
                message: "删除成功!",
              });
              this.showDetail = false;
              this.getList();
            } else {
              this.$message.error(res.msg);
            }
          });
        })
        .catch(() => {});
    },
    roleSubmit() {
      if (this.roleParams.name == "")
        return this.$message.warning("请输入角色名称");
      const keys = this.$refs.tree2.getCheckedKeys();
      this.roleParams.menuIds = keys.join(",");
      _roleAddEdit(this.roleParams).then((res) => {
        if (res.code == 1) {
          this.$message.success(res.msg);
          this.roleShow = false;
          this.getList();
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    toAuthorize() {
      this.authorizeShow = true;
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
.pop_item {
  display: flex;
  align-items: center;
  padding-top: 20px;
  > p {
    width: 120px;
    font-size: 14px;
    padding-right: 20px;
    text-align: right;
    > span {
      color: #f56c6c;
      padding: 3px 4px 0 0;
      font-size: 14px;
    }
  }
  .pop_input {
    flex: 1;
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
.handle_group {
  display: flex;
  justify-content: center;
  align-items: center;
  .handle_line {
    display: inline-block;
    width: 1px;
    height: 20px;
    background: #dddddd;
    margin: 0 10px;
  }
}

.table_padding {
  padding: 20px;
}

.pop_content {
       max-height: 500px;
  overflow-y: scroll;
  .pop_title {
    font-size: 14px;
    margin-bottom: 20px;

  }
}
.pop_item2 {
  align-items: start;
 
}
.pop_content::-webkit-scrollbar {
  display: none; // 重点
}
</style>
