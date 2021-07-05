<template>
    <div class="common-container">
        <breadcrumb id="breadcrumb-container" class="breadcrumb-container"/>
        <div class="basics">
            <h3>反馈处理基础配置</h3>
            <div class="input_group margin-btm-18">
                接受清扫反馈后超过
                <el-input
                    v-model="formData.cleanerTime"
                    oninput="value=value.replace(/[^\d]/g,'')"
                    class="count_input"
                    size="small"
                    placeholder="单行输入"
                ></el-input
                >
                分钟为超时
            </div>
            <div class="input_group margin-btm-18">
                接受事件上报后超过
                <el-input
                    v-model="formData.areaLeaderTime"
                    oninput="value=value.replace(/[^\d]/g,'')"
                    class="count_input"
                    size="small"
                    placeholder="单行输入"
                ></el-input
                >
                分钟为超时
            </div>
        </div>
        <div class="project">
            <div class="table_container1">
                <el-button class="submit_btn" size="medium" type="primary" @click="submit">提交</el-button>
            </div>
        </div>
    </div>
</template>
<script>
    import Breadcrumb from "@/components/Breadcrumb";
    import {feedBackDetail, editFeedBack} from '@/services/home'
    import {mapState} from 'vuex'

    export default {
        name: "FeedBackSetUp",
        data() {
            return {
                formData:{
                    areaLeaderTime:null,
                    cleanerTime:null
                },
            };
        },
        components: {
            Breadcrumb,
        },
        created() {
            this.init()
        },
        computed: {
            ...mapState({
                projectId:(state) => state.projectInfo.projectId
            })
        },
        methods: {
            init() {
                feedBackDetail({projectId:this.projectId}).then(res=>{
                    if(res.code ==1){
                        // console.log(res)
                        this.formData = res.data
                    }else{
                        this.$message.error(res.msg)
                    }
                })
            },
            submit(){
                editFeedBack(this.formData).then(res=>{
                    if(res.code ==1){
                        this.$message.success('成功！')
                        this.init()
                    }else{
                        this.$message.error(res.message)
                    }
                })
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
