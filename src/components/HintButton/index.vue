<template>
<a href="javascript:;" :title="title" style="margin-right:20px">
    <el-button  v-bind="$attrs" v-on="$listeners"></el-button>
</a>
</template>

<script>
export default {
  name: "HintButton",
  props:['title']
}
</script>
