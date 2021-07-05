<template>
  <div>
    <div class="common-container">
      <breadcrumb id="breadcrumb-container" class="breadcrumb-container" />
      <!-- <div class="top_head">
        <div class="inputs">
          <div class="input_group">
            <p>部门名称</p>
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
      </div> -->

      <div class="tree_container">
        <el-button
          size="medium"
          style="margin-bottom: 10px"
          @click="addDearrtment(0)"
          type="primary"
          >添加部门</el-button
        >
        <el-button
          v-if="addSub"
          size="medium"
          style="margin-bottom: 10px"
          type="primary"
          @click="addDearrtment(1)"
          >添加子部门</el-button
        >
        <div class="tree_group">
          <div class="tree_box">
            <!-- <el-tree
              :props="props"
              :load="loadNode"
              lazy
              :highlight-current="true"
              :expand-on-click-node="false"
              :check-strictly="true"
              show-checkbox
              @check-change="handleCheckChange"
              @node-click="handleBucketClick"
            >
            </el-tree> -->
            <!--    show-checkbox -->
            <el-tree
              :data="treeDate"
              default-expand-all
              node-key="id"
              ref="tree"
              highlight-current
              :expand-on-click-node="false"
              :check-strictly="true"
              @check-change="handleCheckChange"
              @node-click="handleBucketClick"
            >
              <span class="custom-tree-node" slot-scope="{ node, data }">
                <span>{{ node.label }}</span>
                <span>
                  <!-- <el-button
                    type="text"
                    size="mini"
                    @click="() => append(data)"
                  >
                    Append
                  </el-button> -->
                </span>
                <el-button
                  style="margin-left: 50px"
                  type="text"
                  size="mini"
                  @click="remove(node, data)"
                >
                  删除
                </el-button>
              </span>
            </el-tree>
          </div>
          <div class="tree_detail" v-if="showDetail">
            <div class="input_group">
              <p>部门名称</p>
              <el-input
                size="medium"
                v-model="fromParams.name"
                placeholder="请输入内容"
              ></el-input>
            </div>
            <div class="detail_tree">
              <el-tree
                show-checkbox
                :data="detailData.menus"
                default-expand-all
                node-key="id"
                :default-checked-keys="defaultCheck"
                ref="tree2"
                :check-strictly="true"
                :expand-on-click-node="false"
                @check-change="handleCheckChange2"
                @check="checkeTree"
              ></el-tree>
              <!-- -->
            </div>
            <div class="save_btn">
              <el-button @click="saveDetail" type="primary" size="small">
                保存
              </el-button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 新增 -->
    <el-dialog
      custom-class="dialog_min_width"
      :title="'新增'"
      :lock-scroll="false"
      :visible.sync="popShow1"
      :close-on-click-modal="false"
      width="50%"
      center
    >
      <div class="pop_content">
        <div class="pop_item">
          <p><span>*</span>部门名称</p>
          <el-input
            class="pop_input"
            size="medium"
            v-model="addParams.name"
            placeholder="请输入部门"
          ></el-input>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button
          size="medium"
          type="primary"
          @click="addDep"
          v-text="'确定'"
        ></el-button>
        <el-button
          size="medium"
          @click="popShow1 = false"
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
  _departmentList,
  _departmentDetail,
  _departmentDelete,
  _departmentAddEdit,
} from "@/services/system";

