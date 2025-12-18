import { defineOverridesPreferences } from '@vben/preferences';

/**
 * @description 项目配置文件
 * 只需要覆盖项目中的一部分配置，不需要的配置不用覆盖，会自动使用默认配置
 * !!! 更改配置后请清空缓存，否则可能不生效
 */
export const overridesPreferences = defineOverridesPreferences({
  // overrides
  app: {
    name: import.meta.env.VITE_APP_TITLE,
    accessMode: 'backend',
    enablePreferences: false,
    defaultHomePath: '/home',
    persistence: false,
    contentPadding: 4,
    contentPaddingLeft: 0,
  },
  logo: {
    fit: 'fill',
    source: '/logo.svg',
    // height: 32,
  },
  breadcrumb: {
    enable: false,
  },
  sidebar: {
    autoActivateChild: false,
    collapsed: false,
    collapsedButton: true,
    collapsedShowTitle: false,
    collapseWidth: 60,
    enable: true,
    expandOnHover: true,
    extraCollapse: false,
    extraCollapsedWidth: 60,
    fixedButton: true,
    hidden: false,
    mixedWidth: 80,
    width: 224,
  },
  tabbar: {
    position: 'breadcrumb',
    showMaximize: false,
    showMore: false,
    showIcon: false,
  },
  header: {
    height: 42,
  },
  theme: {
    mode: 'light',
    builtinType: 'default',
    colorPrimary: 'hsl(205 100% 53%)',
    colorSuccess: 'hsl(100 54% 39%)',
    colorDestructive: 'hsl(0 48% 55%)',
    colorWarning: 'hsl(36 59% 45%)',
    radius: '0.25',
    semiDarkSidebar: true,
  },
  widget: {
    globalSearch: false,
    notification: false,
    sidebarToggle: false,
    themeToggle: false,
    languageToggle: false,
    fullscreen: false,
    lockScreen: false,
    refresh: false,
  },
  shortcutKeys: {
    enable: false,
    globalLogout: false,
    globalSearch: false,
  },
});
