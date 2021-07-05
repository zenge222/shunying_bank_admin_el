<template>
    <div class="common-container">
        <breadcrumb id="breadcrumb-container" class="breadcrumb-container"/>
        <div class="basics">
            <h3>网点月考核基础配置</h3>
            <div class="input_group margin-btm-18">各先择项分数值：</div>
            <div class="score_list">
                <div class="input_item">
                    满意
                    <el-input
                        v-model="formData.satisfying"
                        oninput="value=value.replace(/[^\d]/g,'')"
                        class="count_input"
                        size="small"
                        placeholder="单行输入"
                    ></el-input
                    >
                    分
                </div>
                <div class="input_item">
                    一般
                    <el-input
                        v-model="formData.general"
                        oninput="value=value.replace(/[^\d]/g,'')"
                        class="count_input"
                        size="small"
                        placeholder="单行输入"
                    ></el-input
                    >
                    分
                </div>
                <div class="input_item">
                    不满意
                    <el-input
                        v-model="formData.unSatisfying"
                        oninput="value=value.replace(/[^\d]/g,'')"
                        class="count_input"
                        size="small"
                        placeholder="单行输入"
                    ></el-input
                    >
                    分
                </div>
            </div>
            <div class="input_group margin-btm-18" style="margin-top: 20px">
                考核平均分与整体满意换算标准：
            </div>
            <div class="score_list">
                <div class="input_item">
                    满意
                    <el-input
                        v-model="formData.satisfyingStandard"
                        oninput="value=value.replace(/[^\d]/g,'')"
                        class="count_input"
                        size="small"
                        placeholder="单行输入"
                    ></el-input
                    >
                    分
                </div>
                <div class="input_item">
                    一般
                    <el-input
                        v-model="formData.generalStandard"
                        oninput="value=value.replace(/[^\d]/g,'')"
                        class="count_input"
                        size="small"
                        placeholder="单行输入"
                    ></el-input
                    >
                    分
                </div>
                <div class="input_item">
                    不满意
                    <el-input
                        v-model="formData.unSatisfyingStandard"
                        oninput="value=value.replace(/[^\d]/g,'')"
                        class="count_input"
                        size="small"
                        placeholder="单行输入"
                    ></el-input
                    >
                    分
                </div>
            </div>
            <div class="input_group margin-btm-18" style="margin-top: 20px">网点月考核时间：</div>
            <div class="score_list">
                <div class="input_item">
                    <el-radio-group v-model="formData.assessTime">
                        <el-radio :label="1">当月</el-radio>
                        <el-radio :label="2">次月</el-radio>
                    </el-radio-group>
                </div>
                <div class="input_item">
                    <el-input
                        v-model="formData.assessDate"
                        oninput="value=value.replace(/[^\d]/g,'')"
                        class="count_input"
                        size="small"
                        placeholder="单行输入"
                    ></el-input
                    >
                    号
                </div>
            </div>
        </div>
        <div class="project">
            <h3>网点月考核配置</h3>
            <el-button class="add_btn" @click="addTitle" size="small" type="primary"
            >添加
            </el-button
            >
            <div class="table_container1">
                <el-table
                    :header-cell-style="{ background: '#F3F4F7', color: '#333333' }"
                    :data="formData.branchAssessConfigVOList"
                    border
                    style="width: 100%"
                >
                    <el-table-column align="center" prop="title" label="标题">
                    </el-table-column>
                    <el-table-column align="center" label="操作">
                        <template slot-scope="{ row, $index }">
                            <el-button
                                type="warning"
                                @click="editItem(row, $index)"
                                size="mini"
                            >修改
                            </el-button
                            >
                            <el-button type="danger" @click="delItem(row, $index)" size="mini"
                            >删除
                            </el-button
                            >
                        </template>
                    </el-table-column>
                </el-table>
                <el-button class="submit_btn" size="medium" type="primary" @click="submit">提交</el-button>
            </div>
        </div>
        <el-dialog
            custom-class="dialog_min_width"
            title="标题"
            :lock-scroll="false"
            :visible.sync="addShow"
            :close-on-click-modal="false"
            width="35%"
            center
        >
            <div class="pop_content">
                <div class="pop_item">
                    <el-input v-model="title" placeholder="请输入内容"></el-input>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
        <el-button
            size="medium"
            type="primary"
            @click="changeTitle"
            v-text="isAdd ? '确定' : '修改'"
        ></el-button>
      </span>
        </el-dialog>
    </div>
</template>
<script>
    import Breadcrumb from "@/components/Breadcrumb";
    import {siteAssessment,editSiteAssessment}from '@/services/home'
    export default {
        name: "OutAssessmentSetUp",
        data() {
            return {
                title: "",
                tableIndex: 0,
                addShow: false,
                isAdd: true,
                projectId: this.$store.state.projectInfo.projectId,
                formData:{
                    branchAssessConfigVOList:[],
                    assessTime:null,//1当月，2次月
                    assessDate:'',
                    general:'',//,一般分数
                    generalStandard:'',//一般标准
                    satisfying:'',//满意分数
                    satisfyingStandard:'',//满意标准
                    unSatisfying:'',//不满意分数
                    unSatisfyingStandard:'',//不满意标准
                }
            };
        },
        components: {
            Breadcrumb,
        },
        created() {
            this.init()
        },
        computed:{

        },
        methods: {
            init(){
                siteAssessment({projectId:this.projectId}).then(res=>{
                    if(res.code ==1){
                        // console.log(res)
                        this.formData = res.data
                    }else{
                        this.$message.error(res.msg)
                    }
                })
            },
            submit(){
                editSiteAssessment(this.formData).then(res=>{
                    if(res.code ==1){
                        this.$message.success('保存成功！')
                        this.init()
                    }else{
                        this.$message.error(res.msg)
                    }
                })
            },
            addTitle() {
                this.title = "";
                this.addShow = true;
            },
            changeTitle() {
                if (this.title == "") {
                    this.$message({
                        type: "warning",
                        message: "请输入标题",
                    });
                    return;
                }
                if (this.isAdd) {
                    this.formData.branchAssessConfigVOList.push({
                        title: this.title,
                    });
                } else {
                    this.formData.branchAssessConfigVOList[this.tableIndex].title = this.title;
                }
                this.addShow = false;
            },
            editItem(row, index) {
                this.isAdd = false;
                this.tableIndex = index;
                this.title = row.title;
                this.addShow = true;
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
                        _this.tableData.splice(index, 1);
                    })
                    .catch(() => {
                    });
            },
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
            margin-bottom: 20px;
        }
    }

    .basics {
        margin: 20px 0;
        padding-bottom: 20px;
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

    .score_list {
        display: flex;
        align-items: center;

        .count_input {
            width: 100px;
            margin: 0 10px;
        }

        .input_item {
            margin-right: 50px;
        }
    }
</style>
