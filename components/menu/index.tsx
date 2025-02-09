import Menu, { MenuProps } from './src/Menu';
import MenuItem, { MenuItemProps } from './src/MenuItem';
import SubMenu, { SubMenuProps } from './src/SubMenu';
import ItemGroup, { MenuItemGroupProps } from './src/ItemGroup';
import Divider from './src/Divider';
import { App, Plugin } from 'vue';
/* istanbul ignore next */
Menu.install = function(app: App) {
  app.component(Menu.name, Menu);
  app.component(MenuItem.name, MenuItem);
  app.component(SubMenu.name, SubMenu);
  app.component(Divider.name, Divider);
  app.component(ItemGroup.name, ItemGroup);
  return app;
};

Menu.Item = MenuItem;
Menu.Divider = Divider;
Menu.SubMenu = SubMenu;
Menu.ItemGroup = ItemGroup;

export {
  SubMenu,
  MenuItem as Item,
  MenuItem,
  ItemGroup,
  Divider,
  MenuProps,
  SubMenuProps,
  MenuItemProps,
  MenuItemGroupProps,
};

export default Menu as typeof Menu &
  Plugin & {
    readonly Item: typeof MenuItem;
    readonly SubMenu: typeof SubMenu;
    readonly Divider: typeof Divider;
    readonly ItemGroup: typeof ItemGroup;
  };
