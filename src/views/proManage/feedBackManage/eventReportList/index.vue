<template>
    <div v-loading="isLoading">
        <div class="common-container">
            <breadcrumb id="breadcrumb-container" class="breadcrumb-container"/>
            <div class="top_head">
                <div class="inputs">
                    <div class="input_group">
                        <p>网点名称</p>
                        <el-input
                            class="text_input"
                            size="medium"
                            v-model="paramsData.orgBranchName"
                            placeholder="请输入内容"></el-input>
                    </div>
                    <div class="input_group">
                        <p>报告人</p>
                        <el-input
                            class="text_input"
                            size="medium"
                            v-model="paramsData.reportName"
                            placeholder="请输入内容"></el-input>
                    </div>
                    <div class="input_group">
                        <p>负责人</p>
                        <el-input
                            class="text_input"
                            size="medium"
                            v-model="paramsData.areaLeaderName"
                            placeholder="请输入内容"></el-input>
                    </div>
                    <div class="input_group">
                        <p>处理情况</p>
                        <el-select class="text_input" size="medium" v-model="paramsData.status" placeholder="请选择">
                            <el-option class="text_input" v-for="item in statusList" :key="item.id" :label="item.value" :value="item.id"></el-option>
                        </el-select>
                    </div>
                </div>
                <el-button @click="searchList" size="medium" type="primary" icon="el-icon-search">搜索</el-button>
            </div>
            <div class="top_head">
                <div class="input_group">
                    <p>上报时间</p>
                    <el-date-picker
                        value-format="yyyy-MM-dd"
                        format="yyyy-MM-dd"
                        size="medium"
                        v-model="dates"
                        style="width: 280px"
                        type="daterange"
                        @change="dateChange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                    >
                    </el-date-picker>
                </div>
            </div>
        </div>
        <div class="table_container">
            <div class="table_head">
                <h3>事件上报列表</h3>
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
                    <el-table-column align="center" prop="organizationBranchName" label="网点">
                    </el-table-column>
                    <el-table-column align="center" prop="cleanerName" label="报告人">
                    </el-table-column>
                    <el-table-column align="center" prop="areaLeaderName" label="负责人">
                    </el-table-column>
                    <el-table-column align="center" prop="createTime" label="上报时间">
                    </el-table-column>
                    <el-table-column align="center" prop="statusText" label="处理情况">
                    </el-table-column>
                    <el-table-column align="center" label="操作">
                        <template slot-scope="{ row, $index }">
                            <el-button type="success" @click="checkItem(row, $index)" size="mini">详情</el-button>
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
                v-show="total > 0"
                :total="total"
            />
        </div>

        <el-dialog
            custom-class="dialog_min_width"
            title="详情"
            :lock-scroll="false"
            :visible.sync="addShow"
            :close-on-click-modal="false"
            width="35%"
        >
            <div class="pop_content">
                <div class="title_hean">
                    <h3>{{info.organizationBranchName}}</h3>
                    <p>{{info.statusText}}</p>
                </div>
                <div class="pop_item">
                    <p>报告人：{{info.cleanerName}}</p>
<!--                    <span>xxw网点</span>-->
                </div>
                <div class="pop_item">
                    <p>负责人：{{info.areaLeaderName}}</p>
<!--                    <span>xxw网点</span>-->
                </div>
                <div class="image_title">
                    <h3>详情</h3>
                    <p>{{info.createTime}}</p>
                </div>
                <div class="detail_images">
                    <p class="top_content">{{info.title}}</p>
                    <el-row :gutter="20">
                        <el-col :span="12" v-for="item in detailImg" v-if="item"><img :src="info.baseUrl+item" alt="404"/></el-col>
                    </el-row>
                </div>
                <div class="image_title">
                    <h3>详情</h3>
