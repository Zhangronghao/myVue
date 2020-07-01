<template>
  <div>
    <el-card style="margin-bottom:20px">
      <CategorySelector @changeGetList="changeGetList" ref="cs" :child.sync="attrList"/>
    </el-card>
    <el-card style="margin-bottom:20px">
      <div v-show="isShowAttrList">
        <el-button
          type="primary"
          style="margin-bottom:20px"
          @click="toAddAttr"
          :disabled="buttonDisabled"
        >+ 添加属性</el-button>
        <el-table :data="attrList" border>
          <el-table-column label="序号" type="index" width="100"></el-table-column>
          <el-table-column label="名称" prop="attrName" width="200" align="center"></el-table-column>
          <el-table-column label="属性值列表" width="800">
            <template slot-scope="{row}">
              <el-tag
                type="info"
                v-for="value in row.attrValueList"
                :key="value.id"
                style="margin-right:3px"
              >{{value.valueName}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="{row}">
              <HintButton
                title="修改"
                type="primary"
                icon="el-icon-edit"
                size="small"
                style="margin-right:10px"
                @click="toUpdateAttrValue(row)"
              />
              <el-popconfirm title="确定删除该行数据吗？" @onConfirm="deleteRow(row.id)">
                <HintButton
                  title="删除"
                  type="danger"
                  icon="el-icon-delete"
                  size="small"
                  slot="reference"
                />
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-show="!isShowAttrList">
        <el-form inline :model="formAttr">
          <!--文本框-->
          <el-form-item label="属性名称">
            <el-input type="text" v-model="formAttr.attrName" />
          </el-form-item>
          <!--添加属性值按钮  和   取消按钮-->
          <div>
            <el-button
              type="primary"
              icon="el-icon-plus"
              @click="addValue"
              :disabled="!formAttr.attrName.trim()"
            >添加属性值</el-button>
            <el-button @click="isShowAttrList=true">取消</el-button>
          </div>
          <br />
          <!--表格-->
          <el-table :data="formAttr.attrValueList" border>
            <el-table-column label="序号" type="index" width="100" align="center"></el-table-column>
            <el-table-column label="属性" prop="valueName" width="300" align="center">
              <template slot-scope="{row,$index}">
                <el-input
                  v-if="row.edit"
                  type="text"
                  placeholder="请输入内容"
                  v-model="row.valueName"
                  @blur="toEditFalse(row)"
                  @keyup.13.native="toEditFalse(row)"
                  :ref="$index"
                ></el-input>
                <span
                  v-else
                  @click="toEditTrue(row)"
                  style="display:inline-block;width:100%"
                >{{row.valueName}}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="100" align="center">
              <template slot-scope="{row,$index}">
                <el-popconfirm
                  :title="`确定删除${row.valueName}数据吗？`"
                  @onConfirm="deleteAttrValue($index)"
                >
                  <HintButton
                    title="删除"
                    type="danger"
                    icon="el-icon-delete"
                    size="small"
                    slot="reference"
                  />
                </el-popconfirm>
              </template>
            </el-table-column>
          </el-table>
          <br />
          <div>
            <el-button type="primary" @click="updateAttr" :disabled="!isSave">保存</el-button>
            <el-button @click="isShowAttrList=true">取消</el-button>
          </div>
        </el-form>
      </div>
    </el-card>
  </div>
</template>
          

<script>
//引入lodash的深克隆
import cloneDeep from 'lodash/cloneDeep'

export default {
  name: 'PropList',
  data () {
    return {
      attrList: [],
      isShowAttrList: true,
      formAttr: {
        attrName: '',
        attrValueList: []
      },
      form: {
        category1Id: '',
        category2Id: '',
        category3Id: '',
      },
      buttonDisabled: true
    }
  },
  computed: {
    isSave () {
      return this.formAttr.attrName.trim() && this.formAttr.attrValueList.some(item => !!item.valueName.trim())
    }
  },
  watch: {
    isShowAttrList (val) {
      this.$refs.cs.isDisabled = !val
    }
  },
  methods: {
    async changeGetList ({ category1Id, category2Id, category3Id }) {
      this.attrList = []
      this.form.category1Id = category1Id
      this.form.category2Id = category2Id
      this.form.category3Id = category3Id
      const result = await this.$API.attr.getAttrList(category1Id, category2Id, category3Id)
      // console.log(result.data);
      if (result.code === 200) {
        this.attrList = result.data
      }
      //获取数据之后就能添加了
      this.buttonDisabled = false

    },
    async deleteRow (id) {
      // this.attrList.splice(index, 1)
      const result = await this.$API.attr.deleteAttr(id)
      if (result.code === 200) {
        this.$message.success('删除成功')
      } else {
        this.$message.error('删除失败')
      }
      this.changeGetList(this.form)
    },
    toUpdateAttrValue (formAttr) {

      //这里传进来的是scopd.row行对象,因为浅克隆会导致数据变化，所以需要用到lodash的
      this.formAttr = cloneDeep(formAttr)
      this.isShowAttrList = false
    },
    deleteAttrValue (index) {
      this.formAttr.attrValueList.splice(index, 1)
    },
    //添加属性值
    addValue () {
      // console.log(this.formAttr);

      console.log(this.formAttr.attrValueList);
      this.formAttr.attrValueList.push({
        attrId: this.formAttr.id,
        valueName: '',
        //定义一个标识
        edit: true
      })
      this.$nextTick(() => {
        this.$refs[this.formAttr.attrValueList.length - 1].focus()
      })
    },
    toEditFalse (row) {
      row.edit = false
    },
    toEditTrue (row) {
      //这样是不行的，因为原先的属性没有edit值，所以我们需要响应式添加
      // row.edit = true 
      if (row.hasOwnProperty('edit')) {
        row.edit = true
      } else {
        this.$set(row, 'edit', true)
      }
    },
    //保存修改后的属性值数据
    async updateAttr () {
      //发送请求的时候要干掉无用的edit属性，因为服务器不不需要
      this.formAttr.attrValueList.forEach((item) => delete item.edit)
      console.log(this.formAttr);

      const result = await this.$API.attr.saveAttr(this.formAttr)
      if (result.code === 200) {
        this.$message({
          type: 'success',
          //这里判断是添加还是更新，添加的话是没有id的，因为id是后台后面给的
          message: `${this.formAttr.id ? '更新' : '添加'}成功`
        })
        this.isShowAttrList = true
        this.changeGetList(this.form)
      } else {
        this.$message({
          type: 'error',
          message: '更新失败'
        })
      }
    },
    //去添加平台属性界面
    toAddAttr () {
      this.formAttr = {
        attrName: '',
        attrValueList: [],
        categoryId: this.form.category3Id,
        categoryLevel: 3
      }
      this.isShowAttrList = false
    }
  },
}
</script>

<style scoped>
.edit-input {
  padding-right: 60px;
}
.save-btn {
  position: absolute;
  right: 15px;
  top: 10px;
}
</style>

