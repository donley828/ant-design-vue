import { computed, defineComponent } from 'vue';
import classNames from '../_util/classNames';
import PropTypes from '../_util/vue-types';
import { tuple } from '../_util/type';
import useConfigInject from '../_util/hooks/useConfigInject';
import Element, { skeletonElementProps, SkeletonElementProps } from './Element';
import Omit from 'omit.js';

export interface SkeletonInputProps extends Omit<SkeletonElementProps, 'size' | 'shape'> {
  size?: 'large' | 'small' | 'default';
}

const SkeletonInput = defineComponent({
  name: 'ASkeletonInput',
  props: {
    ...Omit(skeletonElementProps(), 'shape'),
    size: PropTypes.oneOf(tuple('large', 'small', 'default')),
  },
  setup(props) {
    const { prefixCls } = useConfigInject('skeleton', props);
    const cls = computed(() =>
      classNames(prefixCls.value, `${prefixCls.value}-element`, {
        [`${prefixCls.value}-active`]: props.active,
      }),
    );
    return () => {
      return (
        <div class={cls.value}>
          <Element {...props} prefixCls={`${prefixCls.value}-input`} />
        </div>
      );
    };
  },
});

export default SkeletonInput;