<!--                    <p>2020.10.21 13:30</p>-->
                </div>
                <div class="detail_images">
                    <p class="top_content">{{info.resultContent}}</p>
                    <el-row :gutter="20">
                        <el-col :span="12" v-for="item in resultImg" v-if="item"><img :src="info.baseUrl+item" alt="404"/></el-col>
                    </el-row>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button size="medium" type="primary" @click="addShow = false">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
    import Breadcrumb from "@/components/Breadcrumb";
    import Pagination from "@/components/Pagination";
    import {_getEmergencyStatusList, _getEmergencyList,_getEmergencyDetail} from "@/services/home";
    // import {parseTime} from "@/utils";

    export default {
        name: "EventReportList",
        data() {
            return {
                isLoading: false,
                addShow: false,
                paramsData: {
                    areaLeaderName: "",
                    endDateStr: "", // parseTime(new Date(),'{y}-{m}-{d}')
                    startDateStr:"", // parseTime(new Date().getTime() - (1000*60*60*24*30),'{y}-{m}-{d}')
                    orgBranchName: "",
                    reportName: "",
                    projectId: this.$store.state.projectInfo.projectId,
                    status: 0,
                    pageNo: 1,
                    pageSize: 10,
                },
                total: 0,
                listData: [],
                statusList: [],
                dates: [], // parseTime(new Date().getTime() - (1000*60*60*24*30),'{y}-{m}-{d}'),parseTime(new Date(),'{y}-{m}-{d}')
                info:{},
                detailImg:[],
                resultImg:[],
            };
        },
        components: {
            Breadcrumb,
            Pagination,
        },
        mounted() {
            this.isLoading = true;
            this.getEmergencyStatusList();
            this.getEmergencyList();
        },
        methods: {
            getEmergencyStatusList() {
                _getEmergencyStatusList().then((res) => {
                    if (res.code == 1) {
                        this.statusList = [
                            {
                                id: 0,
                                value: "全部",
                            },
                        ];
                        this.statusList.push(...res.data);
                    }
                });
            },
            getEmergencyList() {
                _getEmergencyList(this.paramsData).then((res) => {
                    if (res.code == 1) {
                        this.listData = res.data.list;
                        this.total = res.data.total;
                        this.isLoading = false;
                    } else {
                        this.$message({message: res.msg, type: "warning"});
                    }
                });
            },
            searchList() {
                this.isLoading = true;
                this.paramsData.pageNo = 1;
                this.getEmergencyList();
            },
            getListFromPage(val) {
                this.isLoading = true;
                this.paramsData.pageNo = val.page;
                this.paramsData.pageSize = val.limit;
                this.getEmergencyList();
            },
            checkItem(row, index) {
                this.addShow = true;
                _getEmergencyDetail({id:row.id}).then(res=>{
                    if(res.code ==1){
                        // console.log(res)
                        this.info = res.data
                        this.detailImg = res.data.images.split(',')
                        this.resultImg = res.data.resultImages.split(',')
                    }else {
                        this.$message.error(res.msg)
                    }
                })
            },
            dateChange(e) {
                this.paramsData.startDateStr = e[0];
                this.paramsData.endDateStr = e[1];
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

            > span {
                padding: 0 10px;
                font-size: 14px;
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

    .pop_content {
        .detail_group {
            display: flex;
            align-items: center;

            .detail_logo {
                width: 80px;
                display: block;
                margin-right: 16px;
            }

            .detail_right {
                flex: 1;
            }
        }

        .title_hean {
            display: flex;
            justify-content: space-between;

            > h3 {
                color: #333333;
                font-size: 14px;
                font-weight: bold;
            }

            > p {
                font-size: 14px;
                color: #f56c6c;
            }
        }

        .pop_item {
            padding-top: 12px;
            display: flex;
        }

        .detail_time {
            display: flex;
            justify-content: space-between;

            > p {
                padding-top: 12px;
            }
        }

        .image_title {
            display: flex;
            justify-content: space-between;
            margin: 20px 0 0 0;
            font-size: 14px;
        }
    }

    .detail_scored {
        .detail_col {
            margin-top: 20px;
        }

        .scored_item {
            display: flex;
            justify-content: space-between;

            > p {
                color: #f56c6c;
            }
        }
    }

    .dialog_min_width {
        min-width: 500px;
    }

    .detail_images {
        margin-top: 20px;

        img {
            width: 100%;
        }
    }

    .image_title {
        margin: 20px 0 0 0;
        font-size: 14px;
        padding: 12px 0 0 0;
        border-top: 1px solid #f2f2f2;
    }

    .top_content {
        padding: 0 0 20px 0;
    }
</style>
