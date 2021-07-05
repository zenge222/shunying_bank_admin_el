<template>
  <div>
    <div class="common-container">
      <breadcrumb id="breadcrumb-container" class="breadcrumb-container" />
      <div class="top_head">
        <div class="inputs">
          <div class="input_group">
            <p>用户账号</p>
            <el-input
              class="text_input"
              size="medium"
              placeholder="请输入内容"
            ></el-input>
          </div>
          <!-- <div class="input_group">
            <p>工号</p>
            <el-input
              class="text_input"
              size="medium"
              placeholder="请输入内容"
            ></el-input>
          </div> -->
        </div>
        <el-button size="medium" type="primary" icon="el-icon-search"
          >搜索</el-button
        >
      </div>
    </div>

    <div class="table_container">
      <div class="table_head">
        <h3>用户列表</h3>
        <el-button
          size="medium"
          @click="addUserPop"
          type="primary"
          v-text="'添加用户'"
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
          <el-table-column align="center" prop="username" label="用户账号">
          </el-table-column>
          <el-table-column align="center" prop="nickName" label="昵称">
          </el-table-column>
          <el-table-column align="center" prop="id" label="头像">
            <template slot-scope="{ row }">
              <img class="user_head" :src="row.baseUrl + row.profile" alt="" />
            </template>
          </el-table-column>
          <!-- <el-table-column align="center" prop="roleName" label="角色">
          </el-table-column> -->
          <el-table-column align="center" width="260" label="操作">
            <template slot-scope="{ row, $index }">
              <div class="handle_group">
                <el-button
                  type="success"
                  @click.native="editUser(row)"
                  size="mini"
                  >编辑</el-button
                >
                <el-button @click.native="changePwd(row)" size="mini"
                  >修改密码</el-button
                >
                <el-button
                  type="danger"
                  @click.native="delUser(row.id)"
                  size="mini"
                  >删除</el-button
                >
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <pagination
        style="text-align: right"
        v-show="total > 0"
        :total="total"
        :limit="queryForm.pageSize"
        :page="queryForm.pageNo"
        @pagination="resetData"
      />
    </div>

    <!-- 详情 -->
    <el-dialog
      custom-class="dialog_min_width"
      :title="isAdd ? '添加' : '修改'"
      :lock-scroll="false"
      :visible.sync="detailShow"
      :close-on-click-modal="false"
      width="50%"
      center
    >
      <div class="pop_content">
        <div class="pop_item">
          <p><span v-if="isAdd">*</span>用户账号</p>
          <!--     readonly="true" -->
          <el-input
            class="pop_input"
            :disabled="!isAdd"
            v-model="fromParams.username"
            size="medium"
            placeholder="请输入用户账号"
          ></el-input>
        </div>
        <div class="pop_item" v-show="isAdd">
          <p><span>*</span>登录密码</p>
          <el-input
            class="pop_input"
            v-model="fromParams.password"
            size="medium"
            placeholder="请输入登录密码"
          ></el-input>
        </div>
        <div class="pop_item">
          <p><span>*</span>昵称</p>
          <el-input
            class="pop_input"
            v-model="fromParams.nickName"
            size="medium"
            placeholder="请输入昵称"
          ></el-input>
        </div>

        <div class="pop_item">
          <p>角色权限配置</p>
          <el-select
            style="flex: 1"
            v-model="roleIds"
            multiple
            filterable
            default-first-option
            placeholder="添加角色"
          >
            <el-option
              v-for="item in jurisdictionData"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </div>
        <div class="pop_item pop_item2">
          <p>部门权限配置</p>
          <el-tree
            style="flex: 1"
            show-checkbox
            :data="treeDate"
            default-expand-all
            node-key="id"
            :default-checked-keys="defaultCheck"
            ref="tree"
            :check-strictly="true"
            :expand-on-click-node="false"
            @check-change="handleCheckChange"
            @check="checkeTree"
          ></el-tree>
        </div>
        <!-- :before-upload="handleBeforeUpload" -->
        <div class="pop_item pop_item2">
          <p><span>*</span>头像</p>
          <el-upload
            class="avatar-uploader"
            action="#"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="handleBeforeUpload"
          >
            <img
              v-if="fromParams.profile"
              :src="fromParams.baseUrl + fromParams.profile"
              class="avatar"
            />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button
          size="medium"
          type="primary"
          @click="userSubmit"
          v-text="'确定'"
        ></el-button>
        <el-button
          size="medium"
          @click="detailShow = false"
          v-text="'取消'"
        ></el-button>
      </span>
    </el-dialog>
    <!-- 重新设定密码 -->
    <el-dialog
      custom-class="dialog_min_width"
      title="重新设定密码"
      :lock-scroll="false"
      :visible.sync="passwordShow"
      :close-on-click-modal="false"
      width="50%"
      center
    >
      <div class="pop_content">
        <div class="pop_item">
          <p><span>*</span>原密码</p>
          <el-input
            class="pop_input"
            size="medium"
            v-model="pwdParams.oldPassword"
            placeholder="请输入原密码"
          ></el-input>
        </div>
        <div class="pop_item">
          <p><span>*</span>新密码</p>
          <el-input
            class="pop_input"
            size="medium"
            v-model="pwdParams.newPassword"
            placeholder="请输入新密码"
          ></el-input>
        </div>
        <div class="pop_item">
          <p><span>*</span>确认密码</p>
          <el-input
            class="pop_input"
            size="medium"
            v-model="pwdParams.repeatNewPassword"
            placeholder="请输入确认密码"
          ></el-input>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button
          size="medium"
          type="primary"
          @click="submitPassword"
          v-text="'确定'"
        ></el-button>
        <el-button
          size="medium"
          @click="passwordShow = false"
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
  _menuUserList,
  _roleList,
  _departmentList,
  _userDelete,
  _userAddEdit,
  _changePassword,
} from "@/services/system";
import { _uploadPic } from "@/services/home";
export default {
  name: "UserManage",
  data() {
    return {
      roleIds: [],
      isAdd: true,
      detailShow: false,
      passwordShow: false,
      currentDate: [],
      queryForm: {
        pageNo: 1,
        pageSize: 10,
      },
      pwdParams: {
        id: "",
        oldPassword: "",
        newPassword: "",
        repeatNewPassword: "",
      },
      fromParams: {
        baseUrl: "",
        departmentIds: "",
        id: "",
        nickName: "",
        profile: "",
        password: "",
        roleIds: "",
        username: "",
      },
      total: 3,
      popShow: false,
      jurisdictionData: [],
      defaultCheck: [],
      treeDate: [],
      tableData: [],
    };
  },
  components: {
    Breadcrumb,
    Pagination,
  },
  created() {},
  mounted() {
    this.getList();
    this.getTreeList();
    this.getUserList();
  },
  methods: {
    // 角色
    getList() {
      let params = {
        pageNo: 1,
        pageSize: 9999,
      };
      _roleList(params).then((res) => {
        if (res.code == 1) {
          this.jurisdictionData = res.data.list;
          console.log(this.jurisdictionData);
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    // 部门
    getTreeList() {
      _departmentList().then((res) => {
        if (res.code == 1) {
          this.treeDate = res.data;
          console.log(this.treeDate);
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    getUserList() {
      _menuUserList(this.queryForm).then((res) => {
        if (res.code == 1) {
          this.tableData = res.data.list;
          this.total = res.data.total;
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    resetData(current) {
      this.queryForm.pageNo = current.page;
      this.queryForm.pageSize = current.limit;
      this.getUserList();
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      console.log(this.multipleSelection);
    },
    initParams() {
      let data1 = {
        baseUrl: "",
        departmentIds: "",
        id: "",
        nickName: "",
        profile: "",
        password: "",
        roleIds: "",
        username: "",
      };
      this.roleIds = [];
      if (this.$refs.tree) {
        this.$refs.tree.setCheckedKeys([]);
      }
      Object.assign(this.fromParams, data1);
    },
    addUserPop() {
      this.initParams();
      this.isAdd = true;
      this.detailShow = true;
    },
    editUser(row) {
      console.log(row);
      if (this.$refs.tree) {
        this.$refs.tree.setCheckedKeys([]);
      }
      let rIds = [];
      row.roleList.forEach((val) => {
        rIds.push(val.id);
      });
      let data1 = {
        baseUrl: row.baseUrl,
        departmentIds: row.departmentIds,
        id: row.id,
        nickName: row.nickName,
        profile: row.profile,
        roleIds: rIds.join(","),
        username: row.username,
      };
      this.isAdd = false;
      this.detailShow = true;
      this.roleIds = rIds;
      if (row.departmentIds) {
        this.defaultCheck = row.departmentIds.split(",");
        console.log(this.defaultCheck);
      }
      Object.assign(this.fromParams, data1);
    },
    changePwd(row) {
      this.pwdParams.id = row.id;
      this.pwdParams.oldPassword = "";
      this.pwdParams.newPassword = "";
      this.pwdParams.repeatNewPassword = "";
      this.passwordShow = true;
    },
    submitPassword() {
      console.log(this.pwdParams);
      if (this.pwdParams.oldPassword == "")
        return this.$message.warning("请输入原密码");
      if (this.pwdParams.newPassword == "")
        return this.$message.warning("请输入新密码");
      if (this.pwdParams.newPassword != this.pwdParams.repeatNewPassword)
        return this.$message.warning("确认密码与新密码不一致");
      _changePassword(this.pwdParams).then((res) => {
        if (res.code == 1) {
          this.$message({
            type: "success",
            message: "修改成功!",
          });
          this.passwordShow = false;
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    delUser(id) {
      console.log(123);
      this.$confirm("确定删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "",
      })
        .then(() => {
          _userDelete(id).then((res) => {
            if (res.code == 1) {
              this.$message({
                type: "success",
                message: "删除成功!",
              });
              this.getUserList();
            } else {
              this.$message.error(res.msg);
            }
          });
        })
        .catch(() => {});
    },
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
    },
    handleBeforeUpload(file) {
      this.picture = true;
      if (
        !(
          file.type === "image/png" ||
          file.type === "image/gif" ||
          file.type === "image/jpg" ||
          file.type === "image/jpeg"
        )
      ) {
        this.$message({
          message:
            "请上传格式为image/png, image/gif, image/jpg, image/jpeg的图片",
          type: "warning",
        });
        return;
      }
      let size = file.size / 1024 / 1024 / 2;
      if (size > 2) {
        this.$message({
          message: "图片大小必须小于2M",
          type: "warning",
        });
        return;
      }
      let fd = new FormData(); //通过form数据格式来传
      fd.append("filename", file); //传文件
      _uploadPic(fd).then((res) => {
        if (res.code == 1) {
          this.fromParams.baseUrl = res.data.baseUrl;
          this.fromParams.profile = res.data.key;
          // this.picture = false;
        } else {
          this.$message({ message: res.msg, type: "warning" });
          // this.picture = false;
        }
      });
    },
    /// 复选框
    handleCheckChange(data, checked, indeterminate) {
      let thisNode = this.$refs.tree.getNode(data.id);
      let keys = this.$refs.tree.getCheckedKeys(); // 获取已勾选节点的key值
      if (!checked) {
        let list1 = thisNode.data.children;
        console.log(list1);
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
        this.$refs.tree.setCheckedKeys(keys);
      }
    },
    checkeTree(data) {
      let thisNode = this.$refs.tree.getNode(data.id); // 获取当前节点
      const keys = this.$refs.tree.getCheckedKeys(); // 获取已勾选节点的key值
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
      this.$refs.tree.setCheckedKeys(keys); // 将所有keys数组的节点全选中
    },
    userSubmit() {
      if (this.isAdd) {
        if (this.fromParams.username == "")
          return this.$message.warning("请输入用户账号");
        if (this.fromParams.password == "")
          return this.$message.warning("请输入登录密码");
      }
      if (this.fromParams.nickName == "")
        return this.$message.warning("请输入昵称");
      if (this.fromParams.profile == "")
        return this.$message.warning("请上传头像");
      const keys = this.$refs.tree.getCheckedKeys(); // 获取已勾选节点的key值
      this.fromParams.departmentIds = keys.join(",");
      this.fromParams.roleIds = this.roleIds.join(",");
      _userAddEdit(this.fromParams).then((res) => {
        if (res.code == 1) {
          this.$message.success(res.msg);
          this.detailShow = false;
          this.getUserList();
        } else {
          this.$message.error(res.msg);
        }
      });
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
    width: 110px;
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
.pop_content::-webkit-scrollbar {
  display: none; // 重点
}
.pop_item2 {
  align-items: flex-start;
}
.user_head {
  width: 60px;
}
</style>
