<template>
  <div id="search">
    <page-limit :data="shopsList" >
      <template slot="pagedata" scope="props">        
        <table class="table table-striped table-hover ">
          <thead>
            <tr>
              <th>#</th>
              <th>名称</th>
              <th>地址</th>
              <th>电话</th>
              <th>状态</th>
              <th>创建时间</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="o in props.data" :key="o.id">
              <td>{{o.id}}</td>
              <td>{{o.name}}</td>
              <td>{{o.address}}</td>
              <td><span class="" v-for="p in o.phone" :key="p">{{p}},&nbsp;</span> </td>
              <td :class="{'text-danger':o.status==0,'text-success':o.status==1}">{{o.status==0?'无效':'有效'}}</td>
              <td>{{o.createtime}}</td>
              <td>
                <button class="btn btn-default btn-sm" v-if="o.status==1" @click="statusCheck(o,0)">无效</button>
                <button class="btn btn-default btn-sm" v-if="o.status==0" @click="statusCheck(o,1)">生效</button>
                <router-link class="btn btn-default btn-sm" :to="{name:'shopManageradd',query:{id:o.id}}">
                  编辑
                </router-link>
              </td>
            </tr>
          </tbody>
        </table>
        <div class="pageLimitCon">
          <pagination class="text-center" v-model="props.pageOption.page" :total-page="props.pageOption.totalPage" :boundary-links="props.pageOption.boundaryLinks" :max-size="props.pageOption.maxSize"  :size="props.pageOption.size" ></pagination>
          <div class="limitSize">
            <span>每页显示</span>
            <input type="text" class="form-control input-sm" v-model="props.pageOption.limitSize" style="display: inline-block;width: 40px;text-align: center;">
            <span>条</span>
          </div>
        </div>
      </template>
    </page-limit>
  </div>
</template>

<script>
export default {
  name: 'search',
  data () {
    return {
      shopsList: []
    }
  },
  mounted () {
    this.$ajax(
      {
        method: 'get',
        url: '/cms/searchAllShop?status=-1'
      }
      ).then(
        function (res) {
          if (res.data.code === 0) {
            this.shopsList = res.data.data
          }
        }
        .bind(this)
      )
  },
  methods: {
    statusCheck: function (o, t) {
      this.modalShow({
        backdrop: true,
        text: '确定设置 ' + o.name + ' ' + (t === 0 ? '无效?' : '有效?'),
        okFn: function () {
          this.setShopStatus(o, t)
        }.bind(this)
      })
    },
    setShopStatus: function (o, t) {
      console.log(o)
      this.$ajax(
        {
          method: 'post',
          url: '/cms/setShopStatus',
          data: {
            status: t,
            id: o.id
          }
        }
        ).then(
          function (res) {
            if (res.data.code === 0) {
              o.status = t
            }
            this.msgShow(res.data.message)
          }
          .bind(this)
        )
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

</style>
