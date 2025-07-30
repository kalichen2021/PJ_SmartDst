<template>
  <div class="icon-group" ref="elIconGrp" edit-state>
    <div class="border-container" ref="elIconGrpCtn">
      <div class="container" ref="elGridCtn">
        <div v-for="icon in icons" :key="icon.id" draggable="false" ref="elIconWrap" class="icon-item-wrap">
          <icon-app :name="icon.name" :app-path="icon.appPath" />
        </div>
      </div>
      <!-- 拖动控件 -->
      <span class="bar controller" draggable="true" ref="elGrabBar"><icon-bar /></span>
      <!-- 缩放控件 -->
      <span class="scaler controller" ref="elScaler"><icon-arrows-rotate /></span>
    </div>
    <CtnMenu :entries-conf="entriesConf!" ref="elCtnMenu">
      <IconMore />
    </CtnMenu>
    <span>文件夹</span>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watchEffect } from 'vue';

import { useUserOperaStore, appGroupClass } from '@/stores/UserOpera';
import { useAppGroupStore } from '@/stores/AppGroupStore';

import { MoveHandler, ScaleHandler } from './utils/MouseInteract';
import type { Point, Polygon, TP_entryConf, UserOperaState } from '@/assets/js/type';

import IconApp from './icons/IconApp.vue';
import IconBar from './icons/IconBar.vue';
import IconMore from './icons/IconMore.vue';
import IconArrowsRotate from './icons/IconArrowsRotate.vue';

import CtnMenu from '@/components/widget/CtnMenu.vue'
import { clickSwhToHide, createLinkedState, getBoundingRectWithMargin, getCookie, isPolygonIntersectPolygon, rectToPolygon, UserOperaHandler } from '@/assets/js/utils';
import { getIntervalXY, setIntervalXY } from './utils/StoreInterval';
import { onUnmounted } from 'vue';
import type { PropType } from 'vue';
import { markRaw } from 'vue';
import { reactive } from 'vue';

const props = defineProps({
  name: {
    type: String,
    default: Date.now().toString(),
  },
  position: {
    type: (Array as unknown) as PropType<Point>,
    default: () => [0, 0],
  },
  size: {
    type: (Array as unknown) as PropType<Point>,
    default: () => [2, 2],
  },
})

const icons = ref([
  { id: 1, name: '哔哩哔哩', appPath: "C:/ProgramData/Microsoft/Windows/Start Menu/Programs/哔哩哔哩.lnk" },
  { id: 2, name: 'settings' },
  { id: 3, name: 'user' },
  { id: 4, name: 'search' },
  { id: 5, name: 'bell' },
  { id: 6, name: 'heart' },
  { id: 7, name: 'star' },
  { id: 8, name: 'camera' },
  { id: 9, name: 'video' },
  { id: 10, name: 'music' },
  { id: 7, name: 'star' },
  { id: 8, name: 'camera' },
  { id: 9, name: 'video' },
  { id: 10, name: 'music' },
  { id: 7, name: 'star' },
  { id: 8, name: 'camera' },
  { id: 9, name: 'video' },
  { id: 10, name: 'music' },
  { id: 7, name: 'star' },
  { id: 8, name: 'camera' },
  { id: 9, name: 'video' },
  // { id: 10, name: 'music' },

]);


const userOperaStore = useUserOperaStore()
const AppGroupStore = useAppGroupStore();

const elIconGrp = ref<HTMLElement | null>(null)
const elIconGrpCtn = ref<HTMLElement | null>(null)
const elGridCtn = ref<HTMLElement | null>(null)
const elIconWrap = ref<[HTMLElement] | null>(null)
const elGrabBar = ref<HTMLElement | null>(null)
const elScaler = ref<HTMLElement | null>(null)
const entriesConf = ref<[TP_entryConf]>()

let GrpCtnControllerList: HTMLElement[] = []
// tips: InstanceType 实例类型
const elCtnMenu = ref<InstanceType<typeof CtnMenu> | null>(null)

// 允许拖动控件工作
const enableCtrlerWork = () => {
  elGrabBar.value!.draggable = true;
  GrpCtnControllerList.forEach((el) => el!.style.display = "block")

  // 点击空白位置，隐藏控件
  // UserOperaHandler(AppGroupStore.instances)
  clickSwhToHide(
    GrpCtnControllerList,
    [elCtnMenu.value!.dom!, elIconGrp.value!, ".controller"],
    // () => userOperaStore.ctrlState = "IDLE"
    () => {
      // 复原粒子效果
      // console.log(userOperaStore.initializeParticles)
      userOperaStore.initializeParticles([[0, 0], [0, 0], [0, 0], [0, 0]])
    }
  )
}

