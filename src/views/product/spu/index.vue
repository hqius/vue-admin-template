<template>
  <div>
    <el-card shadow="always">
      <CategorySelector
        :is-show-list="isShowList"
        @handlerCategory="handlerCategory"
      />
    </el-card>
    <el-card style="margin-top: 20px">
      <div v-show="!isShowSkuForm&&!isShowSpuForm">
        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="!category3Id"
          @click="showAddSpuForm"
        >添加SPU</el-button>
        <el-table :data="spuList">
          <el-table-column
            label="序号"
            type="index"
            width="80"
          />
          <el-table-column
            label="SPU名称"
            prop="spuName"
          />
          <el-table-column
            label="SPU描述"
            prop="description"
            width="width"
          />
          <el-table-column label="操作">
            <template slot-scope="{ row }">
              <HintButton
                type="success"
                icon="el-icon-plus"
                size="mini"
                title="添加SKU"
                @click="showAddSkuForm(row)"
              />
              <HintButton
                type="warning"
                icon="el-icon-edit"
                size="mini"
                title="修改SPU"
                @click="showUpdateSpuForm(row)"
              />
              <HintButton
                type="info"
                icon="el-icon-info"
                size="mini"
                title="查看SPU的SKU列表"
              />
              <HintButton
                type="danger"
                icon="el-icon-delete"
                size="mini"
                title="删除SPU"
              />
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          style="text-align: center"
          :current-page="page"
          :page-sizes="[2, 4, 6]"
          :page-size="limit"
          layout=" prev, pager, next, jumper,->,sizes,total"
          :total="total"
          background
          :pager-count="7"
          @current-change="getSpuList"
          @size-change="handleSizeChange"
        />
      </div>
      <!-- spu提交和修改页面 -->
      <SpuForm
        v-show="isShowSpuForm"
        ref="spu"
        :visible.sync="isShowSpuForm"
      />
      <!-- sku添加页面 -->
      <SkuForm v-show="isShowSkuForm" />
    </el-card>
  </div>
</template>

<script>
import SkuForm from '../components/SkuForm.vue'
import SpuForm from '../components/SpuForm.vue'
export default {
  name: 'Spu',
  components: {
    SkuForm,
    SpuForm
  },
  data() {
    return {
      category1Id: '',
      category2Id: '',
      category3Id: '',
      spuList: [],
      isShowList: true,
      page: 1,
      limit: 3,
      total: 0,
      isShowSpuForm: false,
      isShowSkuForm: false
    }
  },
  methods: {
    handlerCategory({ categoryId, level }) {
      if (level === 1) {
        this.category1Id = categoryId
        this.category2Id = ''
        this.category3Id = ''
        this.spuList = []
      } else if (level === 2) {
        this.category2Id = categoryId
        this.category3Id = ''
        this.spuList = []
      } else {
        this.category3Id = categoryId
        this.getSpuList()
      }
    },
    async getSpuList(pager = 1) {
      this.page = pager
      const { page, limit, category3Id } = this
      const result = await this.$API.spu.getList(page, limit, category3Id)
      if (result.code === 200) {
        this.spuList = result.data.records
        this.total = result.data.total
      }
    },
    // 修改每页数量
    handleSizeChange(size) {
      this.limit = size
      this.getSpuList()
    },
    // 点击添加SPU回调，显示SPU
    showAddSpuForm() {
      this.isShowSpuForm = true
      this.$refs.spu.getAddSpuFormInitData()
    },
    // 点击修改spu的回调
    showUpdateSpuForm(row) {
      this.isShowSpuForm = true
      this.$refs.spu.getUpdateSpuFormInitData(row)
    },
    showAddSkuForm(row) {
      this.isShowSkuForm = true
    }
  }
}
</script>
