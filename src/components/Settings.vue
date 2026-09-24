<script lang="ts">
import { defineComponent } from 'vue';
import { TextField, Switch, Dialog } from 'mdui';
import { RawCategory } from '@gkd-kit/api';
import json5 from 'json5';
import settings from '../Settings/settings';
import _import, { getLocalSettings } from '../Settings/import';
import _export from '../Settings/export';
import { send } from '../utils/event';
import { getHanashiroSettings, getInspectSettings } from '../utils/indexedDB';
import type { RulesKeyOrder } from '../utils/sort';

export default defineComponent({
  methods: {
    settings() {
      settings();
    },
    async exportSettings() {
      await _export();
    },
    importSettings() {
      _import();
    },
    async getLocalSettingsFile() {
      await getLocalSettings();
    },
    closeDialog() {
      send('closePage');
    },
  },
  async mounted() {
    if (await getHanashiroSettings('categories')) {
      (document.querySelector('#categories') as TextField).value = json5.stringify(
        (await getHanashiroSettings<RawCategory[]>('categories'))!,
      );
    }
    if (await getHanashiroSettings('rulesKeySort')) {
      (document.querySelector('#rulesKeySort') as TextField).value = json5.stringify(
        (await getHanashiroSettings<RulesKeyOrder>('rulesKeySort'))!,
      );
    }
    if (await getInspectSettings()) {
      (document.querySelector('#maxShowSize') as TextField).value = String(
        (await getInspectSettings())!.maxShowNodeSize,
      );
    }
    if (await getHanashiroSettings<boolean>('hideLoadSnackbar'))
      (document.querySelector('#hideLoadSnackbar') as Switch).checked = true;
    if (await getHanashiroSettings<boolean>('simplyName'))
      (document.querySelector('#simplyName') as Switch).checked = true;
    if (await getHanashiroSettings<boolean>('readClipboard'))
      (document.querySelector('#readClipboard') as Switch).checked = true;
    if (await getHanashiroSettings<boolean>('vidAdaption'))
      (document.querySelector('#vidAdaption') as Switch).checked = true;

    (document.querySelector('#page') as Dialog).open = true;
  },
});
</script>

<template>
  <mdui-dialog id="page" headline="设置" close-on-overlay-click close-on-esc @closed="closeDialog">
    <div>
      <mdui-button variant="tonal" @click="exportSettings">导出</mdui-button>
      <mdui-button variant="tonal" @click="importSettings">导入</mdui-button>
    </div>
    <div>
      <span>分类设置：</span>
      <mdui-text-field
        variant="filled"
        id="categories"
        label="分类"
        placeholder="填入合法的分类"
        rows="10"
      ></mdui-text-field>
    </div>
    <div>
      <span>字段排序设置：</span>
      <mdui-text-field
        variant="filled"
        id="rulesKeySort"
        label="字段排序"
        placeholder="目前仅支持rules内字段"
        rows="10"
      ></mdui-text-field>
      <span class="introduction">
        接受一个字符串数组，目前支持的字段有：
        key,preKeys,fastQuery,matchTime,actionMaximum,resetMatch,priorityTime
        matchRoot,action,activityIds,position,matches,exampleUrls,snapshotUrls
      </span>
    </div>
    <div>
      <span>节点阈值：</span>
      <mdui-text-field
        variant="filled"
        id="maxShowSize"
        type="number"
        label="节点阈值"
        placeholder="填入数字"
      ></mdui-text-field>
      <span class="introduction">最大节点展示数量，超出的节点将被丢弃</span>
    </div>
    <div>
      <span>隐藏加载成功提示：</span>
      <mdui-switch id="hideLoadSnackbar"></mdui-switch>
      <span class="introduction">每次脚本加载时会弹出一个snackbar，此选项可选择是否弹出</span>
    </div>
    <div>
      <span>name属性复制优化：</span>
      <mdui-switch id="simplyName"></mdui-switch>
      <span class="introduction"
        >在复制name属性时，会自动优化复制的内容。如复制 android.widget.TextView 时会优化为
        TextView</span
      >
    </div>
    <div>
      <span>自动读取剪贴板：</span>
      <mdui-switch id="readClipboard"></mdui-switch>
      <span class="introduction"
        >当进入网页审查工具首页时，自动读取剪贴板。如果存在以.zip结尾的链接时，自动粘贴以唤起快捷导入窗口。火狐内核不可用。</span
      >
    </div>
    <div>
      <span>旧快照 vid 适配：</span>
      <mdui-switch id="vidAdaption"></mdui-switch>
      <span class="introduction">在旧快照中，在符合条件的节点上显示 vid</span>
    </div>
    <div>
      <mdui-button slot="action" variant="tonal" @click="settings">确定</mdui-button>
    </div>
  </mdui-dialog>
  <input type="file" id="localImport" accept=".json,.json5" @change="getLocalSettingsFile" />
</template>

<style>
mdui-dialog > * > span {
  display: flex;
  font-size: var(--mdui-typescale-body-large-size);
}

#categories {
  width: 500px;
}

input#localImport {
  display: none;
}
</style>
