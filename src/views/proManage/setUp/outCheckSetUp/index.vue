<template>
    <div class="common-container">
        <breadcrumb id="breadcrumb-container" class="breadcrumb-container"/>
        <div class="basics">
            <h3>网点巡检基础配置</h3>
            <div class="input_group margin-btm-18">
                同一网点最长巡检时隔时间
                <el-input
                    v-model="formData.maxDayCount"
                    oninput="value=value.replace(/[^\d]/g,'')"
                    class="count_input"
                    size="small"
                    placeholder="单行输入"
                ></el-input
                >
                天
            </div>
            <div class="input_group margin-btm-18">
                网点超过
                <el-input
                    v-model="formData.maxMessageDayCount"
                    oninput="value=value.replace(/[^\d]/g,'')"
                    class="count_input"
                    size="small"
                    placeholder="单行输入"
                ></el-input
                >
                天未巡检时发送消息通知
            </div>
        </div>
        <div class="project">
            <h3>网点巡检项目配置</h3>
            <el-button class="add_btn" @click="add" size="small" type="primary">添加</el-button>
            <div class="table_container1">
                <el-table
                    :header-cell-style="{ background: '#F3F4F7', color: '#333333' }"
                    :data="formData.configList"
                    border
                    style="width: 100%"
                >
                    <el-table-column align="center" prop="title" label="标题">
                    </el-table-column>
                    <el-table-column align="center" label="操作">
                        <template slot-scope="{ row, $index }">
                            <el-button type="warning" @click="editItem(row, $index)" size="mini">修改</el-button>
                            <el-button type="danger" @click="delItem(row, $index)" size="mini">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <el-button class="submit_btn" size="medium" type="primary" @click="submit">提交</el-button>
            </div>
        </div>
        <el-dialog
            custom-class="dialog_min_width"
            :title="title ==1?'添加':'修改'"
            :visible.sync="visible"
            :close-on-click-modal="false"
            width="35%"
        >
            <div class="pop_content">
                <div class="pop_item">
                    <el-input v-model="addTitle" placeholder="请输入标题"></el-input>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
        <el-button size="medium" type="primary" @click="changeTitle">确定</el-button>
      </span>
        </el-dialog>
    </div>
</template>
<script>
    import {inspectionSetting,editInspection} from '@/services/home'
    import Breadcrumb from "@/components/Breadcrumb";
    import { mapState } from "vuex";
    export default {
        name: "OutCheckSetUp",
        data() {
            return {
                formData:{
                    configList:[],
                    maxDayCount:null,
                    maxMessageDayCount:null,
                },
                title: 1,
                addTitle:'',
                visible:false,
                tableIndex:null,
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
            this.init()
        },
        methods: {
            init(){
                inspectionSetting({projectId:this.projectId}).then(res=>{
                    if(res.code ==1){
                        // console.log(res)
                        this.formData = res.data
                    }else {
                        this.$message.error(res.msg)
                    }
                })
            },
            add() {
                this.title = 1;
                this.visible = true;
                this.addTitle = ''
            },
            changeTitle() {
                if (this.addTitle == "") {
                    this.$message({
                        type: "warning",
                        message: "请输入标题",
                    });
                    return;
                }
                if(this.title ==1){
                    this.formData.configList.push({
                        title:this.addTitle
                    })
                }else{
                    this.formData.configList[this.tableIndex].title =  this.addTitle
                }
                this.visible = false;
            },
            editItem(row, index) {
                this.title = 2
                this.tableIndex = index;
                this.addTitle = row.title;
                this.visible = true;
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
                        console.log();
                        _this.formData.configList.splice(index, 1);
                    })
                    .catch(() => {
                    });
            },
            submit(){
                // console.log(this.formData)
                editInspection(this.formData).then(res=>{
                    if(res.code ==1){
                        this.$message.success('提交成功！')
                        this.init()
                    }else{
                        this.$message.error(res.msg)
                    }
                })
            }
        },
    };
</script>
<style lang="less">
    .basics,
    .project {
        padding: 0 0 0 6px;
        margin-bottom: 20px;

        > h3 {
            font-size: 14px;
            font-weight: bold;
            margin-bottom: 10px;
        }
    }

    .basics {
        margin-top: 20px;
        border-bottom: 1px solid #f2f2f2;
    }

    .project {
        .add_btn {
            margin: 10px 0;
        }
    }

    .input_group {
        // margin-bottom: 18px;
        display: flex;
        align-items: center;
        font-size: 12px;

        .count_input {
            width: 100px;
            margin: 0 10px;
        }
    }

    .submit_btn {
        margin: 20px 0;
    }
</style>