// 设置控制器显示样式
const setCtrlerDisplayStyle = (displayStyle: string) => {
  elGrabBar.value!.style.display = displayStyle
  elScaler.value!.style.display = displayStyle
}

// 获得实际坐标
const getClientVal = (relVal: Point) => {
  const interval = getIntervalXY()
  const [x, y] = relVal
  return [x * interval.x, y * interval.y] as Point
}

const expose = createLinkedState({
  name: props.name,
  id: props.name,
  appGroupPosition: props.position,
  appGroupSize: props.size,
  GrpCtnCtrlerList: reactive({
    default: [elGrabBar, elScaler]
  }),
  state: {
    default: "IDLE" as UserOperaState,
    callback: (curState) => {
      // console.log(curState)
      switch (curState) {
        case "IDLE":
          userOperaStore.ctrlState = "IDLE";
          // 设置控制器显示样式
          elIconGrp.value!.setAttribute("edit-state", "")
          elIconGrp.value!.className = "icon-group"
          // setCtrlerDisplayStyle("none")
          userOperaStore.initializeParticles([[0, 0], [0, 0], [0, 0], [0, 0]]);// 复原粒子效果
          break;
        case "EDITING":
          elIconGrp.value!.setAttribute("edit-state", "")
          elIconGrp.value!.classList.add("icon-group-edit")
          // setCtrlerDisplayStyle("block")
          break;
        case "EDIT_DRAG":
          elIconGrp.value!.setAttribute("edit-state", "drag")
          break
        case "EDIT_SCALE":
          elIconGrp.value!.setAttribute("edit-state", "scale")
          break;
        case "EDIT_INTERSECT":
          // elIconGrp.value!.setAttribute("edit-state", "intersect")
          break;
        case "INTERSECTED":
          elIconGrp.value!.setAttribute("edit-state", "intersected")
          break;
        default:
          break;
      }
    }
  },
  appGroupPolygon: ({ appGroupPosition, appGroupSize }) => {
    return rectToPolygon({
      x: appGroupPosition[0],
      y: appGroupPosition[1],
      width: appGroupSize[0] + 1,
      height: appGroupSize[1] + 1
    })
  },
  appGroupClientPosition: ({ appGroupPosition }: { appGroupPosition: Point }): Point => getClientVal(appGroupPosition),
  appGroupClientSize: ({ appGroupSize }: { appGroupSize: Point }): Point => getClientVal(appGroupSize),
  appGroupClientPolygon: ({ appGroupClientPosition, appGroupClientSize }) => {
    return rectToPolygon({
      x: appGroupClientPosition[0],
      y: appGroupClientPosition[1],
      width: appGroupClientSize[0],
      height: appGroupClientSize[1]
    })
  },
  enableEdit: () => enableCtrlerWork
})

defineExpose(expose)
const emit = defineEmits(['created', 'destroyed']);

