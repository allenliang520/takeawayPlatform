<script>
import Menu from '@/components/Cms/Menu'
var imp = {
  shopManageradd: resolve => require(['@/components/Cms/shopManager/add'], resolve),
  shopManagersearch: resolve => require(['@/components/Cms/shopManager/search'], resolve),
  goodManageradd: resolve => require(['@/components/Cms/goodManager/add'], resolve),
  goodManagersearch: resolve => require(['@/components/Cms/goodManager/search'], resolve),
  goodManagertypeAdd: resolve => require(['@/components/Cms/goodManager/typeAdd'], resolve),
  goodManagertypeSearch: resolve => require(['@/components/Cms/goodManager/typeSearch'], resolve)
}
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
var menuDefault = {
  path: '/',
  name: 'menu',
  components: {
    menu: Menu
  }
}
menu.menuRouter.push(menuDefault)
for (var i = 0; i < menu.menuList.length; i++) {
  for (var n = 0; n < menu.menuList[i].children.length; n++) {
    var o = {}
    o.path = ':classKey'
    o.name = menu.menuList[i].classKey + menu.menuList[i].children[n].key
    o.components = {}
    o.components.menu = Menu
    o.path += '/:key/' + o.name
    if (menu.menuList[i].children[n].params) {
      for (var k = 0; k < menu.menuList[i].children[n].params.length; k++) {
        o.path += (k === 0 ? '?' : '&') + '' + menu.menuList[i].children[n].params[k]
      }
    }
    o.components.main = imp[menu.menuList[i].classKey + menu.menuList[i].children[n].key]
    menu.menuRouter.push(o)
  }
}
console.log(menu)
export default menu
</script>