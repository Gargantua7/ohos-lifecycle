import { Component } from "../ref/Component";
import { Lifecycle } from "./Lifecycle";
import { common } from "@kit.AbilityKit";

export function registerComponentIntoLifecycle(component: Component) {
    const lifecycle = Lifecycle.getOrCreate(component)
    lifecycle.addObserver({
        onPageShow: () => {
            component.onPageShow?.()
        },
        onPageHide: () => {
            component.onPageHide?.()
        },
        onBackPress: () => {
            const res = component.onBackPress?.()
            if (res) return
            const stack = component.queryNavigationInfo()?.pathStack
            if (!stack) return
            if (stack.size() <= 1) {
                (component.getUIContext().getHostContext() as common.UIAbilityContext).moveAbilityToBackground()
            } else {
                stack.pop()
            }
        }
    })
}