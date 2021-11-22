<template>
  <div class="goods-add-container">
    <!-- $route.query.status == 0 为废弃商品，disabledForm为父级页面传过来的值 -->
    <el-form
      class="goods-form"
      :class="$route.query.status == 0 || disabledForm ? 'form-disabled' : ''"
      v-if="showForm && goodsType"
      :model="form"
      ref="form"
      :rules="rules"
      label-width="140px"
      :disabled="$route.query.status == 0 || disabledForm"
    >
      <!-- 第一部分选择分类及标签区域 -->
      <!-- <div>
        <span class="goods-icon">1</span>
        <h3 class="goods-title">{{ `${goodsType.label}基本信息` }}</h3>
      </div>-->
      <div ref="navigation-1">
        <!-- <span class="goods-icon">1</span> -->
        <h2 class="goods-title" @click="showContent.showGoodsInfoContent = !showContent.showGoodsInfoContent">
          01.{{ goodsType.label + '基本信息' }}
          <i :class="showContent.showGoodsInfoContent ? 'el-icon-arrow-down' : 'el-icon-arrow-up'"></i>
        </h2>
      </div>

      <transition name="el-zoom-in-top">
        <div v-show="showContent.showGoodsInfoContent">
          <!-- 商品类型 -->
          <!-- <el-form-item label="商品类型:" prop="itemDetailDTO.wxItem.mode" v-if="labelType === 1">
            <el-select v-model="form.itemDetailDTO.wxItem.mode" :disabled="isEdit">
              <el-option :value="0" label="普通商品" />
              <el-option :value="1" label="积分商品" />
            </el-select>
          </el-form-item> -->

          <!-- 销售类型 -->
          <!-- <el-form-item label="销售类型:" prop="itemDetailDTO.wxItem.salesType" v-if="labelType === 1">
            <el-select
              v-model="form.itemDetailDTO.wxItem.salesType"
              :disabled="isEdit && Boolean(form.itemDetailDTO.wxItem.mode)"
            >
              <el-option :value="0" label="线上售卖" />
              <el-option :value="1" v-if="!isIntegral" label="不支持线上售卖" />
            </el-select>
            <span class="notes" v-if="form.itemDetailDTO.wxItem.salesType"
              >*此类型商品仅作为线上展示，不支持线上下单，客户可到店咨询后购买</span
            >
          </el-form-item> -->

          <!-- 分类 -->
          <el-form-item :label="goodsType.label + '分类:'" class="goods-label" prop="itemDetailDTO.wxItem.categoryId">
            <goods-category-cascader
              :active-goods-type="goodsType"
              class="goods-w177 primary-inputHeight"
              ref="goodsCategoryCascader"
              :selected-category="form.itemDetailDTO.wxItem.categoryDTO"
              v-model="form.itemDetailDTO.wxItem.categoryId"
              @change="onHandleCategoryChange"
            />
            <span class="link" v-if="isManager" type="text" round @click="addClassfiy()">快速增加分类</span>
          </el-form-item>

          <!-- 标签 -->
          <el-form-item :label="goodsType.label + '标签:'" class="goods-label" v-if="!isCustomGoods">
            <goods-label-select
              class="goods-w177 primary-inputHeight"
              :select-label-id="form.itemDetailDTO.wxItem.labelIds"
              :label-type="labelType"
              ref="labelCascader"
              multiple
              @selectedLabelId="selectedLabelId"
            />
            <span class="link" type="text" round @click="addLabelPopup()">快速增加标签</span>
          </el-form-item>

          <!-- 标签(含标签分类) -->
          <el-form-item :label="goodsType.label + '标签:'" class="goods-label" v-if="isCustomGoods">
            <goods-label
              :list="form.itemDetailDTO.wxItem.labelIds"
              :label-mappings="form.itemDetailDTO.labelMappings"
              :label-type="labelType"
              :is-disabled-edit="isDisabledEdit || disabledForm"
              @selectedLabelId="selectedLabelId"
            ></goods-label>
          </el-form-item>

          <!-- 标签分类 -->
          <!-- <el-form-item :label="goodsType.label + '标签:'" class="goods-label">
        <goods-tags :value.sync="form.itemDetailDTO.wxItem.labelIds"></goods-tags>
          </el-form-item>-->
          <!-- <hr class="goods-hr" /> -->

          <!-- 第二部分填写商品基本信息部分 -->
          <!-- <div>
        <span class="goods-icon">2</span>
        <h3 class="goods-title" @click="showGoodsInfoContent = !showGoodsInfoContent">
          {{ goodsType.label + '基本信息' }}
          <i :class="showGoodsInfoContent ? 'el-icon-arrow-down' : 'el-icon-arrow-up'"></i>
        </h3>
          </div>-->

          <!-- <transition name="el-zoom-in-top">
          <div v-show="showGoodsInfoContent">-->

          <!-- 标题 -->
          <el-form-item :label="goodsType.label + '标题:'" class="goods-label" prop="itemDetailDTO.wxItem.name">
            <el-input
              :placeholder="'请输入' + goodsType.label + '名称'"
              class="goods-w366 primary-inputHeight"
              v-model="form.itemDetailDTO.wxItem.name"
            ></el-input>
          </el-form-item>

          <!-- 副标题 -->
          <el-form-item :label="goodsType.label + '副标题:'" class="goods-label" prop="itemDetailDTO.wxItem.subName">
            <el-input
              :placeholder="'请输入' + goodsType.label + '副标题'"
              class="goods-w366 primary-inputHeight"
              v-model="form.itemDetailDTO.wxItem.subName"
            ></el-input>
          </el-form-item>

          <!-- 条形码 -->
          <el-form-item
            label="条形码:"
            v-show="!computeShowSkuInfos"
            class="goods-label"
            prop="itemDetailDTO.wxItem.barcode"
          >
            <span>
              <el-input
                placeholder="支持14位内的数字+英文组合"
                class="goods-w366 primary-inputHeight"
                :disabled="isEdit"
                v-model="form.itemDetailDTO.wxItem.barcode"
              ></el-input>
              <div class="notes">*自定义条形码提交后不可修改，请谨慎填写（注:该项不填写时，系统会自动生成）</div>
            </span>
          </el-form-item>

          <!-- 虚拟销量 -->
          <el-form-item label="虚拟销量:" class="goods-label" prop="itemDetailDTO.wxItem.virtualSalesVolume">
            <span>
              <el-input-number
                :controls="false"
                placeholder="请输入虚拟销量"
                class="goods-w366 primary-inputHeight"
                v-model="form.itemDetailDTO.wxItem.virtualSalesVolume"
              ></el-input-number>
              <div class="notes">前端展示的销量=实际销量+虚拟销量</div>
            </span>
          </el-form-item>

          <!--预售(积分商品不参与)-->
          <template
            v-if="
              goodsType.type === goodsTypeEnum.product.type &&
              !form.itemDetailDTO.wxItem.salesType &&
              !form.itemDetailDTO.wxItem.mode
            "
          >
            <el-form-item label="预售设置:" prop="itemDetailDTO.wxItem.preSell" class="goods-label">
              <el-radio-group v-model="form.itemDetailDTO.wxItem.preSell" @change="preSellChange">
                <el-radio :label="false">否</el-radio>
                <el-radio :label="true">是</el-radio>
              </el-radio-group>
            </el-form-item>

            <!-- 预售时间 -->
            <el-form-item
              label="预售时间:"
              v-if="form.itemDetailDTO.wxItem.preSell"
              prop="preSellTime"
              class="goods-label"
            >
              <span class="pre-sale-label">预售开始时间</span>
              <el-date-picker
                type="datetime"
                size="mini"
                style="margin: 0 10px"
                v-model="form.preSellTime.startTime"
                value-format="yyyy-MM-dd HH:mm"
                format="yyyy-MM-dd HH:mm"
                placeholder="选择预售开始日期"
              ></el-date-picker>

              <span class="pre-sale-label">预售结束时间</span>
              <el-date-picker
                type="datetime"
                size="mini"
                style="margin: 0 10px"
                v-model="form.preSellTime.endTime"
                value-format="yyyy-MM-dd HH:mm"
                format="yyyy-MM-dd HH:mm"
                placeholder="选择预售结束日期"
                :picker-options="pickerStartTime"
              ></el-date-picker>
            </el-form-item>

            <!-- 发货时间 -->
            <el-form-item label="发货时间:" prop="itemDetailDTO.wxItem.deliveryTimeType" class="goods-label">
              <div v-if="!form.itemDetailDTO.wxItem.preSell">
                <span>购买后</span>
                <el-input
                  style="margin: 0 10px; width: 100px"
                  v-model="form.itemDetailDTO.wxItem.daysAfterBuyRange"
                ></el-input>
                <span>天发货</span>
              </div>

              <el-radio-group v-model="form.itemDetailDTO.wxItem.deliveryTimeType" v-else>
                <div>
                  <el-radio :label="1">购买时间</el-radio>
                  <span class="pre-sale-label">购买后</span>
                  <el-input
                    style="margin: 0 10px; width: 100px"
                    v-model="form.itemDetailDTO.wxItem.daysAfterBuyRange"
                  ></el-input>
                  <span class="pre-sale-label">天发货</span>
                </div>

                <div v-if="form.itemDetailDTO.wxItem.preSell" style="margin-top: 10px">
                  <el-radio :label="0">固定时间</el-radio>
                  <el-date-picker
                    type="datetime"
                    size="mini"
                    v-model="form.itemDetailDTO.wxItem.deliveryTime"
                    value-format="yyyy-MM-dd HH:mm"
                    format="yyyy-MM-dd HH:mm"
                    placeholder="预计发货时间"
                  ></el-date-picker>
                </div>
              </el-radio-group>
            </el-form-item>
          </template>

          <!-- 限购设置 -->
          <template v-if="!form.itemDetailDTO.wxItem.salesType">
            <el-form-item
              label="每人限购数量:"
              class="goods-label"
              :rules="rules.itemDetailDTO.wxItem.peopleLimitAmount"
              prop="itemDetailDTO.wxItem.peopleLimitAmount"
            >
              <div>
                <el-date-picker
                  v-model="form.itemDetailDTO.wxItem.peopleLimitRange"
                  :disabled="isEdit && activityList"
                  type="daterange"
                  range-separator="至"
                  value-format="yyyy-MM-dd"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                ></el-date-picker>
                <span class="goods-unit" style="margin-right: 10px">限购</span>
                <el-input
                  placeholder="请输入限购数量"
                  :disabled="isEdit && activityList"
                  class="goods-price primary-inputHeight"
                  v-model.number="form.itemDetailDTO.wxItem.peopleLimitAmount"
                />
                <span class="goods-unit">件</span>
              </div>
              <div class="notes">0为不限购，当商品参加营销活动时，不受此限购数量限制</div>
            </el-form-item>
          </template>

          <!--单位-->
          <div>
            <el-form-item
              label="单位:"
              class="goods-label"
              v-if="goodsType.type === goodsTypeEnum.product.type"
              prop="itemDetailDTO.wxItem.unit"
            >
              <el-input
                placeholder="请输入单位"
                class="goods-price primary-inputHeight"
                v-model.trim="form.itemDetailDTO.wxItem.unit"
              ></el-input>
            </el-form-item>
          </div>

          <!-- 积分商品价格设置 -->
          <template v-if="form.itemDetailDTO.wxItem.mode">
            <el-form-item
              label="售价:"
              class="goods-label"
              prop="itemDetailDTO.wxItem.integralPrice"
              :key="form.itemDetailDTO.wxItem.mode"
            >
              <el-input
                class="goods-price"
                placeholder="不填或填'0',无需现金"
                v-model="form.itemDetailDTO.wxItem.salePrice"
              />
              <span> 元 + </span>
              <el-input
                class="goods-price"
                placeholder="不可为空或0"
                v-model="form.itemDetailDTO.wxItem.integralPrice"
              />
              <span> 积分</span>
              <div class="notes">积分不可为0,或空</div>
            </el-form-item>
            <el-form-item
              label="原价标签:"
              class="goods-label"
              v-if="!computeShowSkuInfos"
              :rules="rules.itemDetailDTO.wxItem.labelPrice"
              prop="itemDetailDTO.wxItem.labelPrice"
            >
              <el-input
                placeholder="请输入标价"
                class="goods-price primary-inputHeight"
                :disabled="isDisabledEdit"
                v-model="form.itemDetailDTO.wxItem.labelPrice"
              ></el-input>
              <span class="goods-unit">元</span>
              <div class="notes">若不输入原价，即默认售价等于原价，且在微商城不显示原价标签</div>
            </el-form-item>
          </template>
          <!-- 非积分商品价格设置 -->
          <template v-else>
            <!--价格类型 product、package销售类型时展示该选项-->
            <el-form-item
              label="价格:"
              v-if="goodsType.type === goodsTypeEnum.product.type && !form.itemDetailDTO.wxItem.salesType"
            >
              <el-radio-group v-model="form.itemDetailDTO.wxItem.frontMoneyItem">
                <el-radio :label="false">全款模式</el-radio>
                <el-radio :label="true">定金模式</el-radio>
              </el-radio-group>
            </el-form-item>

            <template v-if="!form.itemDetailDTO.wxItem.salesType">
              <!--价格范围 最低价-->
              <el-form-item :label="goodsType.label + '最低售价:'" prop="itemDetailDTO.wxItem.minItemPrice">
                <el-input
                  placeholder="请输入商品最低价"
                  class="goods-price primary-inputHeight"
                  v-model.trim="form.itemDetailDTO.wxItem.minItemPrice"
                ></el-input>
                <div class="notes">0为不限制</div>
              </el-form-item>

              <!--价格范围 最高价-->
              <el-form-item :label="goodsType.label + '最高售价:'" prop="itemDetailDTO.wxItem.maxItemPrice">
                <el-input
                  placeholder="请输入商品最高价"
                  class="goods-price primary-inputHeight"
                  v-model.trim="form.itemDetailDTO.wxItem.maxItemPrice"
                ></el-input>
                <div class="notes">0为不限制</div>
              </el-form-item>

              <!--定金模式售价、标价、定金-->
              <div v-if="form.itemDetailDTO.wxItem.frontMoneyItem">
                <el-form-item
                  label="售价:"
                  class="goods-label"
                  v-if="!computeShowSkuInfos"
                  prop="itemDetailDTO.wxItem.salePrice"
                >
                  <el-input
                    placeholder="请输入价格"
                    class="goods-price primary-inputHeight"
                    v-model="form.itemDetailDTO.wxItem.salePrice"
                  ></el-input>
                  <span class="goods-unit">元</span>
                </el-form-item>
                <!--标价-->
                <el-form-item
                  label="原价标签:"
                  class="goods-label"
                  v-if="!computeShowSkuInfos"
                  :rules="rules.itemDetailDTO.wxItem.labelPrice"
                  prop="itemDetailDTO.wxItem.labelPrice"
                >
                  <el-input
                    placeholder="请输入标价"
                    class="goods-price primary-inputHeight"
                    :disabled="isDisabledEdit"
                    v-model="form.itemDetailDTO.wxItem.labelPrice"
                  ></el-input>
                  <span class="goods-unit">元</span>
                  <div class="notes">若不输入原价，即默认售价等于原价，且在微商城不显示原价标签</div>
                </el-form-item>
                <!--定金-->
                <el-form-item
                  label="定金:"
                  v-if="!computeShowSkuInfos"
                  class="goods-label"
                  prop="itemDetailDTO.wxItem.frontMoney"
                >
                  <el-input
                    placeholder="请输入定金"
                    class="goods-price primary-inputHeight"
                    v-model="form.itemDetailDTO.wxItem.frontMoney"
                  ></el-input>
                  <span class="goods-unit">元</span>
                </el-form-item>
              </div>
              <!--非定金模式下的售价/标价-->
              <div v-else>
                <el-form-item
                  label="售价:"
                  class="goods-label"
                  v-if="!computeShowSkuInfos"
                  :rules="rules.itemDetailDTO.wxItem.salePrice"
                  prop="itemDetailDTO.wxItem.salePrice"
                >
                  <el-input
                    placeholder="请输入价格"
                    class="goods-price primary-inputHeight"
                    :disabled="isDisabledEdit"
                    v-model="form.itemDetailDTO.wxItem.salePrice"
                  ></el-input>
                  <span class="goods-unit">元</span>
                </el-form-item>
                <!--标价-->
                <el-form-item
                  label="原价标签:"
                  class="goods-label"
                  v-if="!computeShowSkuInfos"
                  :rules="rules.itemDetailDTO.wxItem.labelPrice"
                  prop="itemDetailDTO.wxItem.labelPrice"
                >
                  <el-input
                    placeholder="请输入标价"
                    class="goods-price primary-inputHeight"
                    :disabled="isDisabledEdit"
                    v-model="form.itemDetailDTO.wxItem.labelPrice"
                  ></el-input>
                  <span class="goods-unit">元</span>
                  <div class="notes">若不输入原价，即默认售价等于原价，且在微商城不显示原价标签</div>
                </el-form-item>
              </div>
            </template>

            <template v-else>
              <el-form-item label="价格标签" prop="itemDetailDTO.wxItem.displayPrice">
                <el-input class="goods-price" v-model="form.itemDetailDTO.wxItem.displayPrice" />
              </el-form-item>
            </template>
          </template>
          <!-- 成本价 -->
          <el-form-item
            label="成本价:"
            class="goods-label"
            v-if="goodsType.type === goodsTypeEnum.product.type"
            :rules="rules.itemDetailDTO.wxItem.costPrice"
            prop="itemDetailDTO.wxItem.costPrice"
          >
            <el-input
              placeholder="请输入价格"
              class="goods-price primary-inputHeight"
              :disabled="isDisabledEdit"
              v-model="form.itemDetailDTO.wxItem.costPrice"
            ></el-input>
            <span class="goods-unit">元</span>
          </el-form-item>

          <template v-if="!form.itemDetailDTO.wxItem.salesType">
            <!--运费-->
            <el-form-item
              label="运费设置:"
              class="goods-label"
              v-if="goodsType.type === goodsTypeEnum.product.type"
              :rules="rules.itemDetailDTO.wxItem.freightTemplateId"
              prop="itemDetailDTO.wxItem.freightTemplateId"
            >
              <el-radio-group v-model="isFixedFreight">
                <el-radio :label="true">固定运费</el-radio>
                <el-radio :label="false">运费模板</el-radio>
              </el-radio-group>

              <!--              <div>请设置固定运费或者选择一个运费模板</div>-->

              <div v-if="isFixedFreight">
                <span class="freight-label">固定运费:</span>
                <el-input
                  placeholder="请输入运费"
                  class="goods-price primary-inputHeight"
                  :disabled="isDisabledEdit"
                  v-model="form.itemDetailDTO.wxItem.freight"
                  @change="onFreightChange"
                ></el-input>
                <span class="goods-unit">元</span>
              </div>

              <div v-else style="margin-top: 10px">
                <span class="freight-label">运费模板:</span>
                <el-select
                  size="mini"
                  style="width: 166px"
                  clearable
                  :disabled="isDisabledEdit"
                  v-model="form.itemDetailDTO.wxItem.freightTemplateId"
                  placeholder="请选择运费模板"
                >
                  <el-option v-for="tpl in freightTplList" :key="tpl.id" :label="tpl.name" :value="tpl.id"></el-option>
                </el-select>
                <tpl-area-table :tpl="freightTpl"></tpl-area-table>
              </div>
            </el-form-item>
          </template>

          <el-form-item
            label="发票模板:"
            v-if="!form.itemDetailDTO.wxItem.salesType"
            class="goods-label"
            prop="itemDetailDTO.wxItem.invoiceTemplateId"
          >
            <div class="goods-w366">
              <el-select
                style="width: 100%"
                clearable
                v-model="form.itemDetailDTO.wxItem.invoiceTemplateId"
                placeholder="请选择发票模板"
              >
                <el-option v-for="tpl in invoiceTplList" :key="tpl.id" :label="tpl.name" :value="tpl.id"></el-option>
              </el-select>
            </div>
          </el-form-item>

          <!--视频 暂时隐藏-->
          <el-form-item :label="goodsType.label + '视频:'" class="goods-label" v-if="false">
            <el-input placeholder="请输入视频源地址，仅支持腾讯视频" class="goods-w366 primary-inputHeight"></el-input>
            <el-button type="primary" class="btn-preview">预览视频</el-button>
          </el-form-item>

          <!--图片-->
          <el-form-item
            :label="goodsType.label + '图片:'"
            class="goods-label"
            prop="itemDetailDTO.materialsId"
            :style="$route.query.status == 0 ? 'pointer-events: none;' : ''"
          >
            <dnd-container
              class="images-draggable"
              group-name="images-draggable"
              @drop="onDrop($event)"
              orientation="horizontal"
            >
              <dnd-draggable v-for="(item, index) in form.itemDetailDTO.materialsId" :key="index">
                <choose-images
                  v-model="form.itemDetailDTO.materialsId[index]"
                  :is-disabled-edit="isDisabledEdit || disabledForm"
                  :height="80"
                  :width="80"
                  style="margin-right: 10px"
                  @input="onImageAdd(index)"
                  @delete="onDeleteImg(index)"
                  :multiple="form.itemDetailDTO.materialsId[index].id === 0"
                  :limit="limit"
                  :disable="goodsImgCountLimit(index)"
                />
              </dnd-draggable>
            </dnd-container>
            <div style="color: #858c99; font-size: 12px; font-weight: 400; line-height: 15px">
              建议尺寸750*750，建议图片小于2M
            </div>
          </el-form-item>

          <!-- VR展示 -->
          <el-form-item label="VR展示:" class="goods-label" prop="itemDetailDTO.wxItem.vrUrl">
            <el-input
              placeholder="请输入VR链接"
              class="goods-price primary-inputHeight"
              v-model="form.itemDetailDTO.wxItem.vrUrl"
            ></el-input>
          </el-form-item>

          <el-form-item label="主图视频:" class="goods-label">
            <choose-video-single
              :is-disabled-edit="isDisabledEdit"
              :video.sync="form.itemDetailDTO.wxItem.videoUrl"
              :video-poster.sync="form.itemDetailDTO.wxItem.videoCoverUrl"
            ></choose-video-single>
            <div style="color: #858c99; font-size: 12px; font-weight: 400; line-height: 15px">
              建议尺寸:1:1比例视频，时长≤60s
            </div>
          </el-form-item>
        </div>
      </transition>

      <!-- 第二部分： 药品信息-->
      <!-- <hr class="goods-hr" v-if="env.MEDICINE || curApp.industryKey === 'medicine'" /> -->
      <div ref="navigation-drug" v-if="env.MEDICINE || curApp.industryKey === 'medicine'">
        <!-- <span class="goods-icon">2</span> -->
        <h3 class="goods-title" @click="showContent.showDrug = !showContent.showDrug">
          0.2药品信息
          <i :class="showContent.showDrug ? 'el-icon-arrow-down' : 'el-icon-arrow-up'"></i>
        </h3>
      </div>

      <transition name="el-zoom-in-top" v-if="env.MEDICINE || curApp.industryKey === 'medicine'">
        <div v-show="showContent.showDrug">
          <!--药品分类-->
          <el-form-item label="药品分类:" class="goods-label" prop="itemDetailDTO.wxItem.drugType">
            <el-radio-group v-model="form.itemDetailDTO.wxItem.drugType">
              <el-radio :label="drugEnum.drugType.unDrug">非处方药</el-radio>
              <el-radio :label="drugEnum.drugType.drug">处方药</el-radio>
            </el-radio-group>
          </el-form-item>
          <!-- 处方药信息 -->
          <drugForm
            ref="drugForm"
            :data="form.itemDetailDTO.wxItem"
            :disabled="$route.query.status == 0 || disabledForm"
          ></drugForm>

          <template v-if="env.MEDICINE">
            <el-form-item label="用药提醒:" prop="isMidicine" class="goods-label">
              <el-radio-group v-model="isMidicine" :disabled="isDisabledEdit">
                <el-radio :label="true">是</el-radio>
                <el-radio :label="false">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </template>
        </div>
      </transition>

      <!-- 第二部分：sku规格 -->
      <!-- <hr class="goods-hr" /> -->

      <div ref="navigation-2">
        <!-- <span class="goods-icon">{{ env.MEDICINE || curApp.industryKey === 'medicine' ? 3 : 2 }}</span> -->
        <h3 class="goods-title" @click="showContent.showGoodsSku = !showContent.showGoodsSku">
          {{ env.MEDICINE || curApp.industryKey === 'medicine' ? '03.' : '02.' }}SKU规格
          <i :class="showContent.showGoodsSku ? 'el-icon-arrow-down' : 'el-icon-arrow-up'"></i>
        </h3>
      </div>

      <transition name="el-zoom-in-top">
        <div v-show="showContent.showGoodsSku">
          <template v-if="!isCustomGoods && !isHomeIndustryApp">
            <!--规格-->
            <el-form-item label="规格:" prop="itemDetailDTO.skuTreeList" class="goods-label attr-label">
              <multi-goods-attribute
                v-model="form.itemDetailDTO.skuTreeList"
                :is-disabled-edit="isDisabledEdit || disabledForm"
                :goods-type="goodsType"
                :add-able="!isEdit"
                :add-sku-info-unique-keys="addSkuInfoUniqueKeys"
                @assemble-sku="onSkuInfosAssembled"
              />
            </el-form-item>

            <!--sku价格-->
            <el-form-item label="价格:" class="goods-label" prop="itemDetailDTO.skuInfoList" v-if="computeShowSkuInfos">
              <attribute-price-table
                v-model="form.itemDetailDTO.skuInfoList"
                :show-price="!form.itemDetailDTO.wxItem.salesType"
                :is-disabled-edit="isDisabledEdit || disabledForm"
                :disabled-barcode="isEdit"
                :is-integral="isIntegral"
                :is-front-money-item="form.itemDetailDTO.wxItem.frontMoneyItem"
                :default-price="Number(form.itemDetailDTO.wxItem.salePrice) || 0"
                :default-front-money="Number(form.itemDetailDTO.wxItem.frontMoney) || 0"
                :label-price="Number(form.itemDetailDTO.wxItem.labelPrice) || 0"
              />
            </el-form-item>
          </template>

          <!-- 规格选项：一级&多级 -->
          <template v-else-if="isCustomGoods && !isHomeIndustryApp">
            <el-form-item label="规格:" prop="itemDetailDTO.skuTreeList">
              <el-radio-group
                style="display: block; margin-bottom: 10px"
                v-model="form.itemDetailDTO.wxItem.skuType"
                @change="onChangeSkuInfoLevel"
              >
                <el-radio :label="0" :disabled="isEdit">一级规格</el-radio>
                <el-radio :label="1" :disabled="isEdit">多级规格</el-radio>
              </el-radio-group>

              <goods-specifications
                v-if="form.itemDetailDTO.wxItem.skuType === 1"
                v-model="form.itemDetailDTO.skuTreeList"
                :is-disabled-edit="isDisabledEdit || disabledForm"
                :add-able="!isEdit"
                :goods-type="goodsType"
                :add-sku-info-unique-keys="addSkuInfoUniqueKeys"
                @assemble-sku="onSkuInfosAssembled"
              ></goods-specifications>

              <multi-goods-attribute
                v-if="form.itemDetailDTO.wxItem.skuType === 0"
                v-model="form.itemDetailDTO.skuTreeList"
                :is-disabled-edit="isDisabledEdit || disabledForm"
                :disabled-barcode="isEdit"
                :goods-type="goodsType"
                :add-able="!isEdit"
                :add-sku-info-unique-keys="addSkuInfoUniqueKeys"
                @assemble-sku="onSkuInfosAssembled"
              />
            </el-form-item>

            <!--sku价格-->
            <el-form-item
              label="价格:"
              class="goods-label"
              prop="itemDetailDTO.skuInfoList"
              v-show="computeShowSkuInfos"
            >
              <goods-sku-info-table
                v-model="form.itemDetailDTO.skuInfoList"
                v-if="form.itemDetailDTO.wxItem.skuType === 1"
                :is-disabled-edit="isDisabledEdit || disabledForm"
                :disabled-barcode="isEdit"
                :is-front-money-item="form.itemDetailDTO.wxItem.frontMoneyItem"
                :default-price="Number(form.itemDetailDTO.wxItem.salePrice) || 0"
                :default-front-money="Number(form.itemDetailDTO.wxItem.frontMoney) || 0"
                :label-price="Number(form.itemDetailDTO.wxItem.labelPrice) || 0"
              />

              <!--sku价格-->
              <attribute-price-table
                :show-price="!form.itemDetailDTO.wxItem.salesType"
                v-model="form.itemDetailDTO.skuInfoList"
                v-if="form.itemDetailDTO.wxItem.skuType === 0"
                :is-disabled-edit="isDisabledEdit || disabledForm"
                :disabled-barcode="isEdit"
                :is-front-money-item="form.itemDetailDTO.wxItem.frontMoneyItem"
                :default-price="Number(form.itemDetailDTO.wxItem.salePrice) || 0"
                :default-front-money="Number(form.itemDetailDTO.wxItem.frontMoney) || 0"
                :label-price="Number(form.itemDetailDTO.wxItem.labelPrice) || 0"
              />
            </el-form-item>
          </template>

          <!-- sku改版 -->
          <template v-else-if="isHomeIndustryApp">
            <!--规格-->
            <el-form-item prop="itemDetailDTO.skuTreeList" class="goods-label attr-label">
              <sku-goods-attribute
                v-model="form.itemDetailDTO.skuTreeList"
                :is-disabled-edit="isDisabledEdit || disabledForm"
                :goods-type="goodsType"
                :is-integral="isIntegral"
                :add-able="!isEdit"
                :add-sku-info-unique-keys="addSkuInfoUniqueKeys"
                @assemble-sku="onSkuInfosAssembled"
              />
            </el-form-item>

            <!--sku价格-->
            <el-form-item class="goods-label" prop="itemDetailDTO.skuInfoList" v-if="computeShowSkuInfos">
              <sku-goods-info-table
                v-model="form.itemDetailDTO.skuInfoList"
                :show-price="!form.itemDetailDTO.wxItem.salesType"
                :is-disabled-edit="isDisabledEdit || disabledForm"
                :disabled-barcode="isEdit"
                :is-front-money-item="form.itemDetailDTO.wxItem.frontMoneyItem"
                :default-price="Number(form.itemDetailDTO.wxItem.salePrice) || 0"
                :default-front-money="Number(form.itemDetailDTO.wxItem.frontMoney) || 0"
                :label-price="Number(form.itemDetailDTO.wxItem.labelPrice) || 0"
              />
            </el-form-item>
          </template>
        </div>
      </transition>

      <!-- 第三部分：其他信息 -->
      <!-- <hr class="goods-hr" /> -->

      <div ref="navigation-3">
        <!-- <span class="goods-icon">{{ env.MEDICINE || curApp.industryKey === 'medicine' ? 4 : 3 }}</span> -->
        <h3 class="goods-title" @click="showContent.showGoodsOther = !showContent.showGoodsOther">
          {{ env.MEDICINE || curApp.industryKey === 'medicine' ? '04.' : '03.' }}其他信息
          <i :class="showContent.showGoodsOther ? 'el-icon-arrow-down' : 'el-icon-arrow-up'"></i>
        </h3>
      </div>

      <transition name="el-zoom-in-top">
        <div v-show="showContent.showGoodsOther">
          <!-- 参数设置 -->
          <el-form-item
            label="参数设置:"
            :prop="isCustomGoods ? 'itemDetailDTO.wxItem.paramSetting' : ''"
            class="goods-label"
            v-if="isCustomGoods"
          >
            <params-setting
              :param-banner-url="form.itemDetailDTO.wxItem.paramBannerUrl"
              :param-setting="form.itemDetailDTO.wxItem.paramSetting"
              :is-disabled-edit="isDisabledEdit || disabledForm"
              :disabled-barcode="isEdit"
              :selected-categorys="selectedCategorys"
              @update-param-banner="updateParamBanner"
            ></params-setting>
          </el-form-item>

          <!-- 常见问题 -->
          <el-form-item
            label="常见问题:"
            :prop="isCustomGoods ? 'itemDetailDTO.wxItem.commonQa' : ''"
            class="goods-label"
            v-if="isCustomGoods"
          >
            <question-answer-setting
              :common-qa="form.itemDetailDTO.wxItem.commonQa"
              :is-disabled-edit="isDisabledEdit || disabledForm"
              :disabled-barcode="isEdit"
            ></question-answer-setting>
          </el-form-item>

          <!-- 最佳cp -->
          <el-form-item label="推荐商品:" class="goods-label" v-if="isCustomGoods">
            <best-cp
              :recommend-list="form.itemDetailDTO.recommendList"
              :is-disabled-edit="isDisabledEdit || disabledForm"
              :is-edit="isEdit"
              :goods-type="goodsType"
            ></best-cp>
          </el-form-item>

          <!-- 服务类型设置 -->
          <template v-if="goodsType.type === goodsTypeEnum.server.type">
            <!-- 服务时长 -->
            <el-form-item label="时长:" class="goods-label">
              <el-input
                placeholder="请输入服务时长"
                class="goods-price primary-inputHeight"
                v-model="form.itemDetailDTO.wxItem.duration"
              ></el-input>
              <span class="goods-unit">分钟</span>
            </el-form-item>

            <!-- 线上预约是否需要支付 -->
            <el-form-item label="线上预约:" class="goods-label" prop="itemDetailDTO.wxItem.noNeedPay">
              <el-radio-group v-model="form.itemDetailDTO.wxItem.noNeedPay">
                <el-radio :label="true">无需支付</el-radio>
                <el-radio :label="false">需支付</el-radio>
              </el-radio-group>
            </el-form-item>
          </template>

          <!-- 产品类型设置 -->
          <template v-if="goodsType.type === goodsTypeEnum.product.type && !isCustomGoods">
            <!-- 重量 -->
            <el-form-item label="重量:" class="goods-label" prop="itemDetailDTO.wxItem.weight">
              <el-input
                placeholder="请输入商品重量"
                class="goods-price primary-inputHeight"
                v-model="form.itemDetailDTO.wxItem.weight"
              ></el-input>
              <span class="goods-unit">克</span>
            </el-form-item>

            <!-- 拣货单位 -->
            <el-form-item label="拣货单位:" v-if="is30J" class="goods-label" prop="itemDetailDTO.wxItem.outUnit">
              <el-input
                placeholder="请输入拣货单位"
                class="goods-price primary-inputHeight"
                v-model="form.itemDetailDTO.wxItem.outUnit"
              ></el-input>
            </el-form-item>

            <!-- 保质期 -->
            <el-form-item
              label="保质期:"
              class="goods-label"
              prop="itemDetailDTO.wxItem.shelfLife"
              v-if="!(env.MEDICINE || curApp.industryKey === 'medicine')"
            >
              <el-input
                placeholder="请输入保质期"
                class="goods-price primary-inputHeight"
                v-model="form.itemDetailDTO.wxItem.shelfLife"
              ></el-input>
              <el-select v-model="shelfLifeUnit" size="mini" placeholder="请选择" class="shelf-life-unit-select">
                <el-option
                  v-for="item in shelfLifeUnitOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>

            <!-- 品牌 -->
            <el-form-item
              label="品牌:"
              class="goods-label"
              prop="itemDetailDTO.wxItem.brand"
              v-if="!(env.MEDICINE || curApp.industryKey === 'medicine')"
            >
              <el-input
                placeholder="请输入品牌名称"
                class="goods-price primary-inputHeight"
                v-model="form.itemDetailDTO.wxItem.brand"
              ></el-input>
            </el-form-item>

            <!-- 产地 -->
            <el-form-item label="产地:" class="goods-label" prop="itemDetailDTO.wxItem.placeOfOrigin">
              <el-input
                placeholder="请输入商品产地"
                class="goods-price primary-inputHeight"
                v-model="form.itemDetailDTO.wxItem.placeOfOrigin"
              ></el-input>
            </el-form-item>
          </template>

          <!-- 商品描述 -->
          <el-form-item v-if="!isCustomGoods" :label="goodsType.label + '描述:'" class="goods-label">
            <w-editor :data-source="form.itemDetailDTO.wxItem" :image-limit="30"></w-editor>
          </el-form-item>
        </div>
      </transition>

      <!-- </div>
      </transition>-->

      <!-- 商品详情配置 -->
      <div ref="navigation-4">
        <goods-detail-setting
          v-if="isCustomGoods"
          :setting-source="form.itemDetailDTO.wxItem.detailConfig"
        ></goods-detail-setting>
      </div>
      <!-- 保存按钮 -->
      <div class="bottom-button">
        <el-button type="primary" class="goods-save" @click="onSubmit('form')">保存</el-button>
      </div>
    </el-form>

    <!-- 快速增加分类 -->
    <goods-classfiy-add
      v-if="showGoodsClassfiyAdd"
      :visible.sync="showGoodsClassfiyAdd"
      :edit-title="classfiyEditTitle"
      :edit-obj="classfiyEditObj"
      :on-save-classfiy="onSaveClassfiy"
    ></goods-classfiy-add>

    <!-- 增加或修改标签的对话弹框 -->
    <goods-label-dialog
      v-if="showEditLabelPopup"
      :visible.sync="showEditLabelPopup"
      :edit-title="editTitle"
      :no-category="true"
      :label-edit-obj="labelEditObj"
      @refresh-data="refreshData"
    ></goods-label-dialog>

    <!-- 悬浮快速导航 -->
    <div class="navigation">
      <div class="navigation-item" @click="goto(1)">商品基本信息</div>
      <div class="navigation-item" v-if="env.MEDICINE || curApp.industryKey === 'medicine'" @click="goto('drug')">
        药品信息
      </div>
      <div class="navigation-item" @click="goto(2)">SKU规格</div>
      <div class="navigation-item" @click="goto(3)">其他信息</div>
      <div class="navigation-item" v-if="isCustomGoods" @click="goto(4)">详情装修</div>
    </div>
  </div>
