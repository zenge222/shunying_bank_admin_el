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
                            v-model="queryForm.cleanerName"
                            placeholder="请输入内容"></el-input>
                    </div>
                    <div class="input_group">
                        <p>所属项目</p>
                        <el-select v-model="queryForm.projectId" clearable>
                            <el-option label="全部" :value="0"></el-option>
                            <el-option :label="item.name" :value="item.id" v-for="(item,index) in projectList" :key="index"></el-option>
                        </el-select>
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
                        <p>请假类型</p>
                        <el-select v-model="queryForm.type" clearable>
                            <el-option label="全部" :value="0"></el-option>
                            <el-option :label="item.value" :value="item.id" v-for="(item,index) in typeList" :key="index"></el-option>
                        </el-select>
                    </div>
                    <div class="input_group">
                        <p>状态</p>
                        <el-select v-model="queryForm.status" clearable>
                            <el-option label="全部" :value="0"></el-option>
                            <el-option :label="item.value" :value="item.id" v-for="(item,index) in statusList" :key="index"></el-option>
                        </el-select>
                    </div>
                </div>
                <el-button size="medium" type="primary" icon="el-icon-search" @click="init">搜索</el-button>
            </div>
            <div class="top_head">
                <div class="inputs">
                    <div class="input_group">
                        <p>创建时间</p>
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
            </div>
        </div>
        <div class="table_container">
            <div class="table_head">
                <h3>请假申请记录</h3>
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
                    <el-table-column align="center" label="请假类型">
                        <template slot-scope="{row}">
                            {{row.type==1?'病假':row.type==2?'事假':'年假'}}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="请假时间">
                        <template slot-scope="{row}">
                            <div>
                                {{row.startDate}}{{row.startTime==1?'上午':'下午'}}
                            </div>
                            <div>
                                {{row.endDate}}{{row.endTime==1?'上午':'下午'}}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="提交时间" prop="createTime">
                    </el-table-column>
                    <el-table-column align="center" prop="insteadCleanerName" label="代班人">
                    </el-table-column>
                    <el-table-column align="center" prop="statusText" label="状态">
                    </el-table-column>
                    <el-table-column align="center" label="操作">
                        <template slot-scope="{row}">
                            <el-button type="text" @click="checkItem(row)">详情</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <!--  :page.sync="formParams.page"
            :limit.sync="formParams.limit" -->
            <pagination style="text-align: right" v-show="total > 0" :total="total" :limit="queryForm.pageSize" :page="queryForm.pageNo" @pagination="resetData"/>
        </div>
        <el-dialog :visible.sync="visible" width="35%" title="请假详情">
            <el-row :gutter="24">
                <el-col :span="12" style="padding: 10px 0;text-indent: 12px">
                    申请人：{{info.cleanerName}}
                </el-col>
                <el-col :span="12" style="padding: 10px 0;text-indent: 12px">
                    2020.10.21 13:00
                </el-col>
                <el-col :span="24" style="padding: 10px 0;text-indent: 12px">
                    所属项目：{{info.projectName}}
                </el-col>
                <el-col :span="24" style="padding: 10px 0;text-indent: 12px">
                    所在网点：{{info.organizationBranchName}}
                </el-col>
                <el-col :span="24" style="padding: 10px 0;text-indent: 12px">
                    请假类型：{{info.typeText}}
                </el-col>
                <el-col :span="24" style="padding: 10px 0;text-indent: 12px">
                    请假时间：{{info.startDate}}{{info.startTimeText}} - {{info.endDate}}{{info.endTimeText}}
                </el-col>
                <el-col :span="24" style="padding: 10px 0;text-indent: 12px">
                    代班人：{{info.insteadCleanerName}}
                </el-col>
                <el-col :span="24" style="padding: 10px 0;text-indent: 12px">
                    请假原因：{{info.reason}}
                </el-col>
            </el-row>

             <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="visible = false">确 定</el-button>
             </span>
        </el-dialog>
    </div>
</template>
<script>
    import Breadcrumb from "@/components/Breadcrumb";
    import Pagination from "@/components/Pagination";
    import {parseTime} from "@/utils";
    import {getOffTheList,belongProject,getOffDetail,getOffStatus,getOffType} from '@/services/person'
    export default {
        name: "LeaveApplyList",
        data() {
            return {
                typeList:[],
                statusList:[],
                projectList:[],
                currentDate:[],
                queryForm:{
                    pageNo:1,
                    pageSize:10,
                    endDateStr:'',
                    startDateStr:'',
                    areaManagerName:'',
                    orgBranchName:'',
                    projectId:0,
                    type:0,
                    cleanerName:'',
                    status:0
                },
                total:0,
                tableData: [],
                visible:false,
                info:{}
            };
        },
        components: {
            Breadcrumb,
            Pagination,
        },
        created() {
            this.getType()
            this.getStatus()
            setTimeout(()=>{
                this.getProject()
            },50)
        },
        methods: {
            init(){
                getOffTheList(this.queryForm).then(res=>{
                    if(res.code ==1){
                        // console.log(res)
                        this.tableData = res.data.list
                        this.total = res.data.total

                    }else{
                        this.$message.error(res.msg)
                    }
                })
            },
            getStatus(){
                getOffStatus().then(res=>{
                    if(res.code ==1){
                        this.statusList = res.data
                    }else{
                        this.$message.error(res.msg)
                    }
                })
            },
            getType(){
                getOffType().then(res=>{
                    if(res.code ==1){
                        this.typeList = res.data
                    }else{
                        this.$message.error(res.msg)
                    }
                })
            },
            getProject(){
                belongProject().then(res=>{
                    if(res.code ==1){
                        // console.log(res)
                        this.projectList = res.data
                        this.init()
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
            },
            checkItem(row){
                this.visible = true
                getOffDetail({id:row.id}).then(res=>{
                    if(res.code ==1){
                        // console.log(res)
                        this.info = res.data
                    }else{
                        this.$message.error(res.msg)
                    }
                })
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
