<template>
    <div class="common-container">
        <breadcrumb id="breadcrumb-container" class="breadcrumb-container"/>
        <div class="basics">
            <div class="input_group margin-btm-18">
                <div class="detail_from_info">
                    <p><span>*</span>员工姓名</p>
                    <el-input
                        class="text_input"
                        size="medium"
                        v-model="input"
                        placeholder="请输入内容"
                    ></el-input>
                </div>
                <div class="detail_from_info">
                    <p>工号</p>
                    <el-input
                        class="text_input"
                        size="medium"
                        v-model="input"
                        placeholder="请输入内容"
                    ></el-input>
                </div>
            </div>
            <div class="input_group margin-btm-18">
                <div class="detail_from_info">
                    <p><span>*</span>手机号</p>
                    <el-input
                        class="text_input"
                        size="medium"
                        v-model="input"
                        placeholder="请输入内容"
                    ></el-input>
                </div>
                <div class="detail_from_info">
                    <p>身份证</p>
                    <el-input
                        class="text_input"
                        size="medium"
                        v-model="input"
                        placeholder="请输入内容"
                    ></el-input>
                </div>
            </div>
            <div class="input_group margin-btm-18">
                <div class="detail_from_info">
                    <p>性别</p>
                    <div>
                        <el-radio v-model="radio" label="1">男</el-radio>
                        <el-radio v-model="radio" label="2">女</el-radio>
                    </div>
                </div>
            </div>
            <div class="input_group margin-btm-18">
                <div class="detail_from_info">
                    <p>员工身份</p>
                    <div>
                        <el-radio v-model="radio" label="1">驻点员工</el-radio>
                        <el-radio v-model="radio" label="2">机动员工</el-radio>
                        <el-radio v-model="radio" label="3">巡检员</el-radio>
                        <el-radio v-model="radio" label="4">区域经理</el-radio>
                        <el-radio v-model="radio" label="5">项目经理</el-radio>
                    </div>
                </div>
            </div>
            <div class="input_group margin-btm-18">
                <div class="detail_from_info">
                    <p>所属项目</p>
                    <el-select
                        class="text_sel"
                        size="medium"
                        v-model="value"
                        placeholder="请选择"
                    >
                        <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        >
                        </el-option>
                    </el-select>
                </div>
            </div>
            <div class="input_group margin-btm-18">
                <div class="detail_from_info">
                    <p><span>*</span>区域</p>
                    <el-select
                        class="text_sel"
                        size="medium"
                        v-model="value"
                        placeholder="请选择"
                    >
                        <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        >
                        </el-option>
                    </el-select>
                    <el-select
                        class="text_sel"
                        size="medium"
                        v-model="value"
                        placeholder="请选择"
                    >
                        <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        >
                        </el-option>
                    </el-select>
                    <el-select
                        class="text_sel"
                        size="medium"
                        v-model="value"
                        placeholder="请选择"
                    >
                        <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        >
                        </el-option>
                    </el-select>
                </div>
            </div>
            <div class="input_group margin-btm-18">
                <div class="detail_from_info" style="align-items: flex-start">
                    <p>头像</p>
                    <el-upload
                        class="avatar-uploader"
                        action="https://jsonplaceholder.typicode.com/posts/"
                        :show-file-list="false"
                        :on-success="handleAvatarSuccess"
                        :before-upload="beforeAvatarUpload"
                    >
                        <img v-if="imageUrl" :src="imageUrl" class="avatar"/>
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </div>
            </div>
            <div class="input_group margin-btm-18">
                <div class="detail_from_info" style="align-items: flex-start">
                    <p><span>*</span>居住地址</p>
                    <el-input
                        type="textarea"
                        :rows="3"
                        style="width: 500px"
                        placeholder="请输入内容"
                        v-model="textarea"
                    >
                    </el-input>
                </div>
            </div>
        </div>
        <div class="project">
            <div class="table_container1">
                <el-button class="submit_btn" size="medium" type="primary"
                >提交
                </el-button
                >
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

    export default {
        name: "StaffInfo",
        data() {
            return {
                title: "",
                imageUrl: "",
                input: "",
                radio: "1",
                tbaleIndex: 0,
                addShow: false,
                isAdd: true,
                tableData: [
                    {
                        name: "xx银行1",
                    },
                    {
                        name: "xx银行2",
                    },
                ],
            };
        },
        components: {
            Breadcrumb,
        },
        mounted() {
        },
        methods: {
            addTile() {
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
                    this.tableData.push({
                        name: "xx银行1",
                    });
                } else {
                    this.tableData[this.tbaleIndex].name = this.title;
                }
                this.addShow = false;
            },
            editItem(row, index) {
                this.isAdd = false;
                this.tbaleIndex = index;
                this.title = row.name;
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
            handleAvatarSuccess(res, file) {
                this.imageUrl = URL.createObjectURL(file.raw);
            },
            beforeAvatarUpload(file) {
                const isJPG = file.type === "image/jpeg";
                const isLt2M = file.size / 1024 / 1024 < 2;

                if (!isJPG) {
                    this.$message.error("上传头像图片只能是 JPG 格式!");
                }
                if (!isLt2M) {
                    this.$message.error("上传头像图片大小不能超过 2MB!");
                }
                return isJPG && isLt2M;
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

    .detail_from_info {
        margin-right: 80px;
        display: flex;
        align-items: center;

        .text_input {
            flex: 1;
        }

        > p {
            font-size: 14px;
            width: 100px;

            > span {
                color: #f56c6c;
                padding-right: 2px;
            }
        }

        .text_sel {
            width: 150px;
            margin-right: 20px;
        }
    }
</style>
