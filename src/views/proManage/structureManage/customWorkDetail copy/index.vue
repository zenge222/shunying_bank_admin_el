<template>
  <div class="common-container" v-loading="isLoading">
    <breadcrumb id="breadcrumb-container" class="breadcrumb-container" />
    <div class="region">
      <div class="input_group">
        <p><span>*</span>工作标题</p>
        <el-input
          class="text_input"
          size="medium"
          placeholder="请输入内容"
        ></el-input>
      </div>

      <div class="input_group date_group">
        <p>日期</p>
        <el-row :gutter="0" class="date_list">
          <el-col
            @click.native="checkDate(item, index)"
            class="date_col"
            style="width: 14.28%"
            v-for="(item, index) in dateList"
            :key="index"
          >
            <p v-text="item.day"></p>
            <i v-show="item.check" class="date_check el-icon-success"></i>
          </el-col>
        </el-row>
      </div>

      <div class="input_group">
        <p style="width: initial">人员</p>
        <el-button size="small" type="primary ">添加</el-button>
      </div>
      <div class="input_group input_group2">
        <el-table
          :header-cell-style="{ background: '#F3F4F7', color: '#333333' }"
          :data="[1, 2]"
          border
          style="width: 100%"
        >
          <el-table-column align="center" prop="title" label="伦次编号">
            {{ index }}
          </el-table-column>
          <el-table-column align="center" prop="content" label="人员">
          </el-table-column>
          <el-table-column align="center" label="操作" width="180">
            <template slot-scope="{ row, $index }">
              <el-button size="small" type="warning">修改</el-button>
              <el-button size="mini" type="danger">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="input_group">
        <p style="width: initial">工作安排</p>
        <el-button size="small" type="primary ">添加</el-button>
      </div>
      <div class="input_group input_group2">
        <el-table
          :header-cell-style="{ background: '#F3F4F7', color: '#333333' }"
          :data="[1, 2]"
          border
          style="width: 100%"
        >
          <el-table-column align="center" prop="title" label="标题">
          </el-table-column>
          <el-table-column align="center" prop="content" label="工作时间">
          </el-table-column>
          <el-table-column align="center" prop="content" label="描述">
          </el-table-column>
          <el-table-column align="center" label="操作" width="180">
            <template slot-scope="{ row, $index }">
              <el-button size="small" type="warning">修改</el-button>
              <el-button size="mini" type="danger">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="footer_btns">
      <el-button size="medium" type="primary">提交</el-button>
    </div>

    <el-select
      v-model="value"
      multiple
      filterable
      remote
      reserve-keyword
      placeholder="请输入关键词"
      :remote-method="remoteMethod"
      :loading="loading"
      v-el-select-scroll="selectScroll"
    >
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      >
      </el-option>
    </el-select>

    <el-dialog
      title="工作安排"
      :lock-scroll="false"
      :visible.sync="addShow"
      :close-on-click-modal="false"
      width="50%"
      center
    >
      <div class="pop_content">
        <div class="dialog_item">
          <p>标题</p>
          <div class="flex1">
            <el-input
              style="width: 100%"
              size="medium"
              class="text_input"
              placeholder="请输入内容"
            ></el-input>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="medium">取 消</el-button>
        <el-button size="medium" type="primary">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import Breadcrumb from "@/components/Breadcrumb";
import { mapState } from "vuex";
export default {
  name: "CustomWorkDetail",
  data() {
    return {
      isLoading: false,
      dateList: [],
      addShow: false,
      isEdit: false,
      value: [],
      list: [],
      loading: false,
      states: [
        "Alabama",
        "Alaska",
        "Arizona",
        "Arkansas",
        "California",
        "Colorado",
        "Connecticut",
        "Delaware",
        "Florida",
        "Georgia",
        "Hawaii",
        "Idaho",
        "Illinois",
        "Indiana",
        "Iowa",
        "Kansas",
        "Kentucky",
        "Louisiana",
        "Maine",
        "Maryland",
        "Massachusetts",
        "Michigan",
        "Minnesota",
        "Mississippi",
        "Missouri",
        "Montana",
        "Nebraska",
        "Nevada",
        "New Hampshire",
        "New Jersey",
        "New Mexico",
        "New York",
        "North Carolina",
        "North Dakota",
        "Ohio",
        "Oklahoma",
        "Oregon",
        "Pennsylvania",
        "Rhode Island",
        "South Carolina",
        "South Dakota",
        "Tennessee",
        "Texas",
        "Utah",
        "Vermont",
        "Virginia",
        "Washington",
        "West Virginia",
        "Wisconsin",
        "Wyoming",
      ],
      options: createOptions(10),
      pageIndex: 0,
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
    let list = [];
    for (let i = 0; i < 31; i++) {
      let obj = { day: i + 1, check: false };
      list.push(obj);
    }
    this.dateList = list;
    
    this.list = this.states.map((item) => {
      return { value: `value:${item}`, label: `label:${item}` };
    });
  },
  methods: {
    checkDate(item, index) {
      item.check = !item.check;
    },
    selectScroll() {
      console.log("selectScroll");
      // Select 滚动到底部 执行该方法
      // 这里可以做一些懒加载之类的事情，eg：
      this.pageIndex++;
      this.options.push(...createOptions(10, 10 * this.pageIndex));
    },
    remoteMethod(query) {
      if (query !== "") {
        this.loading = true;
        setTimeout(() => {
          this.loading = false;
          this.options = this.list.filter((item) => {
            return item.label.toLowerCase().indexOf(query.toLowerCase()) > -1;
          });
        }, 200);
      } else {
        this.options = [];
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
    > span {
      font-size: 14px;
      padding: 0 10px;
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
.dialog_item {
  margin-top: 16px;
  display: flex;
  align-items: center;
  .el-input {
    width: inherit;
  }
  > p {
    text-align: left;
    font-size: 14px;
    width: 80px;
  }

  .flex1 {
    flex: 1;
    > span {
      font-size: 14px;
      padding: 0 10px;
    }
  }
}
.dialog_item2 {
  align-items: flex-start;
}
.region .date_group {
  display: flex;
  align-items: flex-start;
  .date_list {
    width: 600px;
    border-top: 1px solid #f0f0f0;
    border-left: 1px solid #f0f0f0;
    > .date_col {
      cursor: pointer;
      width: 14.28%;
      position: relative;
      border-right: 1px solid #f0f0f0;
      border-bottom: 1px solid #f0f0f0;
      padding: 10px 10px 30px 10px;
      .date_check {
        position: absolute;
        right: 5px;
        bottom: 5px;
        font-size: 20px;
        color: #409eff;
      }
    }
  }
}
</style>