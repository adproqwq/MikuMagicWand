import type { RouteLocationNormalized } from 'vue-router';
import { importIdToSnapshotId } from './indexedDB';

type RouteParams = RouteLocationNormalized['params'];

// 页面上存在多个 [data-v-app]（宿主页面的与本脚本自己注入的），
// 且本脚本注入的那个没有 vue-router，因此需要挑出真正带 $route 的宿主 app
const getHostRouteParams = (): RouteParams | undefined => {
  for (const element of document.querySelectorAll<HTMLElement>('[data-v-app]')) {
    const route = element.__vue_app__?.config.globalProperties.$route as
      | RouteLocationNormalized
      | undefined;

    if (route?.params) return route.params;
  }
};

// 注入模式不同时（如 Firefox 的沙箱注入）宿主的 __vue_app__ 不可见，此时回退到解析 URL
const getPathRouteParams = (): RouteParams => {
  const [, type, id] = location.pathname.split('/');

  return type === 'import' ? { github_asset_id: id } : { snapshotId: id };
};

export default async (): Promise<string> => {
  const params = getHostRouteParams() ?? getPathRouteParams();

  if (Object.hasOwn(params, 'snapshotId')) return params.snapshotId as string;
  else return String((await importIdToSnapshotId(Number(params.github_asset_id as string)))!);
};
