<template>
  <div class="common-container">
    <breadcrumb id="breadcrumb-container" class="breadcrumb-container" />
    <div class="region">
      <div class="input_group">
        <p><span>*</span>网点名称</p>
        <el-input
          class="text_input"
          size="medium"
          v-model="paramsData.name"
          placeholder="请输入内容"
        ></el-input>
      </div>
      <div class="input_group">
        <p><span>*</span>所属区域</p>
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
      <div class="input_group">
        <p>领班</p>
        <el-select
          class="text_input"
          size="medium"
          v-model="paramsData.areaManagerId"
          placeholder="请选择"
        >
          <el-option
            v-for="item in leaderList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </div>
      <div class="input_group input_group2">
        <p>地址坐标</p>
        <div class="map_container">
          <el-button
            style="margin-bottom: 10px"
            @click="initSearch"
            type="primary"
            size="small"
            >搜索</el-button
          >
          <!-- <p>{{ address }}</p>
          <hr /> -->
          <div class="amap-page-container">
            <div class="search-box" v-if="toSearch">
              <input v-model="searchKey" type="search" id="search" />
              <button @click="searchByHand">搜索</button>
              <div class="tip-box" id="searchTip"></div>
            </div>
            <el-amap
              vid="amap"
              :zoom="zoom"
              class="amap-demo"
              :center="center"
              :amapManager="amapManager"
              :events="events"
            >
              <el-amap-circle
                vid="circle"
                :center="center"
                :radius="60"
                fill-opacity="0.2"
                strokeColor="#38f"
                strokeOpacity="0.8"
                strokeWeight="1"
                fillColor="#38f"
              >
              </el-amap-circle>
            </el-amap>
          </div>
          <ul>
            <li v-for="item in result" :key="item.id">{{ item.name }}</li>
          </ul>
        </div>
      </div>
      <div style="margin-top: 70px" class="input_group input_group2">
        <p>网点职责</p>
        <el-table
          :header-cell-style="{ background: '#F3F4F7', color: '#333333' }"
          :data="paramsData.taskVOList"
          border
          fit
          style="width: 100%"
        >
          <el-table-column align="center" prop="title" label="职责名称">
          </el-table-column>
          <el-table-column align="center" prop="cleanerName" label="人员">
          </el-table-column>
          <el-table-column align="center" prop="weekText" label="周工作日期">
          </el-table-column>
          <el-table-column align="center" label="工作时间">
            <template slot-scope="{ row }">
              {{ row.startTime }} - {{ row.endTime }}
            </template>
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
      <el-button size="medium" @click="submitDetail" type="primary"
        >提交</el-button
      >
    </div>
  </div>
