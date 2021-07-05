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
                        <p>工号</p>
                        <el-input
                            class="text_input"
                            size="medium"
                            v-model="queryForm.workNo"
                            placeholder="请输入内容"
                        ></el-input>
                    </div>
                    <div class="input_group">
                        <p>考核时间</p>
                        <el-date-picker
                            @change="dateChange"
                            v-model="currentDate"
                            format="yyyy-MM-dd"
                            value-format="yyyy-MM-dd"
                            type="daterange"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期">
                        </el-date-picker>
                    </div>
                </div>
                <el-button size="medium" type="primary" icon="el-icon-search" @click="init">搜索</el-button>
            </div>
        </div>
        <div class="table_container">
            <div class="table_head">
                <h3>员工考勤列表</h3>
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
                    <el-table-column align="center" prop="cleanerName" label="员工">
                    </el-table-column>
                    <el-table-column align="center" prop="createTime" label="日期">
                    </el-table-column>
                    <el-table-column align="center" prop="projectName" label="项目">
                    </el-table-column>
                    <el-table-column align="center" prop="organizationBranchName" label="打卡网点">
                    </el-table-column>
                    <el-table-column align="center" prop="manHours" label="工时">
                    </el-table-column>
                    <el-table-column align="absenteeism" prop="firstTime" label="上班打卡时间">
                    </el-table-column>
                    <el-table-column align="absenteeism" prop="secondTime" label="下班打卡时间">
                    </el-table-column>
                    <el-table-column align="absenteeism" prop="firstStatusText" label="上班状态">
                    </el-table-column>
                    <el-table-column align="absenteeism" prop="secondStatusText" label="下班状态">
                    </el-table-column>
                </el-table>
            </div>
            <!--  :page.sync="formParams.page"
            :limit.sync="formParams.limit" -->
            <pagination style="text-align: right" v-show="total > 0" :total="total" :limit="queryForm.pageSize" :page="queryForm.pageNo" @pagination="resetData"/>
        </div>

    </div>
</template>
<script>
    import Breadcrumb from "@/components/Breadcrumb";
    import Pagination from "@/components/Pagination";
    import {parseTime} from "@/utils";
    import {attendanceList} from '@/services/person'
    export default {
        name: "StaffAttendanceList",
        data() {
            return {
                currentDate:[],
                queryForm:{
                    pageNo:1,
                    pageSize:10,
                    endDateStr:'',
                    startDateStr:'',
                    name:'',
                    workNo:''
                },
                total:0,
                popShow: false,
                tableData: [],
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
                attendanceList(this.queryForm).then(res=>{
                    if(res.code ==1){
                        // console.log(res)
                        this.tableData = res.data.list
                        this.total = res.data.total

                    }else{
                        this.$message.error(res.msg)
                    }
                })
            },
            dateChange(e) {
                // console.log(e[0]);
                // console.log(e[1]);
                this.queryForm.startDateStr = e[0]
                this.queryForm.endDateStr = e[1]
            },
            resetData(current){
                this.queryForm.pageSize = current.limit
                this.queryForm.pageNo = current.page
                this.init()
            }
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
