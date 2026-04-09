import AsyncStorage from "@react-native-async-storage/async-storage";

const OFFLINE_MAPS_KEY = "offline-maps";

export type OfflineMapRecord = {
  trailId: string;
  downloaded: boolean;
  downloadedAt: string;
};

export async function getOfflineMaps(): Promise<Record<string, OfflineMapRecord>> {
  const raw = await AsyncStorage.getItem(OFFLINE_MAPS_KEY);
  return raw ? JSON.parse(raw) : {};
}

export async function isTrailDownloaded(trailId: string): Promise<boolean> {
  const maps = await getOfflineMaps();
  return !!maps[trailId]?.downloaded;
}

export async function saveOfflineMap(trailId: string) {
  const maps = await getOfflineMaps();

  maps[trailId] = {
    trailId,
    downloaded: true,
    downloadedAt: new Date().toISOString(),
  };

  await AsyncStorage.setItem(OFFLINE_MAPS_KEY, JSON.stringify(maps));

  console.log("Saved offline map metadata:", maps);
}

export async function removeOfflineMap(trailId: string) {
  const maps = await getOfflineMaps();
  delete maps[trailId];
  await AsyncStorage.setItem(OFFLINE_MAPS_KEY, JSON.stringify(maps));

  console.log("Removed offline map metadata:", maps);
}