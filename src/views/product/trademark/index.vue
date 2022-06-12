<template>
  <div>
    <el-button
      type="primary"
      size="default"
      icon="el-icon-plus"
      @click="addTrade"
    >添加</el-button>
    <!-- 表格 -->
    <el-table
      :data="records"
      border
      style="margin: 20px 0"
    >
      <el-table-column
        prop="id"
        label="序号"
        align="center"
        width="80"
      />

      <el-table-column
        prop="tmName"
        label="品牌名称"
        align="center"
        width="width"
      />

      <el-table-column
        label="品牌LOGO"
        align="center"
        width="width"
      >
        <template slot-scope="{ row }">
          <img
            :src="row.logoUrl"
            alt="logo"
            class="img"
          >
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        width="width"
      >
        <template slot-scope="{ row }">
          <el-button
            type="primary"
            icon="el-icon-edit"
            @click="showUpdateDialog(row)"
          >修改</el-button>
          <el-button
            type="success"
            icon="el-icon-delete"
            @click="deleteTrademark(row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <el-pagination
      style="text-align: center"
      :current-page.sync="trademarkList.current"
      :page-size="trademarkList.size"
      :page-sizes="[3, 5, 7]"
      layout="total, prev, pager, next, jumper,sizes"
      :total="trademarkList.total"
      background
      :pager-count="5"
      @size-change="sizeChange"
      @current-change="currentChange"
    />
    <!-- 添加修改弹出对话框 -->
    <el-dialog
      title="添加品牌"
      :visible.sync="dialogFormVisible"
    >
      <el-form
        ref="tmForm"
        style="width: 80%"
        :rules="rules"
        :model="tmForm"
      >
        <el-form-item
          label="品牌名称"
          label-width="100px"
          prop="tmName"
        >
          <el-input
            v-model="tmForm.tmName"
            autocomplete="off"
          />
        </el-form-item>
        <el-form-item
          label="品牌logo"
          size="normal"
          prop="logoUrl"
          label-width="100px"
        >
          <el-upload
            class="avatar-uploader"
            action="/dev-api/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img
              v-if="tmForm.logoUrl"
              :src="tmForm.logoUrl"
              class="avatar"
            >
            <i
              v-else
              class="el-icon-plus avatar-uploader-icon"
            />
            <div
              slot="tip"
              class="el-upload__tip"
            >
              只能上传jpg/png文件，且不超过500kb
            </div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="addOrUpdateTrademark"
        >确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Trademark',
  data() {
    return {
      page: 1,
      limit: 3,
      trademarkList: [],
      dialogFormVisible: false,
      tmForm: {
        tmName: '',
        logoUrl: ''
      },
      rules: {
        tmName: [
          { required: true, message: '请输入品牌名称', trigger: 'blur' },
          {
            min: 2,
            max: 10,
            message: '长度在 2 到 10 个字符',
            trigger: 'blur'
          }
        ],
        logoUrl: [{ required: true, message: '请上传图片', trigger: 'change' }]
      }
    }
  },
  computed: {
    records() {
      return this.trademarkList.records
    }
  },
  mounted() {
    this.getTradeMarkList()
  },
  methods: {
    async getTradeMarkList(page = 1) {
      const res = await this.$API.trademark.getPageList(this.page, this.limit)
      if (res.code === 200) {
        this.trademarkList = res.data
      }
    },
    // 每页显示数量切换
    sizeChange(limit) {
      this.limit = limit
      this.getTradeMarkList()
    },
    // 切换分页器
    currentChange(page) {
      this.page = page
      this.getTradeMarkList()
    },
    addTrade() {
      this.dialogFormVisible = true
      this.tmForm.tmName = ''
      this.tmForm.logoUrl = ''
    },
    // 添加或修改品牌
    addOrUpdateTrademark() {
      // 整体验证
      this.$refs.tmForm.validate(async(valid) => {
        if (valid) {
          const trademark = this.tmForm
          try {
            await this.$API.trademark.addOrUpdateTrademark(trademark)
            this.$message.success(trademark.id ? '修改成功' : '添加成功')
            this.dialogFormVisible = false
            this.getTradeMarkList(trademark.id ? this.page : 1)
          } catch (error) {
            this.$message.error(trademark.id ? '修改失败' : '添加失败')
          }
        } else {
          alert('提交失败!!')
          return false
        }
      })
    },
    // 点击修改
    showUpdateDialog(row) {
      this.dialogFormVisible = true
      this.tmForm = { ...row } // 浅拷贝
    },
    deleteTrademark(row) {
      this.$confirm(`此操作将永久删除${row.tmName}, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          try {
            await this.$API.trademark.delete(row.id)
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.getTradeMarkList(this.records > 1 ? this.page : this.page - 1)
          } catch (error) {
            this.$message({
              message: '删除品牌失败',
              type: 'error'
            })
          }
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 图片上传成功
    handleAvatarSuccess(res, file) {
      this.tmForm.logoUrl = res.data
    },
    // 图片上传前
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 8

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    }
  }
}
</script>

<style>
.img {
  width: 128px;
  height: 128px;
}
.avatar-uploader .el-upload {
  border: 1px dashed #140606;
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