onMounted(() => {
  // 组件创造时，执行注册事件
  emit('created', expose);
  // 获取控制器元素
  GrpCtnControllerList = Array.from(
    elIconGrpCtn.value!.querySelectorAll(".controller")
  ) as HTMLElement[];

  /** 编辑文件图标组步骤说明；
   * 1. 文件图标组是否被右击 ---y--> 右键菜单
   * 2. 右键菜单中编辑选项是否被点击 ---y--> 文件图标组设置为编辑状态
   * 3. 监听文件图标组是否为编辑状态 ---y--> 显示操作控件
   * 
   * 编辑状态下，文件图标组的控制器可拖动、缩放
   */
  //#region 应用右键菜单
  elCtnMenu.value!.apply(elIconGrpCtn.value!)
  // 右键菜单条目设置
  entriesConf.value = [{
    name: "SetGrp",
    animate: "rotate-ani",
    // 点击进入控件设置
    clickHandler: () => {
      enableCtrlerWork()
    }
  }]
  //#endregion

  // 控件事件
  // 读取cookie中的intervalX和intervalY
  const interval = getIntervalXY()
  // 若未设置intervalX和intervalY，设置为图标大小，刷新页面
  if (Number.isNaN(interval.x)) {
    const iconSize = elIconWrap.value![0].getBoundingClientRect(); // Use the first element in the array
    setIntervalXY({ x: iconSize.width, y: iconSize.height })
    location.reload()
  }

  // 存储位置
  const storePosition = () => {
    expose.appGroupPosition = [
      mvHder.curPosition[0],
      mvHder.curPosition[1]
    ]
  }
  const storeSize = () => {
    expose.appGroupSize = [
      sclHder.curSize[0],
      sclHder.curSize[1]
    ]
  }
  const _tranStyle = "all .3s"
  let intersectedAppGroupState = new Map()
  const mvHder = new MoveHandler(
    // #region 应用拖动功能
    elIconGrp.value!,
    {
      interval,
      _startFnCallback: () => {
        // console.log("start")
        elIconGrp.value!.style.transition = _tranStyle
        userOperaStore.ctrlState = "EDIT_DRAG"
        expose.state = "EDIT_DRAG"
      },
      _processFnCallback: () => {
        // 写入store
        storePosition()
        // 绘制canvas网格
        userOperaStore.canvasAnimate(expose.id)
        Array.from(AppGroupStore.instances.values()).filter(itemAppGroup => itemAppGroup.id !== expose.id).forEach(itemAppGroup => {
          if (isPolygonIntersectPolygon(itemAppGroup.appGroupPolygon as Polygon, expose.appGroupPolygon as Polygon)) {
            // console.log(itemAppGroup.name, "与当前图标组相交")
            if (!intersectedAppGroupState.has(itemAppGroup.id)) {
              intersectedAppGroupState.set(itemAppGroup.id, itemAppGroup.state)
            }
            itemAppGroup.state = "INTERSECTED"
            expose.state = "EDIT_INTERSECT"
            // console.log(itemAppGroup.appGroupPolygon, expose.appGroupPolygon)
          } else if (intersectedAppGroupState.has(itemAppGroup.id)) {
            itemAppGroup.state = intersectedAppGroupState.get(itemAppGroup.id)
            intersectedAppGroupState.delete(itemAppGroup.id)
          }
        })
      },
      _stopFnCallback: () => {
        // 写入store
        // storePosition()
        // userOperaStore.canvasAnimate(mvHder.curPosition)
        userOperaStore.canvasAnimate(expose.id)
        elIconGrp.value!.style.removeProperty('transition')
        userOperaStore.ctrlState = "EDITING"
        expose.state = "EDITING"
        console.log("stop")
      }
    }
    // #endregion
  );
  const sclHder = new ScaleHandler(
    // #region 应用缩放功能
    elGridCtn.value!,
    {
      interval,
      _startFnCallback: () => {
        elIconGrp.value!.style.transition = _tranStyle
        elIconGrpCtn.value!.style.transition = _tranStyle
        elGridCtn.value!.style.transition = _tranStyle
        // userOperaStore.ctrlState = "SCALE"
        expose.state = "EDIT_SCALE"
        userOperaStore.ctrlState = "EDIT_SCALE"

      },
      _processFnCallback: () => {
        // 写入store
        storeSize()
        // 重绘canvas网络
        // userOperaStore.canvasAnimate(mvHder.curPosition)
        userOperaStore.canvasAnimate(expose.id)
      },
      _stopFnCallback: () => {
        elIconGrp.value!.style.removeProperty('transition')
        elIconGrpCtn.value!.style.removeProperty('transition')
        elGridCtn.value!.style.removeProperty('transition')
        // userOperaStore.ctrlState = "IDLE"
        expose.state = "EDITING"
      }
    }
    //#endregion
  );

  // 首次更新
  mvHder._processFnCallback()
  sclHder._processFnCallback()

  // 应用控件功能
  elGrabBar.value!.onmousedown = (e) => mvHder.apply(e);
  elScaler.value!.onmousedown = (e) => sclHder.apply(e);

})

onUnmounted(() => {
  // 组件销毁时，执行注销事件
  emit('destroyed', expose.id);
})
</script>

<style scoped lang="scss">
@include rotate-ani(0, -.5rem);
@include move-ani(0, -.5rem);
@include shake-ani(.1rem, .1rem, 1, 5);

// tips: 不同单位变量换算用calc()
// :root {}


