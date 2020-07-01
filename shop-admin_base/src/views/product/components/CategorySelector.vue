<template>
  <div>
    <el-form :inline="true" :model="form" class="demo-form-inline">
      <el-form-item label="一级分类">
        <el-select
          v-model="form.category1Id"
          placeholder="请选择"
          @change="getCategory2List"
          :disabled="isDisabled"
        >
          <el-option v-for="c in category1List" :key="c.id" :label="c.name" :value="c.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select
          v-model="form.category2Id"
          placeholder="请选择"
          @change="getCategory3List"
          :disabled="isDisabled"
        >
          <el-option v-for="c in category2List" :key="c.id" :label="c.name" :value="c.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select
          v-model="form.category3Id"
          placeholder="请选择"
          @change="changeGetNewList"
          :disabled="isDisabled"
        >
          <el-option v-for="c in category3List" :key="c.id" :label="c.name" :value="c.id"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  name: 'CategorySelector',
  data () {
    return {
      form: {
        category1Id: '',
        category2Id: '',
        category3Id: '',
      },
      category1List: [],
      category2List: [],
      category3List: [],
      isDisabled: false
    }
  },
  mounted () {
    this.getCategory1List()
  },
  methods: {
    async  getCategory1List () {
      const result = await this.$API.category.getCategorys1()
      if (result.code === 200) {
        this.category1List = result.data
      }
    },
    async getCategory2List (oneId) {
      //分类改变，列表清空，用父组件.sync传过来的方法
      this.$emit('update:child', this.child = [])
      this.$emit('update:spuList', this.spuList = [])

      this.form.category2Id = ''
      this.form.category3Id = ''

      this.category2List = []
      this.category3List = []

      const result = await this.$API.category.getCategorys2(oneId)
      if (result.code === 200) {
        this.category2List = result.data
      }
    },
    async getCategory3List (twoId) {
      //分类改变，列表清空，用父组件.sync传过来的方法
      this.$emit('update:child', this.child = [])
      this.$emit('update:spuList', this.spuList = [])


      this.form.category3Id = ''
      this.category3List = []
      const result = await this.$API.category.getCategorys3(twoId)
      if (result.code === 200) {
        this.category3List = result.data
      }
    },
    changeGetNewList () {
      let { category1Id, category2Id, category3Id } = this.form
      // console.log(category1Id, category2Id, category3Id);
      this.$emit('changeGetList', { category1Id, category2Id, category3Id })
    }

  }
}
</script>
<style lang="stylus" scoped></style>