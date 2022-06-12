<template>
  <div>
    <el-form :inline="true" class="demo-form-inline" :model="cForm" :disabled="!isShowList">
      <el-form-item label="一级分类">
        <el-select
          v-model="cForm.category1Id"
          value=""
          placeholder="请选择"
          @change="handleCategory1"
        >
          <el-option
            :label="c1.name"
            :value="c1.id"
            v-for="c1 in category1List"
            :key="c1.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select
          v-model="cForm.category2Id"
          value=""
          placeholder="请选择"
          @change="handleCategory2"
        >
          <el-option
            :label="c2.name"
            :value="c2.id"
            v-for="c2 in category2List"
            :key="c2.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select value="" placeholder="请选择" v-model="cForm.category3Id" @change="handlerCategory3(cForm.category3Id)">
          <el-option
            :label="c3.name"
            :value="c3.id"
            v-for="c3 in category3List"
            :key="c3.id"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "CategorySelector",
  props:['isShowList'],
  data() {
    return {
      category1List: [],
      category2List: [],
      category3List: [],
      cForm: {
        category1Id: "",
        category2Id: "",
        category3Id: "",
      },
    };
  },
  mounted() {
    this.getCategoryList1();
  },
  methods: {
    async getCategoryList1() {
      let result = await this.$API.category.getCategory1();
      if (result.code === 200) {
        this.category1List = result.data;
      }
    },
    async handleCategory1() {
      this.category2List = [];
      this.category3List = [];
      this.cForm.category2Id = "";
      this.cForm.category3Id = "";
      //选中1级要触发自定义事件 把1级的id传递给父组件
      // this.$emit('handlerCategory',category1Id) //因为我们传递的id区分不了是几级id
      this.$emit("handlerCategory", { categoryId: this.cForm.category1Id, level: 1 });

      let result = await this.$API.category.getCategory2(
        this.cForm.category1Id
      );
      if (result.code === 200) {
        this.category2List = result.data;
      }
    },
    async handleCategory2() {
      this.category3List = [];
      this.cForm.category3Id = "";
      //选中2级要触发自定义事件 把2级的id传递给父组件
      // this.$emit('handlerCategory',category2Id)
      this.$emit("handlerCategory", { categoryId: this.cForm.category2Id, level: 2 });
      let result = await this.$API.category.getCategory3(
        this.cForm.category2Id
      );
      if (result.code === 200) {
        this.category3List = result.data;
      }
    },
     handlerCategory3(category3Id){
      //三级选中
      //选中3级要触发自定义事件 把3级的id传递给父组件
      // this.$emit('handlerCategory',category3Id)
      this.$emit('handlerCategory',{categoryId:this.cForm.category3Id,level:3})
    }
  },
};
</script>

<style lang="less" scoped>
</style>