.icon-group {
  --grid-box-size-w: calc(var(--icon-w) * 3);
  --grid-box-size-h: calc(var(--icon-h) * 3);
  --grp-padding-w: calc(var(--icon-w) * 0.5 - var(--ctn-padding));
  --grp-padding-h: calc(var(--icon-h) * 0.5 - var(--ctn-padding));
  // 节省重绘开销
  position: fixed;
  top: 0;
  left: 0;
  // tips: outline 相比 border 不会影响元素的尺寸
  // outline: red 1px solid; // debug
  @include display-lt;
  width: fit-content;
  height: fit-content;
  // tips: padding: <padding-col> <>padding-row>
  padding: var(--grp-padding-h) var(--grp-padding-w);

  // user-select: none;
  // -webkit-user-drag: none;
  // 使用GPU加速
  will-change: transform;
  transform: translate3d(0, 0, 0);
  // transform: ;
  transition: transform 1s cubic-bezier(1, -1.2, 0.11, 1.46);
}


.border-container {
  position: relative;
  // outline: 5px solid #916f0088;
  border-radius: 1rem;
  padding: var(--ctn-padding);
  @include display-c;
  // width: calc(var(--icon-size)*1/4 + var(--grid-box-size-w));
  // height: calc(var(--icon-size)*1/3 + var(--grid-box-size-h));
  user-select: none;

  background-color: #4444444d;
  // 内阴影,添加内外阴影，防止过渡失效
  box-shadow: inset 0 4px 8px rgba(0, 0, 0, .9), 0 0 0px rgba(0, 0, 0, .3);
  backdrop-filter: blur(3px);
  transition: all .6s cubic-bezier(1, -1.2, 0.11, 1.46);

  overflow: hidden;
  // resize: both;
}

.border-container .controller {
  position: absolute;
  display: none;
}

//#region controller style 
.border-container .controller svg {
  width: 100%;
  height: 100%;
}

.border-container .controller:hover {
  cursor: grab;
}

.border-container .bar {
  transition: all .3s ease;
  top: calc(var(--ctn-padding) * -1);
  width: 5rem;
  height: 1rem;
}

.border-container .bar:hover {
  scale: 1.2;
}

.border-container .scaler {
  position: absolute;
  width: 1rem;
  height: 1rem;
  bottom: -.05rem;
  right: -.05rem;
}

.border-container .scaler svg {
  position: absolute;
  bottom: 0;
  right: 0;
}

//#endregion 
.icon-group[edit-state="intersected"] {
  .border-container {
    box-shadow: inset 1px 5px 20px rgba(0, 0, 0, .9), 0 0 0px rgba(0, 0, 0, .3);
    backdrop-filter: blur(10px);
    // transition: all 1s ease;
    animation: shake-ani .6s ease infinite;
  }
}


.icon-group-edit {
  .controller {
    display: block;
  }

  // .border-container {
  //   // outline: 5px solid #15ff0026;
  //   // transition: all 1s ease;
  // }
}

.icon-group-edit[edit-state="drag"] {
  z-index: 50;

  // 外阴影
  .border-container {
    transform: scale(1.08);
    box-shadow: inset 0 0 0px rgba(0, 0, 0, 0.5), 2px 2px 12px rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(10px);
    // transition: all 1s ease;
  }
}

.icon-group-edit[edit-state="move"] {

  // 外阴影
  .border-container {
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(10px);
  }
}

.icon-group-edit[edit-state="intersect"] {

  // 外阴影
  .border-container {
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(10px);
  }
}



.container {
  // border: red 1px solid;
  display: grid;
  /* 3*3布局，每个格子最大为32px, 超出3行scroll*/

  /* gap: 10px; */
  grid-template-columns: repeat(auto-fit, minmax(var(--icon-w), 1fr));
  // 减去文本高度
  grid-template-rows: repeat(auto-fit, minmax(var(--icon-h), 1fr));

  overflow-y: auto;
  overflow-x: hidden;
  max-width: var(--grid-box-size-w);
  max-height: var(--grid-box-size-h);

  // // 改变容器大小
  // resize: both;
}

/* 设置滚动条样式 */
.container {
  /* Add any additional styles for the scrollbar here */
  scrollbar-width: none;
  /* For Firefox */
  scrollbar-color: #00a170 #000000;

  /* For Firefox */
  /* Custom scrollbar styles for WebKit browsers */
  &::-webkit-scrollbar {
    width: 0px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
  }

  &::-webkit-scrollbar-thumb {
    background: #00a170;
    /* Updated color for the scrollbar thumb */
    border-radius: 2px;
  }
}

.icon-item-wrap {
  width: var(--icon-w);
  height: var(--icon-h);
  padding: .1rem;
  // margin: var(--icon-app-margin);
}

span {
  width: 100%;
  height: 0;
  font-size: 0.9rem;
  color: var(--color-text);
  text-align: center;
  /* margin-top: 0rem; */
  /* Add any additional styles for the text here */
}
</style>