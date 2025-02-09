import { inject, defineComponent, VNodeTypes, PropType, computed, ComputedRef } from 'vue';
import PropTypes from '../_util/vue-types';
import defaultLocaleData from './default';
import { Locale } from '.';

export interface LocaleReceiverProps {
  componentName?: string;
  defaultLocale?: Locale | Function;
  children: (locale: Locale, localeCode?: string, fullLocale?: Locale) => VNodeTypes;
}

interface LocaleInterface {
  [key: string]: any;
}

export interface LocaleReceiverContext {
  antLocale?: LocaleInterface;
}

export default defineComponent({
  name: 'LocaleReceiver',
  props: {
    componentName: PropTypes.string,
    defaultLocale: {
      type: [Object, Function],
    },
    children: {
      type: Function as PropType<
        (locale: any, localeCode?: string, fullLocale?: object) => VNodeTypes
      >,
    },
  },
  setup(props, { slots }) {
    const localeData = inject<LocaleReceiverContext>('localeData', {});
    const locale = computed(() => {
      const { componentName = 'global', defaultLocale } = props;
      const locale =
        defaultLocale || (defaultLocaleData as LocaleInterface)[componentName || 'global'];
      const { antLocale } = localeData;

      const localeFromContext = componentName && antLocale ? antLocale[componentName] : {};
      return {
        ...(typeof locale === 'function' ? locale() : locale),
        ...(localeFromContext || {}),
      };
    });
    const localeCode = computed(() => {
      const { antLocale } = localeData;
      const localeCode = antLocale && antLocale.locale;
      // Had use LocaleProvide but didn't set locale
      if (antLocale && antLocale.exist && !localeCode) {
        return defaultLocaleData.locale;
      }
      return localeCode;
    });
    return () => {
      const children = props.children || slots.default;
      const { antLocale } = localeData;
      return children?.(locale.value, localeCode.value, antLocale);
    };
  },
});

type LocaleComponent = keyof Locale;

export function useLocaleReceiver<T extends LocaleComponent>(
  componentName: T,
  defaultLocale?: Locale[T] | Function,
): [ComputedRef<Locale[T]>] {
  const localeData = inject<LocaleReceiverContext>('localeData', {} as LocaleReceiverContext);
  const componentLocale = computed(() => {
    const { antLocale } = localeData;
    const locale =
      defaultLocale || (defaultLocaleData as LocaleInterface)[componentName || 'global'];
    const localeFromContext = componentName && antLocale ? antLocale[componentName] : {};

    return {
      ...(typeof locale === 'function' ? (locale as Function)() : locale),
      ...(localeFromContext || {}),
    };
  });
  return [componentLocale];
}
