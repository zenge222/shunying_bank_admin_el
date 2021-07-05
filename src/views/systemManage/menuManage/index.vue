<template>
  <div>
    <div class="table_container">
      <div style="padding-left: 10px">
        <breadcrumb id="breadcrumb-container" class="breadcrumb-container" />
      </div>
      <div class="table_head">
        <h3>菜单列表</h3>
        <el-button
          size="medium"
          @click="addUserPop"
          type="primary"
          v-text="'添加菜单'"
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
          <el-table-column :width="60" align="center" label="" type="expand">
            <template slot-scope="{ row, $index }">
              <el-table
                :show-header="false"
                :data="row.children"
                style="width: 100%"
              >
                <el-table-column :width="60" type="expand" prop="" label="">
                  <template slot-scope="{ row, $index }">
                    <el-table
                      :show-header="false"
                      :data="row.children"
                      style="width: 100%"
                    >
                      <el-table-column
                        :width="60"
                        type="expand"
                        prop="id"
                        label=""
                      >
                      </el-table-column>
                      <el-table-column align="right" prop="title" label="">
                      </el-table-column>
                      <el-table-column align="right" prop="path" label="">
                      </el-table-column>
                      <el-table-column align="right" prop="name" label="">
                      </el-table-column>
                      <el-table-column width="220" prop="id" label="">
                        <template slot-scope="{ row, $index }">
                          <div class="handle_group">
                            <!-- <el-button
                              type="success"
                              @click.native="addSubMenu(row)"
                              size="mini"
                              >添加</el-button
                            > -->
                            <el-button @click.native="editMenu(row)" size="mini"
                              >编辑</el-button
                            >
                            <el-button
                              type="danger"
                              @click.native="delMenu(row.id)"
                              size="mini"
                              >删除</el-button
                            >
                          </div>
                        </template>
                      </el-table-column>
                    </el-table>
                  </template>
                </el-table-column>
                <el-table-column align="center" prop="title" label="">
                </el-table-column>
                <el-table-column align="center" prop="path" label="">
                </el-table-column>
                <el-table-column align="center" prop="name" label="">
                </el-table-column>

                <el-table-column width="220" prop="id" label="">
                  <template slot-scope="{ row, $index }">
                    <div class="handle_group">
                      <el-button
                        type="success"
                        @click.native="addSubMenu(row)"
                        size="mini"
                        >添加</el-button
                      >
                      <el-button @click.native="editMenu(row)" size="mini"
                        >编辑</el-button
                      >
                      <el-button
                        type="danger"
                        @click.native="delMenu(row.id)"
                        size="mini"
                        >删除</el-button
                      >
                    </div>
                  </template>
                </el-table-column>
              </el-table>
            </template>
          </el-table-column>
          <el-table-column align="left" prop="title" label="菜单名称">
          </el-table-column>
          <el-table-column align="left" prop="path" label="路径">
          </el-table-column>
          <el-table-column align="left" prop="name" label="组件名称">
          </el-table-column>
          <el-table-column align="left" width="220" label="操作">
            <!-- slot-scope="{ row, $index }" -->
            <template slot-scope="{ row, $index }">
              <div class="handle_group">
                <el-button
                  type="success"
                  @click.native="addSubMenu(row)"
                  size="mini"
                  >添加</el-button
                >
                <el-button @click.native="editMenu(row)" size="mini"
                  >编辑</el-button
                >
                <el-button
                  type="danger"
                  @click.native="delMenu(row.id)"
                  size="mini"
                  >删除</el-button
                >
                <!-- <el-dropdown :hide-on-click="true">
                  <el-button size="mini" type="primary">
                    更多<i class="el-icon-arrow-down el-icon--right"></i>
                  </el-button>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item @click.native="selMore(0)"
                      >详情</el-dropdown-item
                    >
                    <el-dropdown-item @click.native="selMore(1)"
                      >密码</el-dropdown-item
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
      <!-- <pagination
        style="text-align: right"
        v-show="total > 0"
        :total="total"
        :limit="queryForm.pageSize"
        :page="queryForm.pageNo"
        @pagination="resetData"
      /> -->
    </div>

    <!-- 详情 -->
    <el-dialog
      custom-class="dialog_min_width"
      :title="isAdd ? '新增' : '编辑'"
      :lock-scroll="false"
      :visible.sync="detailShow"
      :close-on-click-modal="false"
      width="50%"
      center
    >
      <div class="pop_content">
        <div class="pop_item">
          <p><span>*</span>菜单标题</p>
          <el-input
            class="pop_input"
            size="medium"
            v-model="fromParams.title"
            placeholder="请输入标题"
          ></el-input>
        </div>
        <div class="pop_item">
          <p><span>*</span>前端组件</p>
          <el-input
            class="pop_input"
            v-model="fromParams.component"
            size="medium"
            placeholder="请输入前端组件"
          ></el-input>
        </div>
        <div class="pop_item">
          <p><span></span>菜单路径</p>
          <el-input
            class="pop_input"
            v-model="fromParams.path"
            size="medium"
            placeholder="请输入路径"
          ></el-input>
        </div>
        <div class="pop_item">
          <p><span></span>组件名称</p>
          <el-input
            class="pop_input"
            v-model="fromParams.name"
            size="medium"
            placeholder="请输入组件名称"
          ></el-input>
        </div>

        <div class="pop_item">
          <p><span></span>默认跳转</p>
          <el-input
            class="pop_input"
            size="medium"
            v-model="fromParams.redirect"
            placeholder="请输入默认跳转"
          ></el-input>
        </div>
        <!-- <div class="pop_item">
          <p><span>*</span>排序</p>
          <el-input
            class="pop_input"
            oninput="value=value.replace(/[^\d]/g,'')"
            size="medium"
            placeholder="请输入配额"
          ></el-input>
        </div> -->
        <div class="pop_item">
          <p><span></span>隐藏路由</p>
          <el-switch v-model="hidden"> </el-switch>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button
          size="medium"
          type="primary"
          @click="detailSubmit"
          v-text="'确定'"
        ></el-button>
        <el-button
          size="medium"
          @click="detailShow = false"
          v-text="'取消'"
        ></el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import Breadcrumb from "@/components/Breadcrumb";
