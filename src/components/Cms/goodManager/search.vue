<template>
  <div id="search">
    <form class="form-inline">
      <div class="form-group">
        <label>店铺:</label>
        <select name="" id="" class="form-control input-sm" v-model="shopId" @change="getGoods()">
          <option v-for="o in shopsList" :key="o.id" :value="o.id" v-text="o.name"></option>
        </select>
        &nbsp;&nbsp;
      </div>
      <div class="form-group">
        <label>分类:</label>
        <select name="" id="" class="form-control input-sm" v-model="type" @change="getGoods()">
          <option v-for="o in typeList" :key="o.id" :value="o.id" v-text="o.name"></option>
        </select>
        &nbsp;&nbsp;
      </div>
      <div class="form-group">
        <label>状态:</label>
        <select name="" id="" class="form-control input-sm" v-model="status" @change="getGoods()">
          <option value="-1">全部</option>
          <option value="0">无效</option>
          <option value="1">有效</option>
        </select>
        &nbsp;&nbsp;
      </div>
    </form>
    <page-limit :data="goodsList" :limitSize="4">
      <template slot="pagedata" scope="props">
        <table class="table table-striped table-hover">
          <thead>
            <tr>
              <th>#</th>
              <th>店铺</th>
              <th>分类</th>
              <th>名称</th>
              <th>价格</th>
              <th>开始日期</th>
              <th>结束日期</th>
              <th>可用星期</th>
              <th>状态</th>
              <th>创建时间</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="o in props.data" :key="o.id">
              <td>{{o.id}}</td>
              <td>{{shopsList.searchByKey('id',o.shopId).name}}</td>
              <td>{{typeList.searchByKey('id',o.type).name}}</td>
              <td>{{o.name}}</td>
              <td>{{o.price}}</td>
              <td>{{o.startDate}}</td>
              <td>{{o.endDate}}</td>
              <td>
                <span class="" v-if="o.userableWeeks.length==0">全部&nbsp;</span>
                <span class="" v-if="o.userableWeeks.length>0" v-for="p in o.userableWeeks" :key="p">{{p==0?"7":p}},&nbsp;</span> 
              </td>
              <td :class="{'text-danger':o.status==0,'text-success':o.status==1}">{{o.status==0?'无效':'有效'}}</td>
              <td>{{o.createtime}}</td>
              <td>
                <button class="btn btn-default btn-sm" v-if="o.status==1" @click="statusCheck(o,0)">无效</button>
                <button class="btn btn-default btn-sm" v-if="o.status==0" @click="statusCheck(o,1)">生效</button>
                <router-link class="btn btn-default btn-sm" :to="{name:'shopManageradd',params:{classKey:'shopManager',key:'add'},query:{id:o.id}}">
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
      test: 1234,
      shopsList: [],
      typeList: [],
      goodsList: [],
      shopId: -1,
      type: -1,
      status: -1,
      pageOption: {
        limitSize: 10,
        page: 1,
        totalPage: 10,
        maxSize: 8,
        size: 'md',
        boundaryLinks: true
      }
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
            var _default = [{id: -1, name: '全部'}]
            this.shopsList = _default.concat(res.data.data)
          }
        }
        .bind(this)
      )
    this.$ajax(
      {
        method: 'get',
        url: '/cms/searchAllGoodsType?status=-1'
      }
      ).then(
        function (res) {
          if (res.data.code === 0) {
            var _default = [{id: -1, name: '全部'}]
            this.typeList = _default.concat(res.data.data)
          }
        }
        .bind(this)
      )
    this.getGoods()
  },
  methods: {
    getGoods: function () {
      this.$ajax(
        {
          method: 'get',
          url: '/cms/searchAllGood?status=' + this.status + '&type=' + this.type + '&shopId=' + this.shopId
        }
        ).then(
          function (res) {
            if (res.data.code === 0) {
              this.goodsList = res.data.data
            }
          }
          .bind(this)
        )
    },
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
          url: '/cms/setGoodstatus?status=' + t,
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
