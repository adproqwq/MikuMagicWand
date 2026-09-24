import localforage from 'localforage';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { Snapshot } from '../types/snapshot';
import { IInspectSettings } from '../types/inspectSettings';
import { detectImageMime } from './imageDetect';

const localStorage = localforage.createInstance({
  name: 'localforage',
});
const snapshotStorage = localforage.createInstance({
  name: 'snapshot',
});
const screenshotStorage = localforage.createInstance({
  name: 'screenshot',
});
const hanashiroStorage = localforage.createInstance({
  name: 'Hanashiro',
});

export const getSnapshotInfo = async (snapshotId: string): Promise<Snapshot | null> => {
  return await snapshotStorage.getItem<Snapshot>(snapshotId);
};

export const writeSnapshotInfo = async (snapshotId: string, snapshotInfo: Snapshot) => {
  await snapshotStorage.setItem(snapshotId, snapshotInfo);
};

export const getScreenInfo = async (
  snapshotId: string,
): Promise<{ width: number; height: number }> => {
  const snapshotInfo = (await getSnapshotInfo(snapshotId))!;

  return { width: snapshotInfo.screenWidth, height: snapshotInfo.screenHeight };
};

export const getScreenshot = async (snapshotId: string): Promise<ArrayBuffer> => {
  return (await screenshotStorage.getItem<ArrayBuffer>(snapshotId))!;
};

export const replaceScreenshot = async (snapshotId: string, image: ArrayBuffer) => {
  await screenshotStorage.setItem<ArrayBuffer>(snapshotId, image);
};

export const getSnapshotZip = async (snapshotId: string): Promise<Blob> => {
  const snapshotInfo = await getSnapshotInfo(snapshotId);
  const screenshot = (await screenshotStorage.getItem<ArrayBuffer>(snapshotId))!;

  const jszip = new JSZip();
  jszip.file(`snapshot-${snapshotId}.json`, JSON.stringify(snapshotInfo, undefined, 2));

  const mime = detectImageMime(screenshot) ?? 'image/png';
  const ext = mime === 'image/webp' ? 'webp' : 'png';
  jszip.file(`screenshot-${snapshotId}.${ext}`, screenshot);

  return await jszip.generateAsync({ type: 'blob' });
};

export const downloadSnapshot = async (snapshotId: string) => {
  const snapshotFile = await getSnapshotZip(snapshotId);
  saveAs(snapshotFile, `snapshot-${snapshotId}.zip`);
};

export const snapshotIdToImportId = async (snapshotId: number) => {
  const importIds = await localStorage.getItem<Record<number, number>>('githubZip');

  return importIds?.[snapshotId];
};

export const importIdToSnapshotId = async (importId: number) => {
  const snapshotIds = await localStorage.getItem<Record<number, number>>('url');

  return snapshotIds?.[importId];
};

export const setHanashiroSettings = async <T>(item: string, value: T) => {
  await hanashiroStorage.setItem(item, value);
};

export const getHanashiroSettings = async <T>(item: string): Promise<T | null> => {
  return await hanashiroStorage.getItem(item);
};

export const getInspectSettings = async (): Promise<IInspectSettings | null> => {
  return await localStorage.getItem('settings');
};

export const setInspectSettings = async (newSettings: IInspectSettings) => {
  await localStorage.setItem('settings', newSettings);
};
