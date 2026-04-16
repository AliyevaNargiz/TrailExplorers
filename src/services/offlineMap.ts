import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Trail } from "../data/trails";

const OFFLINE_MAPS_KEY = "offline-maps";

export type OfflineMapRecord = {
  trailId: string;
  downloaded: boolean;
  downloadedAt: string;
  trail: Trail;
};

export async function getOfflineMaps(): Promise<Record<string, OfflineMapRecord>> {
  const raw = await AsyncStorage.getItem(OFFLINE_MAPS_KEY);
  return raw ? JSON.parse(raw) : {};
}

export async function isTrailDownloaded(trailId: string): Promise<boolean> {
  const maps = await getOfflineMaps();
  return !!maps[trailId]?.downloaded;
}

export async function saveOfflineMap(trail: Trail): Promise<void> {
  const maps = await getOfflineMaps();
  // const trailId = trail.id;

  maps[trail.id] = {
    trailId: trail.id,
    downloaded: true,
    downloadedAt: new Date().toISOString(),
    trail,
  };

  await AsyncStorage.setItem(OFFLINE_MAPS_KEY, JSON.stringify(maps));

  console.log("Saved offline map metadata:", maps);
}

export async function getOfflineTrail(trailId: string): Promise<Trail | null> {
  const maps = await getOfflineMaps();
  return maps[trailId]?.trail ?? null;
}


export async function removeOfflineMap(trailId: string) {
  const maps = await getOfflineMaps();
  delete maps[trailId];
  await AsyncStorage.setItem(OFFLINE_MAPS_KEY, JSON.stringify(maps));

  console.log("Removed offline map metadata:", maps);
}