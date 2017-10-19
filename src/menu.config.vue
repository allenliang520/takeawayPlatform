<script>
var imp = {}
var menu = {}
menu.menuList = [
  {
    className: '店铺管理',
    classKey: 'shopManager',
    children: [
      {
        name: '店铺列表',
        key: 'search',
        show: true
      },
      {
        name: '店铺添加',
        key: 'add',
        show: true
      },
      {
        name: '店铺编辑',
        key: 'add',
        show: false,
        params: ['id']
      }
    ]
  },
  {
    className: '商品管理',
    classKey: 'goodManager',
    children: [
      {
        name: '商品列表',
        key: 'search',
        show: true
      },
      {
        name: '商品添加',
        key: 'add',
        show: true
      },
      {
        name: '商品编辑',
        key: 'add',
        actkey: 'add',
        show: false,
        params: ['id']
      },
      {
        name: '分类列表',
        key: 'typeSearch',
        actKey: 'typeAdd',
        show: true
      },
      {
        name: '分类添加',
        key: 'typeAdd',
        show: false
      },
      {
        name: '分类编辑',
        key: 'typeAdd',
        show: false,
        params: ['id']
      }
    ]
  }
]
menu.menuRouter = []
menu.menuList.forEach(function (t) {
  t.children.forEach(function (n) {
    var o = {}
    o.path = ':classKey'
    o.name = t.classKey + n.key
    o.path += '/:key/' + o.name
    if (n.params) {
      for (var k = 0; k < n.params.length; k++) {
        o.path += (k === 0 ? '?' : '&') + '' + n.params[k]
      }
    }
    imp[t.classKey + n.key] = resolve => require(['@/components/Cms/' + t.classKey + '/' + n.key], resolve)
    o.component = imp[t.classKey + n.key]
    menu.menuRouter.push(o)
  }, this)
}, this)
export default menu
</script>