<template>
<!--    //省市区组件-->
    <span>
        <el-select placeholder="请选择省" v-model="province" @change="chooseProvince">
            <el-option :value="item.id" :label="item.name" v-for="(item,index) in areaList" :key="index"></el-option>
        </el-select>
        <el-select placeholder="请选择市" v-model="city" style="margin-left: 20px" @change="chooseCity">
            <el-option :value="item.id" :label="item.name" v-for="(item,index) in cityList" :key="index"></el-option>
        </el-select>
        <el-select placeholder="请选择区" v-model="district" style="margin-left: 20px" @change="chooseDistrict">
            <el-option :value="item.id" :label="item.name" v-for="(item,index) in districtList" :key="index"></el-option>
        </el-select>
    </span>
</template>

<script>
    import {provincePackage} from '../../services/person'
    export default {
        name: "ProvincePackage",
        props:{
            provinceId:{
                default:null
            },
            cityId:{
                default:null
            },
            districtId:{
                default:null
            }
        },
        data(){
            return{
                areaList:[],
                cityList:[],
                districtList:[],
                province:null,
                city:null,
                district:null,
                provinceName: '',
                cityName:'',
                districtName:''
            }
        },
        watch:{
            provinceId:{
                handler(newName, oldName) {
                    console.log(newName)
                    this.province = newName
                    provincePackage({parentId:newName}).then(res => {
                        if (res.code == 1) {
                            this.cityList = res.data
                        } else {
                            this.$message.error(res.msg)
                        }
                    })
                },
                immediate: false
            },
            cityId:{
                handler(newName, oldName) {
                    console.log(newName)
                    this.city = newName
                    provincePackage({parentId:newName}).then(res => {
                        if (res.code == 1) {
                            // console.log(res)
                            this.districtList = res.data
                        } else {
                            this.$message.error(res.msg)
                        }
                    })
                },
                immediate: false
            },
            districtId:{
                handler(newName, oldName) {
                    console.log(newName)
                    this.district = newName
                },
                immediate: false
            },
        },
        created() {
            this.getProvincePackage()
        },
        methods:{
            // 获取省市区联动
            getProvincePackage() {
                provincePackage().then(res => {
                    if (res.code == 1) {
                        // console.log(res)
                        this.areaList = res.data
                    } else {
                        this.$message.error(res.msg)
                    }
                })
            },
            chooseProvince(value){
                // console.log('province======>'+ value)
                this.city = null
                this.district = null
                this.cityList = []
                this.districtList = []
                provincePackage({parentId:value}).then(res => {
                    if (res.code == 1) {
                        // console.log(res)
                        this.cityList = res.data
                    } else {
                        this.$message.error(res.msg)
                    }
                })
            },
            chooseCity(value){
                this.district = null
                this.districtList = []
                // console.log('city======>'+ value)
                provincePackage({parentId:value}).then(res => {
                    if (res.code == 1) {
                        // console.log(res)
                        this.districtList = res.data
                    } else {
                        this.$message.error(res.msg)
                    }
                })
            },
            chooseDistrict(value){
                // console.log('district======>'+ value)
                let data = {
                    province:this.province,
                    city:this.city,
                    district:this.district,
                    provinceName: this.areaList.find(item=>item.id == this.province).name || null,
                    cityName:this.cityList.find(item=>item.id == this.city).name || null,
                    districtName:this.districtList.find(item=>item.id == this.district).name || null
                }
                this.$emit('getData',data)
            },
        }
    }
</script>

<style scoped>

</style>
