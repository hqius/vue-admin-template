<template>
  <div>
    <el-form :model="spuForm">
      <el-form-item label="SPU名称" label-width="100px">
        <el-input v-model="spuForm.spuName" placeholder="SPU名称"></el-input>
      </el-form-item>
      <el-form-item label="品牌" label-width="100px">
        <el-select v-model="spuForm.tmId" placeholder="请选择品牌">
          <el-option
            :label="tm.tmName"
            :value="tm.id"
            v-for="tm in trademarkList"
            :key="tm.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="SPU描述" label-width="100px">
        <el-input
          v-model="spuForm.description"
          placeholder="SPU描述"
          rows="4"
        ></el-input>
      </el-form-item>
      <el-form-item label="SPU图片" label-width="100px">
        <el-upload
          :file-list="spuImageList"
          action="https://jsonplaceholder.typicode.com/posts/"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="" />
        </el-dialog>
      </el-form-item>
      <el-form-item label="销售属性" label-width="100px">
        <el-select v-model="spuForm" placeholder="还有1项未选择">
          <el-option label="label" value="1"> </el-option>
        </el-select>
        <el-button type="primary" icon="el-icon-plus" style="margin-left: 20px"
          >添加销售属性</el-button
        >
        <el-table border stripe :data="spuForm.spuSaleAttrList">
          <el-table-column type="index" label="序号" width="80">
          </el-table-column>
          <el-table-column prop="saleAttrName" label="属性名" width="width">
          </el-table-column>
          <el-table-column prop="" label="属性值名称列表" width="width">
            <template slot-scope="{row}">
              <el-tag
               v-for="saleAttrValue in row.spuSaleAttrValueList" :key="saleAttrValue.id"
                closable
                :disable-transitions="false"
                @close="handleClose(tag)"
              >
                {{ saleAttrValue.saleAttrValueName }}
              </el-tag>
              <el-input
                class="input-new-tag"
                v-if="inputVisible"
                v-model="inputValue"
                ref="saveTagInput"
                size="small"
                @keyup.enter.native="handleInputConfirm"
                @blur="handleInputConfirm"
              >
              </el-input>
              <el-button
                v-else
                class="button-new-tag"
                size="small"
                @click="showInput"
                >+ New Tag</el-button
              >
            </template>
          </el-table-column>
          <el-table-column prop="" label="操作" width="width">
            <template slot-scope="{row}">
              <HintButton type="danger" icon="el-icon-delete" size="mini" title="删除销售属性"></HintButton>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item label-width="100px">
        <el-button type="primary">保存</el-button>
        <el-button @click="$emit('update:visible', false)">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "SpuForm",
  props: ["visible"],
  data() {
    return {
      dialogImageUrl: "",
      dialogVisible: false,
      spuForm: {
        category3Id: "",
        description: "",
        spuImageList: [],
        spuName: "",
        tmId: "",
      }, //请求初始化spu详情数据
      spuImageList: [], //请求初始化的spu图片列表
      trademarkList: [], //请求初始化的所有品牌列表
      saleAttrList: [], //请求初始化的所有销售属性列表
    };
  },
  methods: {
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    async getUpdateSpuFormInitData(row) {
      //根据spu id获取spu详情
      const result = await this.$API.spu.get(row.id);
      if (result.code === 200) {
        this.spuForm = result.data;
      }
      //根据spu id获取spu图片列表
      const spuImage = await this.$API.sku.getSpuImageList(row.id);
      if (spuImage.code === 200) {
        this.spuImageList = spuImage.data.forEach((item) => {
          item.name = item.imgName;
          item.url = item.imgUrl;
        });
      }
      //获取所有品牌列表
      const trademarkRes = this.$API.trademark.getList();
      if (trademarkRes.code === 200) {
        this.trademarkList = trademarkRes.data;
      }
      //获取所有销售属性列表
      const saleAttr = await this.$API.spu.getSaleAttrList();
      if (saleAttr.code === 200) {
        this.saleAttrList = saleAttr.data;
      }
    },
    getAddSpuFormInitData() {},
  },
};
</script>
<style>
  .el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
</style>


