import { AbilityConstant, UIAbility, Want } from "@kit.AbilityKit";
import { AbilityStore } from "../AbilityStore";

export class LifecycleAbility extends UIAbility {

    static register(ability: UIAbility) {
        AbilityStore.register(ability.context)
    }

    static unregister(ability: UIAbility) {
        AbilityStore.unregister(ability.context)
    }

    static isRegistered(ability: UIAbility): boolean {
        return AbilityStore.isRegistered(ability.context)
    }

    onCreate(want: Want, launchParam: AbilityConstant.LaunchParam): void {
        super.onCreate(want, launchParam)
        LifecycleAbility.register(this)
    }

    onDestroy(): void {
        super.onDestroy()
        LifecycleAbility.unregister(this)
    }
}