</template>

<script>
  import './css/GoodsEditForm.less';
  import wxFreightTplApi from '@/dss-wechat3rd/src/api/wx-freight-tpl-api';
  import wxInvoiceTplApi from '@/dss-setting/src/api/wx-invoice-tpl-api';
  import utils from '@/dss-common/utils/index';
  import moneyUtil from '@/dss-common/utils/money';
  import constants from '@/dss-wechat3rd/src/constants/index';
  import regex from '@/dss-wechat3rd/src/constants/regex';
  import tag1Enum from '@/dss-wechat3rd/src/constants/Tag1Enum';
  import services from '@/dss-common/utils/services';
  import goodsTypeEnum from '@/dss-wechat3rd/src/constants/goodsTypeEnum';
  import WEditor from '@/dss-wechat3rd/src/components/wEditor/index';
  import drugEnum from '@/dss-wechat3rd/src/constants/drug';
  import ChooseImages from '@/dss-wechat3rd/src/components/SingleChooseImage/index';
  import ChooseVideoSingle from '@/dss-wechat3rd/src/components/choose-video-single/index';

  import GoodsCategoryCascader from '@/dss-wechat3rd/src/bz_components/goods-category-cascader/index';
  import AttributePriceTable from './SkuInfoTable';

  import MultiGoodsAttribute from './GoodsAttribute';
  import GoodsLabelSelect from '@/dss-wechat3rd/src/bz_components/goods-label-select/index';
  import goodsClassfiyAdd from '@/dss-wechat3rd/src/bz_components/goods-classfiy-dialog/add';
  import goodsLabelDialog from '@/dss-wechat3rd/src/bz_components/goods-label-dialog/index';
  import TplAreaTable from '@/dss-wechat3rd/src/views-retail/warehouse/freight-tpl/tpl-area-table';
  import appFeaturesMixin from '@/dss-common/mixins/app-features-mixin';

  import { mapState } from 'vuex';

  import GoodsDetailSetting from './goods-detail-setting';
  import GoodsSpecifications from './goods-specifications/index.vue';
  import ParamsSetting from './params-setting/index.vue';
  import GoodsSkuInfoTable from './goods-sku-info-table/index.vue';
  import QuestionAnswerSetting from './question-answer-setting/index.vue';
  import BestCp from './best-cp/index.vue';
  import GoodsLabel from './goods-label/index.vue';

  import treeUtils from '@/dss-wechat3rd/src/components/goods/goods-specifications/format-tree-utils';
  import drugForm from './drugForm.vue';
  import { Container, Draggable } from 'vue-smooth-dnd';

  import SkuGoodsAttribute from './sku-goods-attribute/index.vue';
  import SkuGoodsInfoTable from './sku-goods-info-table/index.vue';

  const shelfLifeUnitOptions = [
    { value: 0, label: '小时' },
    { value: 1, label: '天' },
    { value: 2, label: '月' },
    { value: 3, label: '年' },
  ];

  export default {
    name: 'AddProduct',
    mixins: [appFeaturesMixin],
    components: {
      MultiGoodsAttribute,
      GoodsCategoryCascader,
      AttributePriceTable,
      ChooseImages,
      WEditor,
      GoodsLabelSelect,
      goodsClassfiyAdd,
      goodsLabelDialog,
      TplAreaTable,
      ChooseVideoSingle,
      GoodsDetailSetting,
      GoodsSpecifications,
      ParamsSetting,
      GoodsSkuInfoTable,
      QuestionAnswerSetting,
      BestCp,
      GoodsLabel,
      drugForm,
      'dnd-container': Container,
      'dnd-draggable': Draggable,
      SkuGoodsAttribute,
      SkuGoodsInfoTable,
    },

    props: {
      goodsType: {
        type: Object,
        default: function () {
          return null;
        },
      },
      // 是否不允许整个商品
      disabledForm: {
        type: Boolean,
        default: false,
      },
      // 是否不允许编辑敏感信息
      isDisabledEdit: {
        type: Boolean,
        default: false,
      },
    },

    data() {
      // 虚拟销量校验规则
      const checkVolume = (rule, value, callback) => {
        const callbackMsg =
          rule.field === 'itemDetailDTO.wxItem.virtualSalesVolume'
            ? '虚拟销量必须是在0到999999之间的正整数'
            : '限购件数必须是在0到999999之间的正整数';
        const positiveInteger = /^([0-9]*)$/; // 正整数
        if (!positiveInteger.test(value) || value > 999999) {
          return callback(callbackMsg);
        }
        callback();
      };

      // 预售时间校验规则
      const preSellTimeValidator = (rule, value, callback) => {
        if (this.form.itemDetailDTO.wxItem.preSell) {
          if (value.startTime && value.endTime) {
            if (new Date(value.startTime).getTime() > new Date(value.endTime).getTime()) {
              callback(Error('预售开始时间必须小于预售结束时间'));
            } else {
              callback();
            }
          } else {
            callback(Error('请填写完整的预售时间段'));
          }
        } else {
          callback();
        }
      };

      // 发货时间校验规则
      const deliveryTimeValidator = (rule, value, callback) => {
        /* 固定时间 */
        const { deliveryTime } = this.form.itemDetailDTO.wxItem;
        const { endTime } = this.form.preSellTime;

        /* 购买后N天范围内发货 */
        const daysAfterBuyRange = this.form.itemDetailDTO.wxItem.daysAfterBuyRange;
        const re = /^[1-9]\d{0,2}$/;

        let callbackMsg = null; // 返回的描述语

        if (this.form.itemDetailDTO.wxItem.preSell) {
          if (!value) {
            /* 固定时间 */
            if (!deliveryTime) {
              callbackMsg = '请输入发货时间';
            } else if (endTime && new Date(deliveryTime).getTime() < new Date(endTime).getTime()) {
              callbackMsg = '发货时间必须大于预售结束时间';
            }
          } else {
            /* 购买后N天范围内发货 */
            if (!daysAfterBuyRange) {
              callbackMsg = '请输入发货时间';
            }
          }
        }

        // value：发货时间类型 0：固定时间，1：购买后几天内发货
        if (daysAfterBuyRange && value) {
          const dabrArr = daysAfterBuyRange.split('-');
          const dl = dabrArr.length - 1;
          const dabrArr1 = dabrArr[0];
          const dabrArr2 = dabrArr[1];

          if (dl === 0) {
            if (!re.test(daysAfterBuyRange)) {
              callbackMsg = '请输入正确格式的天数，且开头不能为零；如 3 或 3-5';
            } else if (daysAfterBuyRange > 20) {
              callbackMsg = '发货时间不能超过 20 天';
            }
          } else if (dl === 1) {
            if (!re.test(dabrArr1) || !re.test(dabrArr2)) {
              callbackMsg = '请输入正确格式的天数，且开头不能为零；如 3 或 3-5';
            } else if (Number(dabrArr1) > Number(dabrArr2)) {
              callbackMsg = '开始天数不能大于结束天数';
            } else if (dabrArr1 > 20 || dabrArr2 > 20) {
              callbackMsg = '发货时间不能超过 20 天';
            }
          } else if (dl > 1) {
            callbackMsg = '请输入正确格式的天数，且开头不能为零；如 3 或 3-5';
          }
        }

        if (callbackMsg) {
          callback(callbackMsg);
        } else {
          callback();
        }
      };

      // 运费模板校验规则
      const freightValidator = (rule, value, callback) => {
        const wxItem = this.form.itemDetailDTO.wxItem;
        if (wxItem.freight && !regex.price.reg.test(wxItem.freight)) {
          callback(Error(regex.price.msg));
        } else {
          callback();
        }
      };

      // 多级规格(兼容一级规格)校验
      const checkMultiSkuTree = (rule, value, callback) => {
        const list = this.$plain(this.form.itemDetailDTO.skuTreeList);
        if (list && list.length) {
          if (this.isCustomGoods && this.form.itemDetailDTO.wxItem.skuType === 1) treeUtils.mergeTreeList(list);
          list.forEach((skuTree, index) => {
            if (!(skuTree.treeValList && skuTree.treeValList.length)) {
              return this.isCustomGoods && this.form.itemDetailDTO.wxItem.skuType === 1
                ? callback(new Error(`${skuTree.keyName}包含分类下请至少选择一个规格值`))
                : callback(new Error('请为规格选择一个规格值'));
            } else if (index === 0 && !this.isCustomGoods && skuTree.showImage && !this.isHomeIndustryApp) {
              skuTree.treeValList.forEach(treeVal => {
                // 后端需求：同步商品无imageId，要求仅校验imageUrl
                if (!treeVal.imageId && !treeVal.imageUrl) {
                  return callback(new Error('请为首规格规格添加图片'));
                }
              });
            }
          });
          return callback();
        } else {
          return callback();
        }
      };

      // 商品售价校验规则(需满足在设置的价格范围内)
      const checkSalePrice = (rule, value, callback) => {
        const priceError = regex.cPrice('请输入售价', value, true);
        const minItemPrice = this.form.itemDetailDTO.wxItem.minItemPrice;
        const maxItemPrice = this.form.itemDetailDTO.wxItem.maxItemPrice;
        if (priceError) {
          return callback(priceError);
        }

        if (minItemPrice && +minItemPrice !== 0 && +minItemPrice > +value) {
          return callback(new Error('售价不能低于最低售价'));
        }

        if (maxItemPrice && +maxItemPrice !== 0 && +maxItemPrice < +value) {
          return callback(new Error('售价不能高于最高售价'));
        }
        return callback();
      };

      // 商品最低价校验规则
      const checkMinItemPrice = (rule, value, callback) => {
        const priceError = regex.cPrice('请输入最低售价', value, false);
        const maxItemPrice = this.form.itemDetailDTO.wxItem.maxItemPrice;
        if (priceError) {
          return callback(priceError);
        }

        if (value && maxItemPrice && +maxItemPrice !== 0 && +maxItemPrice < +value) {
          return callback(new Error('最低售价不能高于最高售价'));
        }
        return callback();
      };

      // 商品最高价校验规则
      const checkMaxItemPrice = (rule, value, callback) => {
        const priceError = regex.cPrice('请输入最高售价', value, false);
        const minItemPrice = this.form.itemDetailDTO.wxItem.minItemPrice;
        if (priceError) {
          return callback(priceError);
        }

        if (value && minItemPrice && +minItemPrice !== 0 && +minItemPrice > +value) {
          return callback(new Error('最高售价不能低于最低售价'));
        }
        return callback();
      };

      // 商品SKU列表校验规则
      const checkSkuInfo = (rule, value, callback) => {
        if (this.form.itemDetailDTO.wxItem.salesType) {
          callback();
          return;
        }

        if (value && value.length) {
          value.forEach((skuInfo, index) => {
            const salePriceError = regex.cPrice('请输入售价', skuInfo.salePrice, true);
            if (salePriceError) {
              return callback(salePriceError);
            }
            const labelPriceError = regex.cPrice('请输入标价', skuInfo.labelPrice, false);
            if (labelPriceError) {
              return callback(labelPriceError);
            }

            const frontMoneyError = regex.cPrice('请输入定金', skuInfo.frontMoney, true);
            if (frontMoneyError) {
              return callback(frontMoneyError);
            }

            // 有填充标价时，需要校验售价
            if (!!skuInfo.labelPrice && +skuInfo.salePrice > +skuInfo.labelPrice) {
              return callback(new Error('商品售价不能大于商品标价'));
            }

            // 如果是积分商品，规格也需要校验积分
            if (this.isIntegral) {
              checkIntegral('', skuInfo.integralPrice, callback);
            }

            // 禁用商品sku不做校验
            if (skuInfo.notOptional) return callback();

            const minItemPrice = this.form.itemDetailDTO.wxItem.minItemPrice;
            const maxItemPrice = this.form.itemDetailDTO.wxItem.maxItemPrice;
            if (minItemPrice && +minItemPrice !== 0 && +minItemPrice > +skuInfo.salePrice) {
              return callback(new Error('售价不能低于最低售价'));
            }
            if (maxItemPrice && +maxItemPrice !== 0 && +maxItemPrice < +skuInfo.salePrice) {
              return callback(new Error('售价不能高于最高售价'));
            }
          });
          return callback();
        } else {
          return callback();
        }
      };

      // 积分校验规则
      const checkIntegral = (rule, value, callback) => {
        if (/^([1-9]\d*)$/.test(value)) {
          return callback();
        } else {
          return callback(new Error('积分必须是大于0的整数'));
        }
      };

      return {
        isIntegral: false,
        pickerStartTime: {
          disabledDate: time => {
            const yesterDay = new Date();
            yesterDay.setTime(yesterDay.getTime() - 3600 * 1000);
            return time.getTime() < yesterDay;
          },
        },
        limit: 5,
        drugEnum, // 处方药
        tag1Enum,
        isFixedFreight: true,
        goodsTypeEnum,
        shelfLifeUnitOptions,
        isEdit: false,
        shelfLifeUnit: 0,
        is30J: this.$store.state.appFeatures && this.$store.state.appFeatures.indexOf('30plus') !== -1,
        showForm: false,

        showGoodsClassfiyAdd: false, // 是否快速增加分类弹框
        classfiyEditTitle: '', // 编辑分类弹框标题
        classfiyEditObj: {}, // 用于传给子组件的新增的分类对象

        showEditLabelPopup: false, // 是否显示编辑标签弹框
        editTitle: '', // 编辑标签弹框标题
        labelEditObj: {}, // 用于传给子组件的新增的标签对象
        labelSelectedObj: {}, // 用于传给子组件的选中的标签对象
        labelType: 0, // 标签类型

        freightTplList: [],
        invoiceTplList: [],
        freightTpl: null,
        form: {
          // 预售时间
          preSellTime: {
            startTime: '',
            endTime: '',
          },
          itemDetailDTO: {
            wxItem: {
              salesType: 0,
              type: this.goodsType.value,
              categoryId: '',
              name: '',
              barcode: '',
              virtualSalesVolume: 0,
              frontMoneyItem: false, // 是否为定金模式
              salePrice: '',
              labelPrice: '',
              frontMoney: '', // 定金
              freight: '',
              freightTemplateId: null,
              invoiceTemplateId: '',
              tag1: tag1Enum.NONE,
              duration: '',
              describe: '',
              noNeedPay: false,
              labelId: '',
              labelIds: [],
              unit: '',
              placeOfOrigin: '',
              brand: '',
              weight: '',
              costPrice: '', // 成本价
              daysAfterBuyRange: '', // int 发货时间 购买后几天范围内发货
              deliveryTime: '', // date 发货时间
              deliveryTimeType: 1, // int 发货时间类型 0：固定时间，1：购买后几天内发货
              preSell: false, // Boolean 是否是预售商品
              preSellEndTime: '', // date 预售结束时间
              preSellStartTime: '', // date 预售开始时间
              vrUrl: '', // VR地址
              videoUrl: '', // 商品主视频
              videoCoverUrl: '', // 商品主视频封面
              peopleLimitAmount: 0, // 每人限购数量
              peopleLimitRange: '', // 限购时间
              skuType: 0, // 0：一级 1：多级
              paramBannerUrl: [], // 参数banner图地址
              paramSetting: [], // 商品参数设置
              commonQa: [], // 产品常见问题配置
              detailConfig: [], // 商品详情配置
              minItemPrice: '', // 商品价格范围：最低价
              maxItemPrice: '', // 商品价格范围：最高价
              drugType: 0, // 药品分类
              medicationReminder: 0,
              validateTimeUnit: 1, // 有效期单位
              usagePerUseUnit: '粒', // 用法用量单位
              displayPrice: '到店咨询',
              mode: 0,
            },
            skuTreeList: [],
            skuInfoList: [],
            materialsId: [],
            materialUrls: [],
            recommendList: [], // 最佳cp 推荐商品
            labelMappings: [], // 商品标签集合
          },
          multiAttrParentOptions: [],
          disableAddSkuTree: { disable: false },
        },

        // form表单校验规则
        rules: {
          preSellTime: [{ validator: preSellTimeValidator.bind(this), trigger: 'change' }],
          itemDetailDTO: {
            materialsId: [
              {
                required: true,
                validator: regex.goods.checkGoodsMaterialsId,
                trigger: 'change',
              },
            ],
            skuTreeList: [
              {
                required: false,
                // validator: regex.goods.checkSkuTree,
                validator: checkMultiSkuTree.bind(this),
                trigger: 'blur',
              },
            ],
            skuInfoList: [
              {
                required: false,
                // validator: regex.goods.checkSkuInfo,
                validator: checkSkuInfo.bind(this),
                trigger: 'blur',
              },
            ],
            wxItem: {
              integralPrice: [
                { required: true, message: '积分不可为0，或空' },
                {
                  validator: checkIntegral.bind(this),
                  trigger: 'blur',
                },
              ],
              mode: [{ required: true, message: '请选择商品类型' }],
              salesType: [{ required: true, message: '请选择销售类型' }],
              categoryId: [{ required: true, message: '请选择商品分类', trigger: 'change' }],
              name: [
                { required: true, message: '请输入商品名称', trigger: 'blur' },
                {
                  min: 1,
                  max: 80,
                  message: '长度在 1 到 80 个字符',
                  trigger: 'blur',
                },
              ],
              subName: [
                {
                  min: 1,
                  max: 80,
                  message: '长度在 1 到 80 个字符',
                  trigger: 'blur',
                },
              ],
              virtualSalesVolume: [
                {
                  validator: checkVolume.bind(this),
                  trigger: 'blur',
                },
              ],
              peopleLimitAmount: [
                {
                  validator: checkVolume.bind(this),
                  trigger: 'blur',
                },
              ],
              salePrice: [
                {
                  required: true,
                  // validator: regex.goods.checkSalePrice,
                  validator: checkSalePrice.bind(this),
                  trigger: 'blur',
                },
              ],
              minItemPrice: [
                {
                  validator: checkMinItemPrice.bind(this),
                  trigger: 'blur',
                },
              ],
              maxItemPrice: [
                {
                  validator: checkMaxItemPrice.bind(this),
                  trigger: 'blur',
                },
              ],
              costPrice: [
                {
                  required: false,
                  validator: regex.goods.checkCostPrice,
                  trigger: 'blur',
                },
              ],
              labelPrice: [
                {
                  // required: true,
                  validator: regex.goods.checkLabelPrice,
                  trigger: 'blur',
                },
              ],
              frontMoney: [
                {
                  required: true,
                  validator: regex.goods.checkFrontMoney,
                  trigger: 'blur',
                },
              ],
              freightTemplateId: [
                {
                  validator: freightValidator.bind(this),
                  trigger: 'change',
                },
              ],
              weight: [
                {
                  validator: regex.goods.checkWeight,
                  trigger: 'blur',
                },
              ],
              brand: [
                {
                  min: 1,
                  max: 30,
                  message: '长度在 1 到 30 个字符',
                  trigger: 'blur',
                },
              ],
              placeOfOrigin: [
                {
                  min: 1,
                  max: 30,
                  message: '长度在 1 到 30 个字符',
                  trigger: 'blur',
                },
              ],
              noNeedPay: [{ required: true, message: '请选择线上预约', trigger: 'change' }],
              unit: [
                { required: true, message: '请输入单位', trigger: 'blur' },
                {
                  min: 1,
                  max: 5,
                  message: '长度在 1 到 5 个字符',
                  trigger: 'blur',
                },
              ],
              shelfLife: [
                {
                  validator: regex.goods.checkShelfLife,
                  trigger: 'blur',
                },
              ],
              outUnit: [
                {
                  min: 2,
                  max: 10,
                  message: '长度在 2 到 10 个字符',
                  trigger: 'blur',
                },
              ],
              deliveryTimeType: [{ validator: deliveryTimeValidator.bind(this), trigger: 'change' }],
              paramSetting: [
                {
                  required: false,
                  validator: regex.goods.paramSetting,
                  trigger: 'blur',
                },
              ],
              commonQa: [
                {
                  required: false,
                  validator: regex.goods.commonQa,
                  trigger: 'blur',
                },
              ],
              drugType: [
                {
                  required: true,
                  message: '请选择药品分类',
                  trigger: 'blur',
                },
              ],
              displayPrice: [
                {
                  required: true,
                  message: '请输入价格标签',
                  trigger: 'blur',
                },
                {
                  min: 1,
                  max: 20,
                  message: '长度在 1 到 20 个字符',
                  trigger: 'blur',
                },
              ],
            },
          },
        },

        isMidicine: true,
        selectedCategorys: [], // 当前选中商品分类
        showGoodsInfoContent: true, // 折叠商品信息部分
        showContent: {
          showGoodsInfoContent: true, // 商品基本信息
          showGoodsSku: true, // Sku规格
          showGoodsOther: true, // 其他信息
          showDrug: true, // 药品信息
        }, // 折叠商品信息部分
        isUploading: false,
      };
    },

    computed: {
      maxLength() {
        if (this.isXiCha) {
          this.limit = 15;
          return 15;
        } else {
          this.limit = 5;
          return 5;
        }
      },
      goodsImgCountLimit() {
        return function (index) {
          if (this.isXiCha) {
            return index < 15;
          } else {
            return index < 5;
          }
        };
      },
      computeShowSkuInfos() {
        if (this.form.itemDetailDTO.skuInfoList && this.form.itemDetailDTO.skuInfoList.length) {
          this.form.itemDetailDTO.wxItem.barcode = null;
        }

        return this.form.itemDetailDTO.skuInfoList && this.form.itemDetailDTO.skuInfoList.length;
      },
      activityList() {
        const item = this.form.itemDetailDTO.wxItem;
        const preSell = item.preSell;
        const group = item.pt;
        const cutPrice = item.bargain;
        const seckill = item.seckill;
        const integralItem = item.integralItem;

        if (preSell || group || cutPrice || seckill || integralItem) {
          return true;
        }
        return false;
      },
      ...mapState({
        env: 'env',
        curApp: 'curApp',
        roleList: 'roleList',
      }),
      // 班兰自定义商品开关
      isCustomGoods() {
        return this.curApp && !!this.curApp.multiSkuApp;
      },
      // 管理员
      isManager() {
        return !!~this.roleList.split(',').indexOf('common_role_enterprise');
      },
      isHomeIndustryApp() {
        return this.curApp && !!this.curApp.newSkuItem;
      },
    },
    watch: {
      isFixedFreight: {
        handler(newVal, oldVal) {
          // bugfix: 运费模板
          if (!newVal) {
            this.form.itemDetailDTO.wxItem.freight = '';
          } else {
            this.form.itemDetailDTO.wxItem.freightTemplateId = null;
          }
        },
      },
      // 监听商品类型切换
      'form.itemDetailDTO.wxItem.mode': {
        handler(newVal) {
          this.isIntegral = !!newVal;
          if (newVal) {
            this.form.itemDetailDTO.wxItem.salesType = 0;
            this.form.itemDetailDTO.wxItem.minItemPrice = null;
            this.form.itemDetailDTO.wxItem.maxItemPrice = null;
          }
        },
      },
      // 监听运费模板
      'form.itemDetailDTO.wxItem.freightTemplateId': {
        handler(newVal, oldVal) {
          if (newVal) {
            this.freightTpl = this.freightTplList.find(tpl => {
              return tpl.id === newVal;
            });
          } else {
            this.freightTpl = null;
          }
        },
      },
      freightTplList: {
        handler(newVal, oldVal) {
          this.freightTpl = this.freightTplList.find(tpl => {
            return tpl.id === this.form.itemDetailDTO.wxItem.freightTemplateId;
          });
        },
      },
    },
    methods: {
      getInvoiceTplList() {
        const params = {
          pageNo: 1,
          pageSize: 1000,
        };
        wxInvoiceTplApi
          .getInvoice(params)
          .then(res => {
            this.invoiceTplList = res.data || [];
            // 默认选中默认模板
            this.form.itemDetailDTO.wxItem.invoiceTemplateId = res.data[0].id || '';
          })
          .always(() => {
            this.loading = false;
          });
      },
      getFreightTplList() {
        this.loading = true;
        const params = {
          pageNo: 1,
          pageSize: 1000,
        };
        wxFreightTplApi
          .getTplList(params)
          .done(res => {
            this.freightTplList = res.data || [];
          })
          .always(() => {
            this.loading = false;
          });
      },

      // 获取商品详情
      getGoodsDetail() {
        const params = {
          itemNo: this.$route.query.itemNo,
          status: this.$route.query.status,
        };
        services
          .get(constants.Api.goods.detail, {
            params,
            action: '商品详情',
          })
          .done(res => {
            this.showForm = true;

            // bugfix: 存在运费模板
            if (res.data.wxItem.freightTemplateId) {
              this.isFixedFreight = false;
            }

            this.convertMoneyUnit(res.data, true);
            this.storeServerSkuInfoToMap((res.data.skuInfoList || []).slice());
            if (res.data.wxItem.labelIds) {
              res.data.wxItem.labelIds = res.data.wxItem.labelIds.split(',').map(id => {
                return parseInt(id);
              });
            } else if (res.data.wxItem.labelId) {
              res.data.wxItem.labelIds = [res.data.wxItem.labelId];
            } else {
              res.data.wxItem.labelIds = [];
            }
            // 结构只能结构一层，多一层的要多结构一次
            if (res.data && res.data.wxItem) {
              res.data.wxItem = { ...this.form.itemDetailDTO.wxItem, ...res.data.wxItem };
              res.data.wxItem.frontMoneyItem = !!res.data.wxItem.frontMoneyItem;

              // 处理多级规格相关字段
              // if (this.isCustomGoods) {
              res.data.wxItem.paramBannerUrl = res.data.wxItem.paramBannerUrl
                ? JSON.parse(res.data.wxItem.paramBannerUrl)
                : [];
              res.data.wxItem.paramSetting = res.data.wxItem.paramSetting
                ? JSON.parse(res.data.wxItem.paramSetting)
                : [];
              res.data.wxItem.commonQa = res.data.wxItem.commonQa ? JSON.parse(res.data.wxItem.commonQa) : [];
              res.data.wxItem.detailConfig = res.data.wxItem.detailConfig
                ? JSON.parse(res.data.wxItem.detailConfig)
                : [];
              // }
            }

            this.form.itemDetailDTO = { ...this.form.itemDetailDTO, ...res.data };
            const {
              preSellStartTime,
              preSellEndTime,
              deliveryTimeType,
              deliveryTime,
              shelfLifeUnit,
              peopleLimitRange,
              peopleLimitAmount,
            } = this.form.itemDetailDTO.wxItem;
            // 接口返回的是毫秒值，需要转成YYYY-MM-DD HH:mm，不精确到秒，配合服务端task任务
            if (preSellStartTime) {
              this.form.preSellTime.startTime = utils.date.format(new Date(preSellStartTime), 'YYYY-MM-DD HH:mm');
            }
            if (preSellEndTime) {
              this.form.preSellTime.endTime = utils.date.format(new Date(preSellEndTime), 'YYYY-MM-DD HH:mm');
            }
            if (deliveryTime) {
              this.form.itemDetailDTO.wxItem.deliveryTime = utils.date.format(
                new Date(deliveryTime),
                'YYYY-MM-DD HH:mm'
              );
            }
            this.form.itemDetailDTO.wxItem.deliveryTimeType = deliveryTimeType || 0;
            this.shelfLifeUnit = shelfLifeUnit || 0;

            // 判断是否为药品
            if ((this.form.itemDetailDTO.wxItem.tag1 & tag1Enum.MEDICINE) === tag1Enum.MEDICINE) {
              this.isMidicine = true;
            } else {
              this.isMidicine = false;
            }

            if (peopleLimitRange) {
              this.form.itemDetailDTO.wxItem.peopleLimitRange = peopleLimitRange.split(',');
            }

            if (!peopleLimitAmount) {
              this.form.itemDetailDTO.wxItem.peopleLimitAmount = 0;
            }

            // 处理多级规格相关字段
            // if (this.isCustomGoods) {
            //   this.form.itemDetailDTO.wxItem.paramBannerUrl = JSON.parse(this.form.itemDetailDTO.wxItem.paramBannerUrl) || [];
            //   this.form.itemDetailDTO.wxItem.paramSetting = JSON.parse(this.form.itemDetailDTO.wxItem.paramSetting) || [];
            //   this.form.itemDetailDTO.wxItem.commonQa = JSON.parse(this.form.itemDetailDTO.wxItem.commonQa) || [];
            //   this.form.itemDetailDTO.wxItem.detailConfig = JSON.parse(this.form.itemDetailDTO.wxItem.detailConfig) || [];
            // }

            this.initGoodsMaterials();
          });
      },

      /**
       * 钱的单位转换 ,服务端返回的为分， 交互展示的为元
       * @param itemDetailDTO
       * @param isFromServer 是否转换服务端返回的数据，否则转换页面提交服务的数据
       */
      convertMoneyUnit(itemDetailDTO, isFromServer) {
        if (!itemDetailDTO) {
          return;
        }
        // 转换函数
        const convert = isFromServer
          ? v => {
              return moneyUtil.convertHundredMoneyUnit(v, true);
            }
          : v => {
              return moneyUtil.convertHundredMoneyUnit(v, false);
            };
        // salePrice:售价 , freight: 运费
        if (itemDetailDTO.wxItem) {
          itemDetailDTO.wxItem.salePrice = convert(itemDetailDTO.wxItem.salePrice);
          if (!itemDetailDTO.wxItem.labelPrice) {
            itemDetailDTO.wxItem.labelPrice = itemDetailDTO.wxItem.salePrice;
          } else {
            itemDetailDTO.wxItem.labelPrice = convert(itemDetailDTO.wxItem.labelPrice);
          }
          itemDetailDTO.wxItem.costPrice = convert(itemDetailDTO.wxItem.costPrice);
          itemDetailDTO.wxItem.frontMoney = convert(itemDetailDTO.wxItem.frontMoney);
          itemDetailDTO.wxItem.freight = convert(itemDetailDTO.wxItem.freight);
          itemDetailDTO.wxItem.weight = itemDetailDTO.wxItem.weight || 0;
          itemDetailDTO.wxItem.minItemPrice =
            itemDetailDTO.wxItem.minItemPrice !== '' && itemDetailDTO.wxItem.minItemPrice !== null
              ? convert(itemDetailDTO.wxItem.minItemPrice)
              : null;
          itemDetailDTO.wxItem.maxItemPrice =
            itemDetailDTO.wxItem.maxItemPrice !== '' && itemDetailDTO.wxItem.maxItemPrice !== null
              ? convert(itemDetailDTO.wxItem.maxItemPrice)
              : null;
        }
        // sku 对应规格价格
        if (itemDetailDTO.skuInfoList) {
          itemDetailDTO.skuInfoList.forEach(item => {
            item.salePrice = convert(item.salePrice);
            item.frontMoney = convert(item.frontMoney);
            if (!item.labelPrice) {
              item.labelPrice = item.salePrice;
            } else {
              item.labelPrice = convert(item.labelPrice);
            }
          });
        }
      },

      getLimit() {
        this.limit = this.maxLength - this.form.itemDetailDTO.materialsId.length + 1;
      },

      // 添加商品图片
      onImageAdd(index) {
        this.form.itemDetailDTO.materialsId = this.form.itemDetailDTO.materialsId.filter(item => item !== '');
        if (index === this.form.itemDetailDTO.materialsId.length - 1) {
          const deletedUrl = this.form.itemDetailDTO.materialsId.splice(index, 1);
          // 多选返回的是图片数组，遍历数组
          if (Array.isArray(deletedUrl[0])) {
            deletedUrl[0].forEach(item => {
              if (this.form.itemDetailDTO.materialsId.length < 5) {
                this.form.itemDetailDTO.materialsId.push(item);
              }
            });
          }
          index = this.form.itemDetailDTO.materialsId.length - 1;
        }
        this.addWaitUploadImage(this.form.itemDetailDTO.materialsId, this.form.itemDetailDTO.materialUrls, index);
        this.getLimit();
      },
      // 更新图片列表
      addWaitUploadImage(materialsId, materialUrls, index) {
        if (utils.isUndefined(index) || index === materialsId.length - 1) {
          materialUrls.push('');
          materialsId.push({
            id: 0,
            imgUrl: '',
          });
        }
      },

      // 删除图片
      onDeleteImg(index) {
        this.form.itemDetailDTO.materialsId[index] = '';
        this.form.itemDetailDTO.materialUrls[index] = '';
        this.getLimit();
      },

      // 初始化 商品图片素材
      initGoodsMaterials() {
        const materialsId = this.form.itemDetailDTO.materialsId ? this.form.itemDetailDTO.materialsId : [];
        const newUrls = [];
        let materialUrls = this.form.itemDetailDTO.materialUrls;

        if (materialUrls && materialUrls.length) {
          materialUrls.forEach((imgUrl, index) => {
            if (imgUrl) {
              materialsId[index] = {
                id: materialsId[index],
                imgUrl: imgUrl,
              };
              newUrls.push(imgUrl);
            }
          });
          materialUrls = newUrls;
        }

        this.addWaitUploadImage(materialsId, materialUrls);
        this.getLimit();
        this.form.itemDetailDTO.materialsId = materialsId;
        this.form.itemDetailDTO.materialUrls = materialUrls;
      },

      /**
       * 过滤销售价格，标价，定金等 (有sku的商品，就需要过滤)
       * @param skuInfoList
       * @param wxItem
       */
      filterSalePrice(skuInfoList, wxItem) {
        if (!skuInfoList || !skuInfoList.length) {
          return;
        }
        let minSalePrice = 999999900;
        let minLabelPrice = 999999900;
        let minFrontMoney = 999999900;
        skuInfoList.forEach(item => {
          // 禁用状态的sku不考虑
          if (!item.notOptional) {
            minSalePrice = Math.min(item.salePrice || 0, minSalePrice);
            minLabelPrice = Math.min(item.labelPrice || 0, minLabelPrice);
            minFrontMoney = Math.min(item.frontMoney || 0, minFrontMoney);
          }
        });
        wxItem.salePrice = minSalePrice;
        wxItem.labelPrice = minLabelPrice;
        wxItem.frontMoney = minFrontMoney;
      },

      // 变更运费模板，手动触发验证
      onFreightChange() {
        this.$refs.form.validateField('itemDetailDTO.wxItem.freightTemplateId');
      },

      // 保存商品
      onSubmit(formName) {
        if (this.isUploading) {
          return false;
        }
        // 校验处方药信息
        if (this.$refs.drugForm) {
          const drugValidate = this.$refs.drugForm.FormValidate();
          if (!drugValidate) {
            return;
          }
        }

        this.$refs[formName].validate((valid, data) => {
          if (valid) {
            this.form.itemDetailDTO.wxItem.shelfLifeUnit = this.shelfLifeUnit;
            if (this.form.itemDetailDTO.wxItem.shelfLife) {
              this.form.itemDetailDTO.wxItem.shelfLife = parseInt(this.form.itemDetailDTO.wxItem.shelfLife);
            }

            const params = this.$plain(this.form.itemDetailDTO);
            const materialsId = params.materialsId.slice();
            params.materialsId = [];
            // params.materialUrls = [];

            // materialsId 使用 id填充 && materialUrls 去空
            materialsId.forEach((item, index) => {
              if (item && item.id && params.materialUrls.indexOf(item.imgUrl) === -1) {
                // params.materialsId.push(item.id);
                params.materialUrls[index] = item.imgUrl;
              }
            });
            params.materialUrls = params.materialUrls.filter(url => {
              return !!url;
            });

            if (!this.isCustomGoods || !params.wxItem.skuType) {
              const skuTreeList = [];
              if (params.skuTreeList && params.skuTreeList.length) {
                params.skuTreeList.forEach((item, index) => {
                  item.showImage = item.showImage ? 1 : 0;
                  item.attrKeySort = index;
                  if (item.treeValList && item.treeValList.length) {
                    item.treeValList.forEach((valItem, valIndex) => {
                      valItem.attrValSort = valIndex;
                    });
                    skuTreeList.push(item);
                  }
                });
                params.skuTreeList = skuTreeList;
              }
            }
            // const skuTreeList = [];
            // if (params.skuTreeList && params.skuTreeList.length) {
            //   params.skuTreeList.forEach((item, index) => {
            //     item.showImage = item.showImage ? 1 : 0;
            //     item.attrKeySort = index;
            //     if (item.treeValList && item.treeValList.length) {
            //       item.treeValList.forEach((valItem, valIndex) => {
            //         valItem.attrValSort = valIndex;
            //       });
            //       skuTreeList.push(item);
            //     }
            //   });
            //   params.skuTreeList = skuTreeList;
            // }

            const url = this.$route.query.itemNo ? constants.Api.goods.update : constants.Api.goods.add;
            this.convertMoneyUnit(params, false);

            // 更新skuInfo信息,则还原之前的存储信息
            if (!!params.skuInfoList && !!params.skuInfoList.length && !!this.serverSkuInfoMap) {
              params.skuInfoList.forEach(item => {
                if (!!item.uniqueKeys && this.serverSkuInfoMap.hasOwnProperty(item.uniqueKeys)) {
                  const old = this.serverSkuInfoMap[item.uniqueKeys];
                  item.skuId = old.skuId;
                  item.skuBarcode = old.skuBarcode;
                }
              });
            }

            // 校验最少保持一个sku规格项启用
            if (this.isHomeIndustryApp && params.skuInfoList && params.skuInfoList.length) {
              const isAllNotOptional = params.skuInfoList.find(item => item.notOptional !== 1);
              if (!isAllNotOptional) {
                this.$message.error('请至少启用一个sku规格');
                return;
              }
            }

            this.filterSalePrice(params.skuInfoList, params.wxItem);

            // 产品都需要支付
            if (this.goodsType.type === goodsTypeEnum.product.type) {
              params.wxItem.noNeedPay = false;
            }

            const { startTime, endTime } = this.form.preSellTime;
            const { deliveryTimeType, deliveryTime, daysAfterBuyRange } = params.wxItem;

            // 将日期格式转化成毫秒给服务端保存
            if (startTime) {
              params.wxItem.preSellStartTime = new Date(startTime).getTime();
            }
            if (endTime) {
              params.wxItem.preSellEndTime = new Date(endTime).getTime();
            }

            if (deliveryTime) {
              params.wxItem.deliveryTime = new Date(deliveryTime).getTime();
            }

            // 判断选择的发货类型，避免请求的时候传错值。发货时间类型 0：固定时间，1：购买后几天内发货
            if (deliveryTimeType) {
              if (deliveryTime) {
                delete params.wxItem.deliveryTime;
              } else {
                params.wxItem.deliveryTime = '';
              }
            } else {
              if (daysAfterBuyRange) {
                delete params.wxItem.daysAfterBuyRange;
              } else {
                params.wxItem.daysAfterBuyRange = '';
              }
            }

            // 判断是否是医药行业并且为药品
            if (this.env.MEDICINE) {
              // 是药品
              if (this.isMidicine) {
                if ((params.wxItem.tag1 & tag1Enum.MEDICINE) !== tag1Enum.MEDICINE) {
                  params.wxItem.tag1 = params.wxItem.tag1 + tag1Enum.MEDICINE;
                }
              } else {
                // 不是药品
                if ((params.wxItem.tag1 & tag1Enum.MEDICINE) === tag1Enum.MEDICINE) {
                  params.wxItem.tag1 = params.wxItem.tag1 - tag1Enum.MEDICINE;
                }
              }
              // 判断是否是处方药
              if (this.form.itemDetailDTO.wxItem.drugType) {
                if ((params.wxItem.tag1 & tag1Enum.IS_PRESCRIPTION_DRUG) !== tag1Enum.IS_PRESCRIPTION_DRUG) {
                  params.wxItem.tag1 = params.wxItem.tag1 + tag1Enum.IS_PRESCRIPTION_DRUG;
                }
              } else {
                if ((params.wxItem.tag1 & tag1Enum.IS_PRESCRIPTION_DRUG) === tag1Enum.IS_PRESCRIPTION_DRUG) {
                  params.wxItem.tag1 = params.wxItem.tag1 - tag1Enum.IS_PRESCRIPTION_DRUG;
                }
              }
            }

            if (params.wxItem.peopleLimitRange) {
              params.wxItem.peopleLimitRange = params.wxItem.peopleLimitRange.join(',');
            } else {
              params.wxItem.peopleLimitRange = 0;
            }

            // 标签id
            if (params.wxItem.labelIds && params.wxItem.labelIds.length) {
              params.wxItem.labelIds = params.wxItem.labelIds.join(',');
            } else {
              params.wxItem.labelIds = '';
            }

            // 多级规格相关字段处理
            // if (this.isCustomGoods) {
            // params.wxItem.type = 36;
            params.wxItem.paramBannerUrl = JSON.stringify(params.wxItem.paramBannerUrl);
            params.wxItem.paramSetting = JSON.stringify(params.wxItem.paramSetting);
            params.wxItem.commonQa = JSON.stringify(params.wxItem.commonQa);
            params.wxItem.detailConfig = JSON.stringify(params.wxItem.detailConfig);
            // }

            delete params.labelMappings;

            this.isUploading = true;
            services
              .post(url, params, {
                headers: {
                  'Content-Type': 'application/json',
                },
                transformRequest: function (_data, config, test) {
                  return JSON.stringify(_data);
                },
                action: '添加商品',
              })
              .done(res => {
                this.$router.back();
                // this.$router.push({
                //   path: '/goods-manage/list/' + this.goodsType.type
                // });
              })
              .finally(e => {
                this.isUploading = false;
              });
          } else {
            if (data) {
              const sortFieldList = Array.prototype.slice
                .call(document.querySelectorAll('[for]'))
                .map(el => el.getAttribute('for'));

              const errorField = sortFieldList.find(field => Object.keys(data).indexOf(field) >= 0);
              const $error = document.querySelector(`[for="${errorField}"]`);
              if ($error) {
                const dom = document.getElementsByClassName('sub-nav-content-container')[0];
                // 100 偏移
                const top = $error.getBoundingClientRect().top - dom.getBoundingClientRect().top - 100;
                dom.scrollBy({ top });
              }
            }
            return false;
          }
        });
      },

      // 设置唯一组合标识
      addSkuInfoUniqueKeys(skuInfoList) {
        skuInfoList.forEach(item => {
          const uniqueKeys = [];
          item.skuInfoNames.forEach(sku => {
            uniqueKeys.push(sku.keyId + ':' + sku.valId);
          });
          item.uniqueKeys = uniqueKeys.join('-');
        });
      },

      // 获取店铺skuInfo信息
      storeServerSkuInfoToMap(skuInfoList) {
        let serverSkuInfoMap = null;
        this.addSkuInfoUniqueKeys(skuInfoList);
        skuInfoList.forEach(item => {
          if (!serverSkuInfoMap) {
            serverSkuInfoMap = {};
          }
          serverSkuInfoMap[item.uniqueKeys] = item;
        });
        this.serverSkuInfoMap = serverSkuInfoMap;
      },

      // 保存skuInfo信息配置
      onSkuInfosAssembled(assembledSkuInfos) {
        if (assembledSkuInfos && assembledSkuInfos.length) {
          assembledSkuInfos.forEach((newSku, index) => {
            const sameSku = this.form.itemDetailDTO.skuInfoList.find(oldSku => {
              return newSku.uniqueKeys === oldSku.uniqueKeys;
            });
            if (sameSku) {
              assembledSkuInfos[index] = sameSku;
            }
          });
        }
        this.form.itemDetailDTO.skuInfoList = assembledSkuInfos || [];
      },

      // 添加分类
      addClassfiy() {
        this.showGoodsClassfiyAdd = true;
        this.classfiyEditTitle = '快速增加分类';
        this.classfiyEditObj = {
          type: this.goodsType.value,
        };
      },

      // 保存分类关闭弹窗后执行的函数
      onSaveClassfiy(res) {
        this.form.itemDetailDTO.wxItem.categoryId = res.data;
        // 判断被选中的商品分类赋值
        this.$refs.goodsCategoryCascader.listCategories(list => {
          const categoryDTO = list.find(item => {
            return item.id === this.form.itemDetailDTO.wxItem.categoryId;
          });
          this.$set(this.form.itemDetailDTO.wxItem, 'categoryDTO', categoryDTO);
        }); // 触发分类列表子组件的获取分类列表刷新函数
      },

      // 选中的标签
      selectedLabelId(labelIds) {
        this.form.itemDetailDTO.wxItem.labelIds = labelIds;
        console.log('labelIds', this.form.itemDetailDTO.wxItem.labelIds);
      },

      // 打开快速增加标签弹窗
      addLabelPopup() {
        this.showEditLabelPopup = true;
        this.editTitle = '快速增加标签';
      },

      // 监控子组件发射回来的方法，以便于新增标签之后刷新数据
      refreshData(data) {
        // 将获取到的选中的标签对象赋值
        this.form.itemDetailDTO.wxItem.labelIds.push(data.labelId);
        this.$refs.labelCascader.labelList(); // 父组件通知标签列表组件刷新数据
      },

      // 预售设置改变为不是预售商品的时候，将发货时间类型 deliveryTimeType 改变为 1：购买后几天内发货
      preSellChange() {
        if (!this.form.itemDetailDTO.wxItem.preSell) {
          this.form.itemDetailDTO.wxItem.deliveryTimeType = 1;
        }

        // 手动触发发货时间的验证
        this.$refs.form.validateField('itemDetailDTO.wxItem.deliveryTimeType');
      },

      onChangeSkuInfoLevel(val) {
        this.form.itemDetailDTO.skuTreeList = [];
        this.form.itemDetailDTO.skuInfoList = [];
        this.$refs.form.validateField('itemDetailDTO.skuTreeList');
      },

      updateParamBanner(urls) {
        this.form.itemDetailDTO.wxItem.paramBannerUrl = urls || [];
      },

      goto(val) {
        this.$nextTick(() => {
          // 获取dom元素
          const dom = document.getElementsByClassName('sub-nav-content-container')[0];
          dom.scrollTop = this.$refs[`navigation-${val}`].offsetTop;
        });
      },

      onHandleCategoryChange(selectedOptions) {
        this.selectedCategorys = selectedOptions || [];
      },

      // 拖拽图片
      onDrop(dropResult) {
        const len = this.form.itemDetailDTO.materialsId.length;
        const { removedIndex, addedIndex } = dropResult;

        // 不需要处理的情况
        if ((!removedIndex && !addedIndex) || removedIndex === len - 1 || addedIndex === len - 1) {
          return false;
        }

        const addMaterialsId = this.form.itemDetailDTO.materialsId.splice(removedIndex, 1)[0];
        const addMaterialsUrl = this.form.itemDetailDTO.materialUrls.splice(removedIndex, 1)[0];

        this.form.itemDetailDTO.materialsId.splice(addedIndex, 0, addMaterialsId);
        this.form.itemDetailDTO.materialUrls.splice(addedIndex, 0, addMaterialsUrl);
      },
    },

    mounted() {
      this.isEdit = !!this.$route.query.itemNo;
      if (this.$route.query.itemNo) {
        this.getGoodsDetail();
      } else {
        this.initGoodsMaterials();
        this.showForm = true;
      }
      this.getFreightTplList();
      this.getInvoiceTplList();

      // 获取连接上的标签类型
      const labelType = parseInt(this.$route.query.labelType);
      if (labelType || labelType === 0) {
        this.labelType = labelType; // 将获取到的类型传给标签select下拉子组件
        this.labelEditObj.labelType = labelType; // 将获取到的类型传给标签标签dialog对话框子组件
      }
    },
  };
</script>

<style lang="less">
  .form-disabled {
    .el-cascader__label {
      cursor: not-allowed;

      span {
        color: #c0c4cc;
      }
    }

    .el-tag {
      border: none;
      color: #c0c4cc;
      cursor: not-allowed;
    }
  }

  .navigation {
    background-color: #fff;
    position: fixed;
    right: 30px;
    bottom: 150px;
    width: 100px;
    padding: 8px;
    text-align: center;
    color: #999;
    border-radius: 4px;
    box-shadow: 0 0 6px rgba(0, 0, 0, 0.12);
    z-index: 1000;

    .navigation-item {
      width: 100%;
      height: 30px;
      line-height: 30px;
      cursor: pointer;
    }
  }
</style>

<style lang="less" scoped>
  .images-draggable {
    display: flex;

    /deep/ .smooth-dnd-draggable-wrapper {
      cursor: move;
    }
  }
</style>