export default {
  name: "RoleManage",
  data() {
    return {
      defaultCheck: [],
      showDetail: false,
      level: 0, // 层数
      departmentId: 0,
      addSub: false,

      addParams: {
        name: "",
        parentId: 0, // 顶层部门传0
      },

      fromParams: {
        id: "",
        menuIds: "", // 菜单id集合（逗号分隔）
        name: "",
        parentId: 0, // 顶层部门传0
      },

      // 详情数据
      detailData: {},
      currentId: "",

      radio: 0,
      popShow1: false,
      currentDate: [],
      queryForm: {
        pageNo: 1,
        pageSize: 10,
      },
      total: 3,
      popShow: false,
      treeDate: [],
      props: {
        children: "children",
        label: "label",
        id: "id",
      },
      count: 1,
    };
  },
  components: {
    Breadcrumb,
    Pagination,
  },
  created() {},
  mounted() {
    this.getTreeList();
  },
  methods: {
    getTreeList() {
      _departmentList().then((res) => {
        if (res.code == 1) {
          this.treeDate = res.data;
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    addDearrtment(num) {
      this.addParams.name = "";
      // this.isAdd = true;
      if (num == 0) {
        this.addParams.parentId = 0;
        this.popShow1 = true;
      } else {
        if (this.level == 3) return this.$message.warning("最多添加3级");
        this.popShow1 = true;
      }
    },
    /// 点击节点
    handleBucketClick(item, node) {
      console.log(123);
      this.addParams.parentId = item.id;
      this.addSub = true;
      // 重置父级id
      this.fromParams.parentId = 0;
      // let idList = [];
      this.showDetail = true;
      // 层级
      this.level = node.level;
      // 当前部门id
      this.fromParams.id = item.id;
      // idList.push(item.id);
      if (node.parent) {
        if (node.parent.data.id) {
          // 父级id
          this.fromParams.parentId = node.parent.data.id;
          // idList.push(node.parent.data.id);
          // if (node.parent.parent) {
          //   if (node.parent.parent.data.id) {
          //     idList.push(node.parent.parent.data.id);
          //   }
        }
      }
      // }
      // id集合（逗号分隔）
      // this.fromParams.menuIds = idList.join(",");
      // 请求详情
      this.getDetail();
    },
    getDetail() {
      _departmentDetail(this.fromParams.id).then((res) => {
        if (res.code == 1) {
          // console.log(this.fromParams);
          // 当前部门id
          this.fromParams.name = res.data.label;
          this.detailData = res.data;
          this.$refs.tree2.setCheckedKeys([]);
          if (res.data.menuIds) {
            this.defaultCheck = res.data.menuIds.split(",");
          }
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
        // console.log(list1);
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
    addDep() {
      if (this.addParams.name == "")
        return this.$message.warning("请输入部门名称");
      _departmentAddEdit(this.addParams).then((res) => {
        if (res.code == 1) {
          this.getTreeList();
        } else {
          this.$message.error(res.msg);
        }
      });
      this.popShow1 = false;
    },
    remove(node, data) {
      const parent = node.parent;
      const children = parent.data.children || parent.data;
      const index = children.findIndex((d) => d.id === data.id);
      this.$confirm("确定删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "",
      })
        .then(() => {
          _departmentDelete(data.id).then((res) => {
            if (res.code == 1) {
              this.$message({
                type: "success",
                message: "删除成功!",
              });
              this.showDetail = false;
              this.getTreeList();
            } else {
              this.$message.error(res.msg);
            }
          });
        })
        .catch(() => {});
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      console.log(this.multipleSelection);
    },
    addRolePop() {
      this.roleShow = true;
    },
    toAuthorize() {
      this.authorizeShow = true;
    },
    selMore(e) {
      switch (e) {
        case 0:
          this.detailShow = true;
          break;
        case 1:
          this.roleShow = true;
          break;
        case 2:
          this.$confirm("确定删除?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "",
          })
            .then(() => {
              this.$message({
                type: "success",
                message: "删除成功!",
              });
              //   this.settingInfo.cleanerAssessConfigVOList.splice(index, 1);
            })
            .catch(() => {});
          break;

        default:
          break;
      }
    },
    saveDetail() {
      const keys = this.$refs.tree2.getCheckedKeys();
      this.fromParams.menuIds = keys.join(",");
      if (this.fromParams.name == "")
        return this.$message.warning("请输入部门名称");
      _departmentAddEdit(this.fromParams).then((res) => {
        if (res.code == 1) {
          this.$message.success(res.msg);
          this.getTreeList();
        } else {
          this.$message.error(res.msg);
        }
      });
    },
  },
};
</script>
<style lang="less">
.tree_container {
  padding: 20px 10px;
}
.top_head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 30px;

  .inputs {
    display: flex;
    align-items: center;
  }
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
.pop_item2 {
  align-items: flex-start;
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
  .pop_title {
    font-size: 14px;
    margin-bottom: 20px;
  }
}
.tree_group {
  display: flex;
  .tree_box {
    flex: 1;
  }
  .tree_detail {
    flex: 1;
    padding: 0 20px;
  }
}
.detail_tree {
  padding-top: 20px;
  flex: 1;
}
.save_btn {
  display: flex;
  justify-content: flex-end;
}
</style>
