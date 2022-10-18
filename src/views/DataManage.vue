<template>
  <div id="dm_main">
    <el-button
      v-if="isshow1"
      id="uploadbutton"
      type="primary"
      @click="changeButton"
      >文件上传</el-button
    >
    <el-button v-if="isshow2" id="schema1" type="primary" @click="showSchemaHas">已存在表</el-button>
    <el-button v-if="isshow3" id="schema2" type="primary" @click="showSchemaNew">新建表</el-button>

    <el-dialog title="已存在表的基本信息" :visible.sync="schemaHasVisible">
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="表名">
          <el-input v-model="schemaHasName" placeholder="表名"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchSchema(schemaHasName)"
            >查询</el-button
          >
        </el-form-item>
      </el-form>
      <el-table :data="showSchema1" style="width: 100%" height="250">
        <el-table-column fixed prop="schName" label="表名" width="120">
        </el-table-column>
        <el-table-column prop="tableDesc" label="描述" width="260">
        </el-table-column>
        <el-table-column label="上传文件" width="100">
          <template slot-scope="scope">

                <el-upload
              class="upload-demo"
              action="#"
              :on-preview="handlePreview"
              :http-request="(data) => getFile(data, scope.row)"
              :on-remove="handleRemove"
              :before-remove="beforeRemove"
              multiple
            >

                <el-button size="small" type="primary">上传文件</el-button>
            </el-upload>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button
          @click="
            schemaHasVisible = false;
            ruleForm2.schemaAttributeName = [];"
          >取 消</el-button
        >

                <el-button type="primary" >确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="新建表的基本信息" :visible.sync="schemaNewVisible">
      <el-form :model="ruleForm1" :rules="rules" ref="ruleForm1">
        <el-form-item
          label="新建表名称"
          :label-width="formLabelWidth"
          prop="schemaName"
        >
          <el-input
            v-model="ruleForm1.schemaName"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="新建表属性个数" :label-width="formLabelWidth">
          <el-input-number
            v-model="ruleForm1.schemaAttributeNum"
            @change="handleChange"
            :min="1"
            :max="100"
            label="请输入新建表的属性个数"
          ></el-input-number>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button
          @click="
            schemaNewVisible = false;
            ruleForm2.schemaAttributeName = [];
          "
          >取 消</el-button
        >
        <el-button type="primary" @click="submitNewSchemaNum(ruleForm1)"
          >确 定</el-button
        >
      </div>
    </el-dialog>

    <el-dialog title="新建表的具体信息" :visible.sync="schemaNewCoulumn">
      <el-form :model="ruleForm2" ref="ruleForm2">
        <el-form-item
          v-for="(item, index) in ruleForm2.schemaAttributeName"
          :prop="'schemaAttributeName.' + index + '.value'"
          label="属性名称"
          :label-width="formLabelWidth"
          :rules="{
            required: true,
            message: '请输入表属性名',
            trigger: 'blur',
          }"
        >
          <el-input v-model="item.value" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button
          @click="
            schemaNewCoulumn = false;
            ruleForm2.schemaAttributeName = [];
          "
          >取 消</el-button
        >
        <el-button type="primary" @click="submitNewSchema('ruleForm2')"
          >确 定</el-button
        >
      </div>
    </el-dialog>
    <el-dialog title="新建表的上传" :visible.sync="schemaNewUpload">
     <el-upload
              class="upload-demo"
              action="#"
              :on-preview="handlePreview"
              :http-request="(data) => getFile1(data, ruleForm1.schemaName)"
              :on-remove="handleRemove"
              :before-remove="beforeRemove"
              multiple
            >
        <el-button size="small" type="primary">点击上传</el-button>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button
          @click="
            schemaNewUpload = false;
            fileList = [];
            ruleForm2.schemaAttributeName = [];
          "
          >取 消</el-button
        >
        <el-button type="primary" >确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { createLogger } from 'vuex';
