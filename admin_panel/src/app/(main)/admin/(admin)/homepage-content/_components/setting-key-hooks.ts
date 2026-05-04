'use client';

import * as React from 'react';
import { toast } from 'sonner';

import {
  useGetSiteSettingAdminByKeyQuery,
  useUpdateSiteSettingAdminMutation,
} from '@/integrations/hooks';
import type { SettingValue } from '@/integrations/shared';

export function useSettingKey<T>(
  key: string,
  locale: string,
  defaultValue: T,
): {
  value: T;
  setValue: React.Dispatch<React.SetStateAction<T>>;
  save: (savedMsg: string, errMsg: string) => Promise<void>;
  loading: boolean;
  saving: boolean;
  refetch: () => void;
} {
  const { data, isLoading, isFetching, refetch } = useGetSiteSettingAdminByKeyQuery(
    locale ? { key, locale } : { key },
    { skip: !locale },
  );
  const [update, { isLoading: isUpdating }] = useUpdateSiteSettingAdminMutation();

  const [value, setValue] = React.useState<T>(defaultValue);

  React.useEffect(() => {
    if (data?.value !== undefined && data?.value !== null) {
      setValue(data.value as T);
    }
  }, [data]);

  const save = React.useCallback(
    async (savedMsg: string, errMsg: string) => {
      try {
        await update({
          key,
          value: value as unknown as SettingValue,
          locale: locale || 'tr',
        }).unwrap();
        toast.success(savedMsg);
      } catch {
        toast.error(errMsg);
      }
    },
    [key, locale, update, value],
  );

  return {
    value,
    setValue,
    save,
    loading: isLoading || isFetching,
    saving: isUpdating,
    refetch,
  };
}
