"use client";

import React, { type ReactNode, cloneElement, isValidElement } from "react";
import type { AccessLevel, FeatureKey } from "@/lib/rbac/types";
import { usePermission } from "@/lib/rbac/hooks";

interface AuthorizeProps {
    feature: FeatureKey;
    level?: AccessLevel;
    children: ReactNode;
    fallback?: ReactNode;
    /**
     * If disabledTooltip is provided and permission is denied,
     * the child element is rendered as disabled with the tooltip text rather than hidden.
     */
    disabledTooltip?: string;
}

export function Authorize({
    feature,
    level = "read",
    children,
    fallback = null,
    disabledTooltip,
}: AuthorizeProps) {
    const { allowed } = usePermission(feature, level);

    if (allowed) {
        return <>{children}</>;
    }

    if (disabledTooltip && isValidElement(children)) {
        interface ChildProps {
            className?: string;
            disabled?: boolean;
            title?: string;
            onClick?: (e: React.MouseEvent) => void;
        }
        const childElement = children as React.ReactElement<ChildProps>;
        const existingClassName = childElement.props.className || "";

        return cloneElement(childElement, {
            disabled: true,
            title: disabledTooltip,
            className: `${existingClassName} opacity-50 cursor-not-allowed pointer-events-auto`,
            onClick: (e: React.MouseEvent) => {
                e.preventDefault();
                e.stopPropagation();
            },
        });
    }

    return <>{fallback}</>;
}
