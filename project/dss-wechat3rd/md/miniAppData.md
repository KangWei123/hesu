### 行业模板(小程序):

- id  自增

- industryId  行业Id
- industryName 行业名称
- productAppId  小程序生产者AppId(这个字段可能拿不到, 用处是什么?)
- draftId(草稿Id, 对应微信后台哪一条草稿)
- templateId  模板Id
- config 配置信息
- status 状态, 0:开发配置, 1:运营配置, 2:发布(前端可见 )
- desc 模板描述  (运营添加)
- img 模板封面图片 (运营添加)
- ext 扩展字段
- createTime 创建时间
- updateTime 更新时间



### 行业模板页面配置(在行业模板发布时生成):

- id 自增
- pageKey 页面key, 如 "page/index"
- pageValue 页面key对应的唯一value
- name 页面名字
- config 页面配置



### 用户模板(小程序)

- id 子增
- sellerId 用户 id
- appId 用户在平台创建的店铺appId(对应一个小程序和公众号)
- maAppId 用户小程序appId
- codeCommitInfo 小程序代码上传信息(这里是前端上传给我的)
- auditId 审核Id
- auditStatus 审核状态
- auditStatusDesc 审核状态描述
- reason 审核失败原因
- qrCodePath 体验二维码(这里可以和前端商量怎么返回byte[]还是base64)
- accessStatus 小程序线上代码的可见状态，发布后默认可访问，close(0)为不可见，open(1)为可见
- ext 扩展字段
- createTime 创建时间
- updateTime 更新时间



### 用户模板页面配置(用户点击保存时生成)

- id 自增
- maAppId 用户小程序appId
- pageKey 页面key, 同行业模板的页面配置key一样
- pageValue key 对应的唯一value
- name 用户页面名字
- config 页面配置
- url 页面url
- status 页面状态(目前没想到用处)
- ext 扩展字段



### 流程

###### 开发运营后台操作:

1. (草稿生产者) 小程序模板生产者(开发) ---> 生成小程序模板 ---> 保存到微信草稿箱
2. (草稿消费者&行业模板生产者) 进入小程序管理后台 ---> 草稿箱管理 ---> 获取所有的草稿箱列表 ---> 开发操作草稿(添加配置, 选择行业等) ---> 发布草稿 ---> 生成微信小程序模板
3. (行业模板消费者&页面配置生产者)  进入小程序管理后台 ---> 模板管理 ---> 获取所有模板 ---> 运营操作(添加描述, 图片等信息) ---> 发布模板 ---> 前端可使用 ---> 生成页面配置

###### 用户前端操作:

1. 用户首次装修店铺 ---> 选择行业模板 ---> 后台返回默认配置 ---> 用户操作并保存 ---> 生成用户模板配置和相关页面配置
2. 用户再次装修店铺 ---> 选择店铺 ---> 返回用户上次保存的配置信息
3. 用户发布 ---> 状态扭转 ---> 发布消息推送



### 接口

- 获取草稿箱接口: 微信提供
- 发布草稿箱接口: /draft/release
- 发布模板接口: /template/release
- 用户模板配置信息查询接口: /config/query
- 用户页面配置信息查询接口: /page/query
- 用户配置信息保存接口: /config/save
- 用户小程序发布接口: /code/release























































































































































































































































































































































































































