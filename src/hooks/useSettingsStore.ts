import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';
import type { AppSettings } from '../types';

export const useSettingsStore = () => {
    const settings = useLiveQuery(async () => {
        const s = await db.settings.get('default');
        return s || { id: 'default' };
    }) ?? { id: 'default' };

    const saveSettings = async (newSettings: Partial<AppSettings>) => {
        await db.settings.put({
            ...settings,
            ...newSettings,
            id: 'default'
        });
    };

    return {
        settings,
        saveSettings
    };
};