import { getRequest, postRequest } from '../utils/api';
export default {
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入表名"));
      } else {
        callback();
      }
    };


    return {
      isshow1: true,
      isshow2: false,
      isshow3: false,

      schemaHasVisible: false,
      schemaNewVisible: false,
      schemaNewCoulumn: false,
      schemaNewUpload: false,
      flag: 1,
      ruleForm1: {
        schemaName: "",
        schemaAttributeNum: "",
      },//提交表名和表属性个数
      formLabelWidth: "120px",
      rules: {
        schemaName: [{ validator: validatePass, trigger: "blur" }],
      },
      ruleForm2: {
        schemaAttributeName: [],
      },//提交表属性
      schemas:[],//搜索到的表
      schemasAll:[],//所有表信息
      file: {},
      fileList: [],
      oldUploadName:[],//旧的已上传的表名
      tableData: [],
      schemaHasName: "",
      showSchema1:[],
      tableId:"",
    };
  },

  methods: {
    changeButton() {
      this.isshow1 = !this.isshow1; //当点击按钮触发事件时改变两个按钮的显示
      this.isshow2 = !this.isshow2;
      this.isshow3 = !this.isshow3;
    },
    showSchemaHas() {
      this.schemaHasVisible = true;
      getRequest('/main/dataadmin/tablesche/querytable').then(response=>{
        console.log(response)
         if(response){
          for(let i=0;i<response._message.data.records.length;i++){
          const obj={schName:response._message.data.records[i].tableName,
          tableDesc:response._message.data.records[i].tableDesc};
          this.schemasAll.push(obj);
          }
          this.showSchema1=this.schemasAll;
          console.log(this.schemasAll)
          this.schemasAll=[];
          console.log("查询到的数据",this.showSchema1);
        }
        else{
          console.log(response)
        }
      })
    },
    showSchemaNew() {
      this.schemaNewVisible = true;
    },
    handleChange(value) {
      console.log(value);
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },

    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    submitNewSchemaNum(ruleForm1) {
      this.$refs.ruleForm1.validate((valid) => {
        if (valid) {
          alert("submit!");
          const param={
            tableName:this.ruleForm1.schemaName,
          }
          
          postRequest('/main/dataadmin/tablesche/create/schema',param).then(res=>{
                if(res){
                this.tableId=res._message.tableId;
                  console.log(res.message);
                }else{
                  console.log('失败');
                }
          })
          this.schemaNewVisible = false;
          for (let i = 1; i <= this.ruleForm1.schemaAttributeNum; i++) {
            let obj = { name: `input${i}`, value: "" };
            this.ruleForm2.schemaAttributeName.push(obj);
          }

          this.schemaNewCoulumn = true;
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    submitNewSchema(info) {
      this.$refs[info].validate((valid) => {
        if (valid) {
          alert("submit!");
          let columnName=[];
          let params=[];
          for(let i=0;i<this.ruleForm2.schemaAttributeName.length;i++){
            columnName[i]=this.ruleForm2.schemaAttributeName[i].value;
             const obj={
               tableId:this.tableId,
                columnName:columnName[i],
                columnDescription:"string",
                columnType:"cdate"
             };

             params.push(obj);
          }
          console.log(params)
          
          postRequest('/main/columns/create/columns/',params).then(resp=>{
              if(resp){
                console.log(resp.message);
      
              }
          })
          this.schemaNewCoulumn = false;
          this.schemaNewUpload = true;
        } else {
          console.log("error submit!!");
          this.ruleForm2.schemaAttributeName = [];
          return false;
        }
      });
    },
    getFile(data, row) {
       const data_file = new FormData();
      data_file.append("data_file", data.file);
      data_file.append("tableName", row.schName);
      const params={
        tableName:this.ruleForm1.schemaName,
        data_file:data_file
      }
      const options = {
        method: 'post',
        data: data_file,
        url: "/main/dataadmin/tablesche/upload/columns/",
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }

      this.$axios(options).then(res => {
        console.log(res);
      }).catch(err => {
        console.log(err);
      })
    },
     getFile1(data, schNewName) {
       const data_file = new FormData();
      data_file.append("data_file", data.file);
      data_file.append("tableName", schNewName);

      const options = {
        method: 'post',
        data: data_file,
        url: "/main/dataadmin/tablesche/upload/columns/",
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }

      this.$axios(options).then(res => {
        console.log(res);
      }).catch(err => {
        console.log(err);
      })
    },
   
    searchSchema(tableName) {//查询到的数据
    const param={
      tableName:tableName,
      pageSize:2,
      pageNo:1
    }
      
      postRequest("/main/dataadmin/tablesche/querytable", param).then((response) => {
        if(response){
          console.log(response)
          for(let i=0;i<response._message.tableRecords.length;i++){
          const obj={schName:response._message.tableRecords[i].tableName,
           tableDesc:response._message.tableRecords[i].tableDesc};
          this.schemas.push(obj);
          }
          this.showSchema1=this.schemas;
          this.schemas=[];
        }
        else{
          console.log(response)
        }
      });
    },


  },
};
</script>

<style>
#dm_main {
  position: relative;
  height: 100%;
}
#uploadbutton {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translateX(-50%) translateY(-50%);
}
#schema1 {
  position: absolute;
  left: 45%;
  top: 50%;
  transform: translateX(-50%) translateY(-50%);
}
#schema2 {
  position: absolute;
  left: 55%;
  top: 50%;
  transform: translateX(-50%) translateY(-50%);
}
</style>