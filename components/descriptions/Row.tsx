import Cell from './Cell';
import { getSlot, getClass, getStyle } from '../_util/props-util';
import { FunctionalComponent, VNode, inject, ref } from 'vue';
import { descriptionsContext, DescriptionsContextProp } from './index';

interface CellConfig {
  component: string | [string, string];
  type: string;
  showLabel?: boolean;
  showContent?: boolean;
}

export interface RowProps {
  prefixCls: string;
  vertical: boolean;
  row: any[];
  bordered: boolean;
  colon: boolean;
  index: number;
}

const Row: FunctionalComponent<RowProps> = props => {
  const renderCells = (
    items: VNode[],
    { colon, prefixCls, bordered },
    {
      component,
      type,
      showLabel,
      showContent,
      labelStyle: rootLabelStyle,
      contentStyle: rootContentStyle,
    }: CellConfig & DescriptionsContextProp,
  ) => {
    return items.map((item, index) => {
      const {
        prefixCls: itemPrefixCls = prefixCls,
        span = 1,
        labelStyle,
        contentStyle,
        label = (item.children as any)?.label?.(),
      } = item.props || {};
      const children = getSlot(item);
      const className = getClass(item);
      const style = getStyle(item);
      const { key } = item;

      if (typeof component === 'string') {
        return (
          <Cell
            key={`${type}-${key || index}`}
            class={className}
            style={style}
            labelStyle={{ ...rootLabelStyle.value, ...labelStyle }}
            contentStyle={{ ...rootContentStyle.value, ...contentStyle }}
            span={span}
            colon={colon}
            component={component}
            itemPrefixCls={itemPrefixCls}
            bordered={bordered}
            label={showLabel ? label : null}
            content={showContent ? children : null}
          />
        );
      }

      return [
        <Cell
          key={`label-${key || index}`}
          class={className}
          style={{ ...rootLabelStyle.value, ...style, ...labelStyle }}
          span={1}
          colon={colon}
          component={component[0]}
          itemPrefixCls={itemPrefixCls}
          bordered={bordered}
          label={label}
        />,
        <Cell
          key={`content-${key || index}`}
          class={className}
          style={{ ...rootContentStyle.value, ...style, ...contentStyle }}
          span={span * 2 - 1}
          component={component[1]}
          itemPrefixCls={itemPrefixCls}
          bordered={bordered}
          content={children}
        />,
      ];
    });
  };

  const { prefixCls, vertical, row, index, bordered } = props;
  const { labelStyle, contentStyle } = inject(descriptionsContext, {
    labelStyle: ref({}),
    contentStyle: ref({}),
  });
  if (vertical) {
    return (
      <>
        <tr key={`label-${index}`} class={`${prefixCls}-row`}>
          {renderCells(row, props, {
            component: 'th',
            type: 'label',
            showLabel: true,
            labelStyle,
            contentStyle,
          })}
        </tr>
        <tr key={`content-${index}`} class={`${prefixCls}-row`}>
          {renderCells(row, props, {
            component: 'td',
            type: 'content',
            showContent: true,
            labelStyle,
            contentStyle,
          })}
        </tr>
      </>
    );
  }

  return (
    <tr key={index} class={`${prefixCls}-row`}>
      {renderCells(row, props, {
        component: bordered ? ['th', 'td'] : 'td',
        type: 'item',
        showLabel: true,
        showContent: true,
        labelStyle,
        contentStyle,
      })}
    </tr>
  );
};

export default Row;
