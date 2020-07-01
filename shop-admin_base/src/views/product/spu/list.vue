<template>
  <div>
    <el-card style="margin-bottom:20px">
      <CategorySelector @changeGetList="changeGetList" :spuList.sync="spuList" />
    </el-card>
    <el-card style="margin-bottom:20px">
      <div v-show="!isShowSpuForm">
        <el-button type="primary" style="margin-bottom:20px">+ 添加SPU</el-button>
        <el-table :data="spuList" border>
          <el-table-column label="SPU序号" type="index" width="100"></el-table-column>
          <el-table-column label="SPU名称" prop="spuName" width="200" align="center"></el-table-column>
          <el-table-column label="SPU描述" prop="description"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="{row}">
              <HintButton
                title="添加SKU"
                type="primary"
                icon="el-icon-plus"
                size="small"
                style="margin-right:10px"
              />
              <HintButton
                title="修改SKU"
                type="primary"
                icon="el-icon-edit"
                size="small"
                style="margin-right:10px"
                @click="showUpdateSpuForm(row)"
              />
              <HintButton
                title="查看已有SKU"
                type="info"
                icon="el-icon-info"
                size="small"
                style="margin-right:10px"
              />
              <el-popconfirm :title="`确定删除${row.spuName}吗？`">
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
        <!-- 分页器 -->
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="getSpuList"
          :current-page="this.page"
          :page-sizes="[3, 6, 9, 12]"
          :page-size="this.limit"
          layout=" prev, pager, next, jumper,->,total, sizes"
          :total="this.total"
          background
          style="text-align:center"
        ></el-pagination>
      </div>
      <!-- <SpuForm :visible="!isShowSpuForm" /> -->
      <SpuForm :visible.sync="isShowSpuForm" />
    </el-card>
  </div>
</template>

<script>
import SpuForm from '../components/SpuForm'

export default {
  name: 'SpuList',
  components: {
    SpuForm
  },
  data () {
    return {
      spuList: [],
      category1Id: '',
      category2Id: '',
      category3Id: '',
      page: 1,
      limit: 3,
      total: 0,
      isShowSpuForm: false
    }
  },

  methods: {
    async getSpuList (page = 1) {
      this.page = page
      const result = await this.$API.spu.getSpuList(this.page, this.limit, this.category3Id)
      // console.log(result.data);
      if (result.code === 200) {
        const { records, total } = result.data
        this.total = total
        this.spuList = records
      }
    },
    // async getSpuList () {
    //   const result = await this.$API.spu.getSpuList(this.page, this.limit, this.category3Id)
    //   if (result.code === 200) {
    //     const { records, total } = result.data
    //     this.total = total
    //     this.spuList = records
    //   }
    // },
    async changeGetList ({ category1Id, category2Id, category3Id }) {
      this.spuList = []
      this.category1Id = category1Id
      this.category2Id = category2Id
      this.category3Id = category3Id
      this.getSpuList()
      // //获取数据之后就能添加了
      // this.buttonDisabled = false
    },


    async handleSizeChange (pageSizes) {
      this.limit = pageSizes
      this.getSpuList()
    },
    //点击修改跳转界面
    showUpdateSpuForm (row) {
      this.isShowSpuForm = true
    }
  }
}
</script>
