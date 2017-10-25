<template>
  <div id="add">
    <div class="container-fluid">
      <form class="form-horizontal" @submit.prevent="submitPost">
        <div class="form-group">
          <label class="col-sm-2 control-label">店铺:</label>
          <div class="col-sm-10">
            <select name="" id="" class="form-control" v-model="goodData.shopId" required>
              <option v-for="o in shopsList" :key="o.id" :value="o.id" v-text="o.name"></option>
            </select>
          </div>
        </div>
        <div class="form-group">
          <label class="col-sm-2 control-label">名称:</label>
          <div class="col-sm-10">
            <input type="text" class="form-control" v-model="goodData.name" required>
          </div>
        </div>
        <div class="form-group">
          <label class="col-sm-2 control-label">价格:</label>
          <div class="col-sm-10">
            <input type="text" class="form-control" v-model="goodData.price" required>
          </div>
        </div>
        <div class="form-group">
          <label class="col-sm-2 control-label">分类:</label>
          <div class="col-sm-10">
            <select name="" id="" class="form-control" v-model="goodData.type">
              <option v-for="o in typeList" :key="o.id" :value="o.id" v-text="o.name"></option>
            </select>
          </div>
        </div>
        <div class="form-group">
          <label class="col-sm-2 control-label">有效开始日期:</label>
          <div class="col-sm-10">
            <dropdown>
              <input type="text" class="form-control"  data-role="trigger" v-model="goodData.startDate" required>
              <template slot="dropdown">
                <li>
                  <date-picker v-model="goodData.startDate"></date-picker>
                </li>
              </template>
            </dropdown>
          </div>
        </div>
        <div class="form-group">
          <label class="col-sm-2 control-label">有效结束日期:</label>
          <div class="col-sm-10">
            <dropdown>
              <input type="text" class="form-control"  data-role="trigger" v-model="goodData.endDate" required>
              <template slot="dropdown">
                <li>
                  <date-picker v-model="goodData.endDate" :limit-from="goodData.startDate"></date-picker>
                </li>
              </template>
            </dropdown>
          </div>
        </div>
        <div class="form-group">
          <label class="col-sm-2 control-label">有效星期:</label>
          <div class="col-sm-10">
            <multiselect :multiple="true" :options="weekList" label="name" :hide-selected="true" track-by="id" :close-on-select="false" v-model="goodData.userableWeeksArr"></multiselect>
          </div>
        </div>
        <div class="form-group">
          <label class="col-sm-2 control-label">状态:</label>
          <div class="col-sm-10">
            <select name="" id="" class="form-control" v-model="goodData.status">
              <option value="0">无效</option>
              <option value="1">有效</option>
            </select>
          </div>
        </div>
        <div class="form-group">
          <div class="col-sm-offset-2 col-sm-10">
            <button type="submit" class="btn btn-default">保存</button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'add',
  data () {
    return {
      shopsList: [],
      typeList: [],
      weekList: [
        {
          id: 0,
          name: '星期日'
        },
        {
          id: 1,
          name: '星期一'
        },
        {
          id: 2,
          name: '星期二'
        },
        {
          id: 3,
          name: '星期三'
        },
        {
          id: 4,
          name: '星期四'
        },
        {
          id: 5,
          name: '星期五'
        },
        {
          id: 6,
          name: '星期六'
        }
      ],
      goodData: {
        shopId: 0,
        name: '',
        price: 0,
        startDate: '',
        endDate: '',
        userableWeeks: [],
        userableWeeksArr: [],
        type: 0,
        status: 1
      }
    }
  },
  mounted () {
    console.log(this.$route)
    this.$ajax(
      {
        method: 'get',
        url: '/cms/searchAllShop?status=-1'
      }
      ).then(
        function (res) {
          if (res.data.code === 0) {
            this.shopsList = res.data.data
            this.goodData.shopId = this.shopsList[0].id
          }
        }
        .bind(this)
      )
    this.$ajax(
      {
        method: 'get',
        url: '/cms/searchAllGoodsType'
      }
      ).then(
        function (res) {
          if (res.data.code === 0) {
            this.typeList = res.data.data
            this.goodData.type = this.typeList[0].id
          }
        }
        .bind(this)
      )
    if (this.$route.query.id) {
      this.$ajax(
        {
          method: 'get',
          url: '/cms/searchGood?id=' + this.$route.query.id
        }
        ).then(
          function (res) {
            if (res.data.code === 0) {
              this.goodData = res.data.data
              this.goodData.userableWeeksArr = this.weekToObj(this.goodData.userableWeeks)
            }
          }
          .bind(this)
        )
    }
  },
  methods: {
    weekToString: function (o) {
      var arr = []
      for (var i = 0; i < o.length; i++) {
        arr.push(o[i].id)
      }
      return arr.toString()
    },
    weekToObj: function (o) {
      var arr = []
      for (var i = 0; i < o.length; i++) {
        for (var k = 0; k < this.weekList.length; k++) {
          if (o[i] === this.weekList[k].id) {
            arr.push(this.weekList[k])
          }
        }
      }
      return arr
    },
    submitPost: function () {
      this.goodData.userableWeeks = this.weekToString(this.goodData.userableWeeksArr)
      this.$ajax(
        {
          method: 'post',
          url: '/cms/saveGood',
          data: this.goodData
        }
      ).then(
        function (res) {
          if (res.data.code === 0) {
            this.msgShow(res.data.message)
            this.$router.push({name: 'shopManagersearch'})
          } else {
            this.msgShow(res.data.message)
          }
        }
        .bind(this)
      )
      return false
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