import Pagination from "@/components/Pagination";
import { _menuList, _menuAddEdit, _menuDelete } from "@/services/system";

export default {
  name: "MenuManage",
  data() {
    return {
      isAdd: true,
      hidden: false,
      fromParams: {
        alwaysShow: 1,
        hidden: 0,
        title: "",
        component: "",
        icon: "",
        id: 0,
        menuName: "",
        name: "",
        parentId: 0,
        path: "",
        redirect: "",
      },

      value: false,
      radio: 0,
      detailShow: false,
      passwordShow: false,
      currentDate: [],
      queryForm: {
        pageNo: 1,
        pageSize: 10,
      },
      total: 3,
      popShow: false,
      tableData: [],
    };
  },
  components: {
    Breadcrumb,
    Pagination,
  },
  created() {},
  mounted() {
    this.getMenuList();
  },
  methods: {
    getMenuList() {
      _menuList().then((res) => {
        if (res.code == 1) {
          this.tableData = res.data;
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    resetData() {},
    handleSelectionChange(val) {
      this.multipleSelection = val;
      console.log(this.multipleSelection);
    },
    initData() {
      this.hidden = false;
      let data = {
        alwaysShow: 0,
        hidden: 0,
        title: "",
        component: "",
        icon: "",
        id: "",
        menuName: "",
        name: "",
        parentId: 0,
        path: "",
        redirect: "",
      };
      Object.assign(this.fromParams, data);
    },
    addUserPop() {
      this.isAdd = true;
      this.initData();
      console.log("addMenu:" + this.fromParams.parentId);
      this.detailShow = true;
    },
    addSubMenu(item) {
      this.isAdd = true;
      this.initData();
      this.fromParams.parentId = item.id;
      console.log("addSubMenu:" + this.fromParams.parentId);
      this.detailShow = true;
    },
    detailSubmit() {
      if (this.fromParams.title == "")
        return this.$message.warning("请输入标题");
      if (this.fromParams.component == "")
        return this.$message.warning("请输入前端组件");
      this.fromParams.hidden = this.hidden ? 1 : 0;
      if (this.fromParams.parentId == "")
        return this.$message.error("parentId:" + this.fromParams.parentId);
      _menuAddEdit(this.fromParams).then((res) => {
        if (res.code == 1) {
          this.$message.success(res.msg);
          this.detailShow = false;
          // this.getMenuList();
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    editMenu(item) {
      this.fromParams = item;
      this.isAdd = false;
      this.hidden = item.hidden == 1 ? true : false;
      this.detailShow = true;
    },
    delMenu(id) {
      this.$confirm("确定删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "",
      })
        .then(() => {
          _menuDelete(id).then((res) => {
            if (res.code == 1) {
              this.getMenuList();
              this.$message.success(res.msg);
            } else {
              this.$message.error(res.msg);
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
  }
}
.pop_item {
  display: flex;
  align-items: center;
  padding-top: 20px;
  > p {
    width: 100px;
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
  .pop_title {
    font-size: 14px;
    margin-bottom: 20px;
  }
}
</style>
