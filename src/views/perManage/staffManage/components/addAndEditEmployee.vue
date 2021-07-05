<template>
    <el-dialog :visible.sync="visible" :title="title==1?'新增':'修改'" width="60%" top="5vh" :close-on-click-modal="false">
        <el-row class="addEmployee">
            <el-form :model="formData" :rules="rules" ref="formData" label-width="100px" size="small">
                <el-col :span="13">
                    <el-form-item label="员工姓名" prop="name">
                        <el-input v-model="formData.name"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="13">
                    <el-form-item label="手机号" prop="phone">
                        <el-input v-model="formData.phone" type="number"></el-input>
                    </el-form-item>
                </el-col>
                <!--                <el-col :span="13">-->
                <!--                    <el-form-item label="工号" prop="workNo">-->
                <!--                        <el-input v-model="formData.workNo" type="number"></el-input>-->
                <!--                    </el-form-item>-->
                <!--                </el-col>-->
                <el-col :span="13">
                    <el-form-item label="身份证" prop="idCardNo">
                        <el-input v-model="formData.idCardNo" :maxlength="18"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="13">
                    <el-form-item label="性别" prop="gender">
                        <el-radio-group v-model="formData.gender">
                            <el-radio :label="1">男</el-radio>
                            <el-radio :label="0">女</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="员工身份" prop="type">
                        <el-radio-group v-model="formData.type">
                            <el-radio :label="item.id" v-for="(item,index) in identityList" :key="index">{{item.value}}</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-col>
                <el-col :span="13">
                    <el-form-item label="所属项目" prop="projectId" v-if="formData.type == 2">
                        <el-select v-model="formData.projectId" placeholder="请选择">
                            <el-option :value="item.id" :label="item.name"
                                       v-for="(item,index) in projectList" :key="index"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="户籍" prop="districtId">
                        <province-package @getData="getProvincePackage" :provinceId="formData.provinceId"
                                          :cityId="formData.cityId"
                                          :districtId="formData.districtId"></province-package>
                    </el-form-item>
                </el-col>
                <el-col :span="13">
                    <el-form-item label="头像" prop="profile">
                        <el-upload
                            v-loading="picture"
                            action="#"
                            class="avatar-uploader"
                            accept="image/png,image/gif,image/jpg,image/jpeg"
                            :show-file-list="false"
                            :before-upload="handleBeforeUpload"
                        >
                            <img
                                v-if="formData.profile"
                                :src="formData.baseUrl + formData.profile"
                                class="avatar"
                            />
                            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                        </el-upload>
                    </el-form-item>
                </el-col>
                <el-col :span="13">
                    <el-form-item label="居住地址" prop="address">
                        <el-input type="textarea" v-model="formData.address"></el-input>
                    </el-form-item>
                </el-col>
            </el-form>
        </el-row>
        <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="handleSubmit">确 定</el-button>
            <el-button @click="handleCancel">重置</el-button>
        </span>
    </el-dialog>
</template>

