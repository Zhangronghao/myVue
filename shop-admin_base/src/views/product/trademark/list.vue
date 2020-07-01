<template>
  <div>
    <el-button type="primary" @click="addShow">+ 添加</el-button>
    <br />
    <br />
    <el-table :data="trademark" border stripe style="width: 100%" v-loading="loading">
      <el-table-column type="index" label="序号" width="80" />
      <el-table-column prop="tmName" label="品牌名称" width="180" />
      <el-table-column label="品牌LOGO">
        <template slot-scope="scope">
          <img :src="scope.row.logoUrl" alt width="90px" height="35px" />
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="small"
            type="warning"
            icon="el-icon-edit"
            @click="showUpdate(scope.row)"
          >修改</el-button>&nbsp;
          <el-button
            size="small"
            type="danger"
            icon="el-icon-delete"
            @click="deleteTrademark(scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <br />
    <br />
    <div class="block">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="getTrademarkList"
        :current-page="this.page"
        :page-sizes="[3, 6, 9, 12]"
        :page-size="this.limit"
        layout=" prev, pager, next, jumper,->,total, sizes"
        :total="this.total"
        background
        style="text-align:center"
      ></el-pagination>
    </div>
    <el-dialog title="品牌信息" :visible.sync="dialogFormVisible">
      <el-form :model="form" width="80%" :rules="rules" ref="form">
        <el-form-item label="品牌名称" :label-width="formLabelWidth" prop="tmName">
          <el-input v-model="form.tmName" autocomplete="off" placeholder="请输入品牌名称"></el-input>
        </el-form-item>
        <el-form-item label="品牌LOGO" :label-width="formLabelWidth" prop="logoUrl">
          <el-upload
            class="avatar-uploader"
            action="/dev-api/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="form.logoUrl" :src="form.logoUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addOrUpdateTrademark">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'TrademarkList',
  // eslint-disable-next-line space-before-function-paren
  data () {
    return {
      trademark: [],
      page: 1,
      limit: 3,
      total: 0,
      loading: false,
      form: {
        tmName: '',
        logoUrl: ''
      },
      dialogFormVisible: false,
      formLabelWidth: '150px'.trademark,


      rules: {
        tmName: [
          { required: true, message: '请输入品牌信息' },
          { mix: 2, max: 10, message: '字符长度在2-10之间', trigger: 'change' }

        ],
        logoUrl: [
          { required: true, message: '请上传图片', trigger: 'change' }
        ],

      }
    }
  },
  mounted () {
    this.getTrademarkList()
  },
  methods: {
    async getTrademarkList (page = 1) {
      this.loading = true
      this.page = page
      const result = await this.$API.trademark.getTrademarkList(
        this.page,
        this.limit
      )
      this.loading = false
      if (result.code === 200) {
        const { records, total } = result.data
        this.trademark = records
        this.total = total
      } else {
        this.$message('NO')
      }
    },
    handleSizeChange (pageSizes) {
      this.limit = pageSizes
      this.getTrademarkList()
    },
    // handleCurrentChange(val) {
    //   console.log(`当前页: ${val}`);
    // }
    addShow () {
      this.form = {
        tmName: '',
        logoUrl: ''
      }
      this.dialogFormVisible = true

      // this.$nextTick(() => {
      //   this.$refs.form.clearValidate()
      // })
    },
    handleAvatarSuccess (res, file) {
      // this.imageUrl = URL.createObjectURL(file.raw);
      // console.log(res, file);

      this.form.logoUrl = res.data
      this.$refs.form.clearValidate('logoUrl')
    },
    beforeAvatarUpload (file) {
      // const isJPG = file.type === 'image/jpeg';
      const isJPG = ['image/jpeg', 'image/png'].includes(file.type);
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return isJPG && isLt2M;
    },
    async addOrUpdateTrademark () {
      // const result = await this.$API.trademark.addTrademark(this.form)
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          const { form } = this
          console.log(form.id);

          let result
          if (form.id) {
            result = await this.$API.trademark.updateTrademark(this.form)
          } else {
            result = await this.$API.trademark.addTrademark(this.form)
          }
          if (result.code === 200) {
            this.$message({
              type: 'success',
              message: `${form.id ? '更新' : '添加'}品牌信息成功!`
            })
            this.getTrademarkList()
            this.dialogFormVisible = false
          } else {
            this.$message({
              type: 'error',
              message: `${form.id ? '更新' : '删除'}品牌信息失败!`
            })
          }
        }
      })

    },
    showUpdate (trademark) {
      this.dialogFormVisible = true
      this.form = { ...trademark }
    },
    async deleteTrademark (trademark) {
      // console.log(trademark.id);
      // const { tmName, id } = { ...trademark }
      // if (window.confirm(`你确定要删除:"${trademark.tmName}"这个品牌的数据吗？`)) {
      //   const result = await this.$API.trademark.deleteTrademark(trademark.id)
      //   if (result.code === 200) {
      //     this.$message({
      //       type: 'success',
      //       message: `删除 ${trademark.tmName} 该品牌数据成功！`
      //     })
      //     this.getTrademarkList()
      //   } else {
      //     this.$message({
      //       type: 'error',
      //       message: `删除 ${trademark.tmName} 该品牌数据失败！`
      //     })
      //   }
      // }

      this.$confirm(`此操作将永久删除${trademark.tmName}, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const result = await this.$API.trademark.deleteTrademark(trademark.id)
        if (result.code === 200) {
          this.$message({
            type: 'success',
            message: '删除成功！'
          })
          this.getTrademarkList(this.trademark.length === 1 ? this.page - 1 : this.page)
        } else {
          this.$message({
            type: 'error',
            message: '已取消删除！'
          });
        }
      }).catch(() => {
        this.$message({
          type: 'error',
          message: '删除失败！'
        });
      });
    }
  }
}
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
