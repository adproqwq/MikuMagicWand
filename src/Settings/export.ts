import { RawCategory } from '@gkd-kit/api';
import { saveAs } from 'file-saver';
import { getHanashiroSettings } from '../utils/indexedDB';
import type { ISettings } from '../types/settings';
import type { RulesKeyOrder } from '../utils/sort';

export default async () => {
  const categories = await getHanashiroSettings<RawCategory[]>('categories');
  const hideLoadSnackbar = await getHanashiroSettings<boolean>('hideLoadSnackbar');
  const rulesKeySort = (await getHanashiroSettings<RulesKeyOrder>('rulesKeySort'))!;
  const simplyName = await getHanashiroSettings<boolean>('simplyName');
  const readClipboard = await getHanashiroSettings<boolean>('readClipboard');
  const vidAdaption = await getHanashiroSettings<boolean>('vidAdaption');

  const settings: ISettings = {
    categories: categories ?? [],
    hideLoadSnackbar: hideLoadSnackbar ?? false,
    rulesKeySort: rulesKeySort,
    simplyName: simplyName ?? false,
    readClipboard: readClipboard ?? false,
    vidAdaption: vidAdaption ?? false,
  };

  const settingsFile = new Blob([JSON.stringify(settings, undefined, 2)]);
  saveAs(settingsFile, 'settings.json5');
};
