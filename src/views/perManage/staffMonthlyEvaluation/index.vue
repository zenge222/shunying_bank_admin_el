<template>
    <div>
        <div class="common-container">
            <breadcrumb id="breadcrumb-container" class="breadcrumb-container"/>
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
                        <p>网点名称</p>
                        <el-input
                            class="text_input"
                            size="medium"
                            v-model="queryForm.orgBranchName"
                            placeholder="请输入内容"
                        ></el-input>
                    </div>
                    <div class="input_group">
                        <p>考核人</p>
                        <el-input
                            class="text_input"
                            size="medium"
                            v-model="queryForm.areaManagerName"
                            placeholder="请输入内容"
                        ></el-input>
                    </div>
                    <div class="input_group">
                        <p>创建时间</p>
                        <el-date-picker
                            @change="dateChange"
                            v-model="currentDate"
                            format="yyyy-MM"
                            value-format="yyyy-MM"
                            type="month"
                          >
                        </el-date-picker>
                    </div>
                </div>
                <el-button size="medium" type="primary" icon="el-icon-search" @click="init">搜索</el-button>
            </div>
        </div>
        <div class="table_container">
            <div class="table_head">
                <h3>员工月度考核</h3>
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
                    <el-table-column align="center" prop="cleanerName" label="员工">
                    </el-table-column>
                    <el-table-column align="center" prop="projectName" label="所属项目">
                    </el-table-column>
                    <el-table-column align="center" prop="organizationBranchName" label="网点名称">
                    </el-table-column>
                    <el-table-column align="center" prop="areaManagerName" label="考核人">
                    </el-table-column>
                    <el-table-column align="center" prop="aveScore" label="平均分">
                    </el-table-column>
                    <el-table-column align="center" prop="createTime" label="创建时间">
                    </el-table-column>
                    <el-table-column align="center" label="操作" width="260">
                        <template slot-scope="{ row, $index }">
                            <el-button @click="checkItem(row)" size="mini">详情
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <!--  :page.sync="formParams.page"
            :limit.sync="formParams.limit" -->
            <pagination style="text-align: right" v-show="total > 0" :total="total" :limit="queryForm.pageSize" :page="queryForm.pageNo" @pagination="resetData"/>
        </div>
        <el-dialog
            custom-class="dialog_min_width"
            title="月考核详情"
            :lock-scroll="false"
            :visible.sync="popShow"
            :close-on-click-modal="false"
            width="35%"
        >
            <el-row>
                <el-col :span="12">
                    <div style="font-size: 14px;margin-bottom: 12px">
                        <span style="font-weight: bolder">{{detailInfo.cleanerName}}</span><span style="margin-left: 30px;font-weight:bolder">2020.10月考核</span>
                    </div>
                    <div style="margin-bottom: 12px">
                        <span>{{detailInfo.projectName||'空'}}</span><span style="margin-left: 30px">{{detailInfo.organizationBranchName}}</span>
                    </div>
<!--                    <div>-->
<!--                        <span>工作区域：</span><span>1F-柜面</span>-->
<!--                    </div>-->
                    <div style="margin-bottom: 12px">
                        <span>考核人:</span><span style="margin-left: 30px">{{detailInfo.areaManagerName}}</span>
                    </div>
                </el-col>
                <el-col :span="12">
                    <div style="color: red;font-weight: 500;font-size: 18px;padding: 15px 0">{{detailInfo.aveScore}}分</div>
                    <div>{{detailInfo.createTime}}</div>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24" style="padding: 12px 0;border-top: 1px solid #dddddd;border-bottom: 1px solid #dddddd">打分情况</el-col>
                <el-col :span="12" v-for="(item,index) in detailInfo.cleanerAssessRecordItemVOList" style="padding: 15px 0">
                    <el-col :span="12">{{item.title}}</el-col>
                    <el-col :span="12" style="color: red">{{item.assessScore}}分</el-col>
                </el-col>
            </el-row>
            <span slot="footer" class="dialog-footer">
                <el-button size="medium" type="primary" @click="popShow=false">确定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
    import Breadcrumb from "@/components/Breadcrumb";
    import Pagination from "@/components/Pagination";
    import {parseTime} from "@/utils";
    import {monthlyReviewList,monthlyReviewDetail} from '@/services/person'
    export default {
        name: "StaffMonthlyEvaluation",
        data() {
            return {
                currentDate:'',
                queryForm:{
                    pageNo:1,
                    pageSize:10,
                    year:'',
                    month:'',
                    name:'',
                    areaManagerName:'',
                    orgBranchName:''
                },
                total:0,
                popShow: false,
                tableData: [],
                detailInfo:{},
            };
        },
        components: {
            Breadcrumb,
            Pagination,
        },
        created() {
            console.log(this.$route.params)//从保洁考核列表跳转过来
            let name = this.$route.params.cleanerName
            if(name){
                this.queryForm.name = name
            }
        },
        mounted() {
            this.init()
        },
        methods: {
            init(){
                monthlyReviewList(this.queryForm).then(res=>{
                    if(res.code ==1){
                        // console.log(res)
                        this.tableData = res.data.list
                        this.total = res.data.total

                    }else{
                        this.$message.error(res.msg)
                    }
                })
            },
            resetData(current){
                this.pageNo = current.page
                this.pageSize = current.pageSize
                this.init()
            },
            checkItem(row, $index) {
                this.popShow = true;
                monthlyReviewDetail({id:row.id}).then(res=>{
                    if(res.code ==1){
                        // console.log(res)
                        this.detailInfo = res.data
                    }else{
                        this.$message.error(res.msg)
                    }
                })
            },
            dateChange(e) {
                // console.log(e)
                let str = e.split('-')
                this.queryForm.year = str[0]
                this.queryForm.month = str[1]
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

    .pop_content {
        .pop_title {
            font-size: 14px;
            margin-bottom: 20px;
        }
    }
</style>
