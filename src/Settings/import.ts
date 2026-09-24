import { dialog, prompt, snackbar } from 'mdui';
import json5 from 'json5';
import { ISettings } from '../types/settings';
import { RawCategoryZod } from '../types/categoryZod';
import { setHanashiroSettings } from '../utils/indexedDB';

const setValue = async (settings: ISettings) => {
  try {
    let isCategoriesLegal = true;
    try {
      settings.categories.forEach((category) => RawCategoryZod.parse(category));
    } catch {
      isCategoriesLegal = false;
      snackbar({
        message: '分类格式错误，已跳过分类设置！',
        placement: 'top',
      });
    }
    if (isCategoriesLegal) await setHanashiroSettings('categories', settings.categories);
    await setHanashiroSettings('hideLoadSnackbar', settings.hideLoadSnackbar);
    await setHanashiroSettings('rulesKeySort', settings.rulesKeySort);
    await setHanashiroSettings('simplyName', settings.simplyName);
    await setHanashiroSettings('readClipboard', settings.readClipboard);
    await setHanashiroSettings('vidAdaption', settings.vidAdaption);
  } catch {
    snackbar({
      message: '应用设置失败',
      placement: 'top',
    });
    return;
  }
};

const getRemoteSettings = async (url: string) => {
  let remoteSettings: ISettings;
  try {
    remoteSettings = json5.parse(await (await fetch(url)).text());
  } catch {
    snackbar({
      message: '请求失败！',
      placement: 'top',
    });
    return;
  }

  await setValue(remoteSettings);

  snackbar({
    message: '设置应用成功！重新打开页面即可看见更改',
    placement: 'top',
  });
};

const showFilePicker = () =>
  (document.querySelector('input#localImport') as HTMLInputElement).click();

export const getLocalSettings = async () => {
  const inputElement = document.querySelector('input#localImport') as HTMLInputElement;

  const fileList = inputElement.files;
  if (!fileList) return;

  const file = fileList[0];

  const localSettings = json5.parse<ISettings>(await file.text());

  await setValue(localSettings);

  snackbar({
    message: '设置应用成功！重新打开页面即可看见更改',
    placement: 'top',
  });
};

export default () => {
  dialog({
    headline: '选择导入渠道',
    description: '选择从本地导入或者远程导入',
    closeOnEsc: true,
    closeOnOverlayClick: true,
    actions: [
      {
        text: '本地导入',
        onClick: showFilePicker,
      },
      {
        text: '远程导入',
        onClick: () => {
          prompt({
            headline: '远程设置文件链接',
            description: '请输入远程设置文件的链接以导入',
            closeOnEsc: true,
            closeOnOverlayClick: true,
            confirmText: '导入',
            cancelText: '取消',
            onConfirm: async (value) => {
              if (!value) {
                snackbar({
                  message: '请输入链接！',
                  placement: 'top',
                });

                return new Promise((_, reject) => reject(false));
              } else await getRemoteSettings(value);
            },
          });
        },
      },
    ],
  });
};
