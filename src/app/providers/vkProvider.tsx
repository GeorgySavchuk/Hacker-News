import React from "react";
import {AdaptivityProvider, AppRoot, ConfigProvider} from "@vkontakte/vkui";
import "@vkontakte/vkui/dist/cssm/styles/themes.css";
import {useAdaptivity, useInsets} from "@vkontakte/vk-bridge-react";
import {transformVKBridgeAdaptivity} from "../../shared/lib";
import vkBridge, {parseURLSearchParamsForGetLaunchParams} from "@vkontakte/vk-bridge";
import {RouterProvider} from "@vkontakte/vk-mini-apps-router";
import {router} from "../../shared/routing";
export const vkProvider = (component: () => React.ReactNode) => () => {
    const adaptivity = transformVKBridgeAdaptivity(useAdaptivity());
    const vkBridgeInsets = useInsets() || undefined;
    const { vk_platform } = parseURLSearchParamsForGetLaunchParams(window.location.search);
    return (
        <ConfigProvider
            appearance="dark"
            platform={vk_platform === 'desktop_web' ? 'vkcom' : undefined}
            isWebView={vkBridge.isWebView()}
        >
            <AdaptivityProvider {...adaptivity}>
                <AppRoot mode="full" safeAreaInsets={vkBridgeInsets}>
                    <RouterProvider router={router}>
                        {component()}
                    </RouterProvider>
                </AppRoot>
            </AdaptivityProvider>
        </ConfigProvider>
    )
}