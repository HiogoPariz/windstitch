import React, { ElementType, forwardRef } from 'react';
import { domElements } from './constants';
import * as W from './types';
import { evaluateClassName } from './utils';

export const styled: W.Styled = function(
    component,
    {
        className: defaultClassName,
        variants,
        transient,
        defaultProps,
        compoundVariants,
        defaultVariants,
    }
) {
    const Component = <As extends ElementType>(
        { as: asProp, ...props }: W.StyledProps<As, any, any>,
        ref: any
    ) => {
        const Tag = (asProp || component) as ElementType;
        const isTag = typeof Tag === 'string';
        const _props: Record<string, string> = {};

        for (const key in props) {
            if (!variants || !variants[key]) {
                _props[key] = props[key];
            }
        }

        if (transient) {
            for (const key of transient) {
                if (_props[key as string]) {
                    delete _props[key as string];
                }
            }
        }

        if (_props.ref) {
            delete _props.ref;
        }

        return (
            <Tag
                {...defaultProps}
                {..._props}
                ref={isTag ? ref : undefined}
                className={
                    evaluateClassName(
                        props,
                        variants || {},
                        defaultVariants,
                        compoundVariants,
                        defaultClassName
                    ) || undefined
                }
            />
        );
    };

    if (typeof component === 'string') {
        return forwardRef(Component);
    }
    if (typeof component === 'object') {
        if (
            (component as any).$$typeof === Symbol.for('react.forward_ref') ||
            (component as any).$$typeof == 0xead0
        )
            return forwardRef(Component);
    }
    return Component;
} as W.Styled;

domElements.forEach(domElement => {
    styled[domElement] = ((className, config) =>
        styled(domElement, { ...config, className })) as W.StyledTagFunction<
        typeof domElement
    >;
});