</template>
<script>
import Breadcrumb from "@/components/Breadcrumb";
import { AMapManager } from "vue-amap";
import { mapState } from "vuex";
import {
  _getOrgBranchAreaList,
  _getAreaLeaderList,
  _orgBranchDetail,
  _orgBranchAddEdit,
} from "@/services/home";
let amapManager = new AMapManager();
export default {
  name: "OutletsInfo",
  data() {
    return {
      isEdit: false,
      zoom: 16,
      center: [121.55635, 29.868657],
      result: [],
      address: "",
      toSearch: false,
      searchKey: "",
      amapManager,
      poiPicker: null,
      events: {
        init(o) {
          // this.map = o;
          // console.log(o);
        },
      },
      paramsData: {
        address: "",
        areaId: "",
        areaName: "",
        areaManagerId: "",
        areaManagerName: "",
        areaManagerPhone: "",
        id: "",
        latitude: 0,
        longitude: 0,
        name: "",
        projectId: "",
        taskVOList: [],
      },
      branchAreaList: [],
      leaderList: [],
    };
  },
  computed: {
    ...mapState({
      projectId: (state) => state.projectInfo.projectId,
    }),
  },
  watch: {
    map: function () {
      if (this.map != null) {
        this.initSearch();
      }
    },
  },
  components: {
    Breadcrumb,
  },
  mounted() {
    this.paramsData.projectId = this.projectId;
    this.isEdit = this.$route.params.isEdit;
    this.getOrgBranchAreaList(this.projectId);
    this.getAreaLeaderList();
    if (this.$route.params.isEdit) {
      this.paramsData.id = this.$route.params.id;
      this.getDetail(this.paramsData.id);
    }
  },
  methods: {
    getDetail(id) {
      _orgBranchDetail(id).then((res) => {
        if (res.code == 1) {
          this.paramsData = res.data;
          this.center = [this.paramsData.longitude, this.paramsData.latitude];
          this.initSearch();
        } else {
          this.$message({ message: res.msg, type: "warning" });
        }
      });
    },
    getOrgBranchAreaList(id) {
      _getOrgBranchAreaList(id).then((res) => {
        // this.branchAreaList = [
        //   {
        //     id: "0",
        //     name: "全部",
        //   },
        // ];
        this.branchAreaList = res.data;
      });
    },
    getAreaLeaderList() {
      _getAreaLeaderList().then((res) => {
        this.leaderList = res.data;
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
          this.$message({
            type: "success",
            message: "删除成功!",
          });
          _this.paramsData.taskVOList.splice(index, 1);
        })
        .catch(() => {});
    },
    initSearch() {
      let _this = this;
      let map = this.amapManager.getMap();
      this.toSearch = true;
      AMapUI.loadUI(["misc/PoiPicker"], function (PoiPicker) {
        var poiPicker = new PoiPicker({
          input: "search",
          //输入框id
          placeSearchOptions: {
            map: map,
            pageSize: 10,
          },
          //地点搜索配置
          suggestContainer: "searchTip",
          //输入提示显示DOM
          searchResultsContainer: "searchTip",
          //搜索结果显示DOM
        });
        _this.poiPicker = poiPicker;
        //监听poi选中信息
        poiPicker.on("poiPicked", function (poiResult) {
          let source = poiResult.source;
          let poi = poiResult.item;
          if (source !== "search") {
            poiPicker.searchByKeyword(poi.name);
          } else {
            poiPicker.clearSearchResults();
            _this.center = [
              poiResult.item.location.lng,
              poiResult.item.location.lat,
            ];
            _this.address = poi.name;
            _this.paramsData.latitude = poiResult.item.location.lat;
            _this.paramsData.longitude = poiResult.item.location.lng;
            _this.paramsData.address = _this.address;
            _this.searchKey = "";
            _this.toSearch = false;
          }
        });
      });
    },

    searchByHand() {
      if (this.searchKey != "") {
        this.poiPicker.searchByKeyword(this.searchKey);
      }
    },
    submitDetail() {
      if (this.paramsData.name == "")
        return this.$message({ type: "warning", message: "请输入网点名称" });
      if (this.paramsData.areaId == "")
        return this.$message({ type: "warning", message: "请选择所属区域" });
        if (this.paramsData.address == "")
        return this.$message({ type: "warning", message: "请选择地址" });
      // 所属区域
      this.branchAreaList.forEach((val) => {
        if (val.id == this.paramsData.areaId) {
          this.paramsData.areaName = val.name;
        }
      });
      // 巡检员
      if (this.paramsData.areaManagerId != "") {
        this.leaderList.forEach((val) => {
          if (val.id == this.paramsData.areaManagerId) {
            this.paramsData.areaManagerName = val.name;
            this.paramsData.areaManagerPhone = val.phone;
          }
        });
      }
      console.log(this.paramsData.latitude, this.paramsData.longitude);
      _orgBranchAddEdit(this.paramsData).then((res) => {
        if (res.code == 1) {
          if (this.isEdit) {
            this.$message({ type: "warning", message: "修改成功" });
          } else {
            this.$message({ type: "warning", message: "添加成功" });
          }
          this.$router.go(-1);
        } else {
          this.$message({ message: res.msg, type: "warning" });
        }
      });
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
    // > p {
    //   // padding-top: 20px;
    // }
  }
}
.footer_btns {
  margin-top: 40px;
  display: flex;
  justify-content: left;
}
.map_container {
  width: 100%;
  height: 400px;
  position: relative;
  .search_group {
    position: absolute;
    right: 20px;
    top: 20px;
  }
}
.amap-page-container {
  height: 100%;
  position: relative;
}
.search-box {
  position: absolute;
  z-index: 5;
  // width: 90%;
  right: 20px;
  top: 20px;
  height: 30px;
  display: flex;
}
.search-box input {
  float: left;
  width: 500px;
  height: 100%;
  border: 1px solid #38f;
  padding: 0 8px;
}
.search-box button {
  float: left;
  width: 20%;
  height: 100%;
  background: #38f;
  border: 1px solid #38f;
  color: #fff;
}
.tip-box {
  width: 100%;
  max-height: 260px;
  position: absolute;
  top: 30px;
  overflow-y: auto;
  background-color: #fff;
}
.toolbar {
  margin-top: 15px;
}
hr {
  border-color: red;
  border-style: none;
}
</style>