<script>
    import {belongsProject, addEmployee,getIdentity,employeeDetail,editEmployee} from '@/services/person'
    import ProvincePackage from "@/components/ProvincePackage/ProvincePackage";
    import {_uploadPic} from "@/services/home";

    export default {
        name: "addAndEditEmployee",
        components: {
            ProvincePackage
        },
        data() {
            return {
                projectList: [],
                identityList:[],
                visible: false,
                title: 1,
                picture:false,
                formData: {
                    baseUrl:'',
                    idCardNo: '',//身份证号
                    name: '',//姓名
                    areaId: '',//区域id
                    areaName: '',//区域名称
                    organizationBranchId: '',//网点id
                    organizationBranchName: '',//网点名称
                    phone: '',//手机号
                    profile: '',//头像
                    projectId: '',//项目id
                    type: null,//员工类型类型：1银行(网点负责人)，2：保洁员（驻点）,3：保洁员（机动），4巡检，5：区域经理，6项目经理，7银行(区域负责人)，8银行(项目负责人)
                    // workNo: '',//工号
                    gender: null,//性别，
                    address: '',//居住地址
                    provinceId: '',//省id
                    provinceName: '',//省名称
                    cityId: '',//
                    cityName: '',//
                    districtId: '',//
                    districtName: ''
                },
                rules: {
                    name: [
                        {required: true, message: '姓名不能为空！', trigger: 'blur'},
                    ],
                    phone: [
                        {required: true, message: '手机号不能为空！', trigger: 'blur'},
                        {pattern: /^1[345789]\d{9}$/, message: '手机号格式不正确'}
                    ],
                    districtId: [
                        {required: true, message: '省市区不能为空！', trigger: 'blur'},
                    ],
                    address: [
                        {required: true, message: '居住地址不能为空！', trigger: 'blur'},
                    ]
                }
            }
        },
        created() {
            this.getProjectList()
            this.getIdentityList()
        },
        methods: {
            // 获取所属项目
            getProjectList() {
                belongsProject().then(res => {
                    if (res.code == 1) {
                        // console.log(res)
                        this.projectList = res.data
                    } else {
                        this.$message.error(res.msg)
                    }
                })
            },
            //获取员工身份
            getIdentityList(){
                getIdentity().then(res=>{
                    if(res.code ==1){
                        this.identityList = res.data
                    }else{
                        this.$message.error(res.msg)
                    }
                })
            },
            //获取省市区
            getProvincePackage(data) {
                console.log(data)
                this.formData.areaId = data.district
                this.formData.provinceId = data.province
                this.formData.provinceName = data.provinceName
                this.formData.cityId = data.city
                this.formData.cityName = data.cityName
                this.formData.districtName = data.districtName
                this.formData.districtId = data.district
            },
            //获取员工详情
            getDetail(data){
                employeeDetail(data).then(res=>{
                    if(res.code ==1){
                        // console.log(res)
                        this.formData = res.data
                    }else {
                        this.$message.error(res.msg)
                    }
                })
            },
            handleSubmit() {
                // console.log(this.formData)
                let reg = /^[1-8][1-7]\d{4}(?:19|20)\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])\d{3}[\dX]$/
                let card = this.formData.idCardNo
                if(card && !reg.test(card)){
                    this.$message.error('身份证格式不正确')
                    return false
                }
                this.$refs['formData'].validate((valid) => {
                    if (valid) {
                        if(this.title ==1){
                            addEmployee(this.formData).then(res => {
                                if (res.code == 1) {
                                    this.$message.success('添加成功！')
                                    this.visible = false
                                    this.$emit('success')
                                    this.handleCancel()
                                } else {
                                    this.$message.error(res.msg)
                                }
                            })
                        }else{
                            editEmployee(this.formData).then(res => {
                                if (res.code == 1) {
                                    this.$message.success('编辑成功！')
                                    this.visible = false
                                    this.$emit('success')
                                    this.handleCancel()
                                } else {
                                    this.$message.error(res.msg)
                                }
                            })
                        }

                    } else {
                        return false
                    }
                })
            },
            handleCancel() {
                this.formData.provinceId = ''
                this.formData.cityId = ''
                this.formData.districtId = ''
                this.$refs.formData.resetFields()
            },
            handleBeforeUpload(file) {
                this.picture = true
                if (
                    !(
                        file.type === "image/png" ||
                        file.type === "image/gif" ||
                        file.type === "image/jpg" ||
                        file.type === "image/jpeg"
                    )
                ) {
                    this.$message({
                        message:
                            "请上传格式为image/png, image/gif, image/jpg, image/jpeg的图片",
                        type: "warning",
                    });
                    return;
                }
                let size = file.size / 1024 / 1024 / 2;
                if (size > 2) {
                    this.$message({
                        message: "图片大小必须小于2M",
                        type: "warning",
                    });
                    return;
                }
                let fd = new FormData(); //通过form数据格式来传
                fd.append("filename", file); //传文件
                _uploadPic(fd).then((res) => {
                    if (res.code == 1) {
                        this.formData.baseUrl = res.data.baseUrl;
                        this.formData.profile = res.data.key;
                        this.picture = false
                    } else {
                        this.$message({ message: res.msg, type: "warning" });
                        this.picture = false
                    }
                });
            },
        }
    }
</script>

<style>
    .addEmployee .avatar-uploader{
        display: inline-block!important;
    }
    .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;

    }

    .avatar-uploader .el-upload:hover {
        border-color: #409EFF;
    }

    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 145px;
        height: 145px;
        line-height: 145px;
        text-align: center;
    }

    .avatar {
        width: 145px;
        height: 145px;
        display: block;
    }
</style>
<style scoped>

</style>
