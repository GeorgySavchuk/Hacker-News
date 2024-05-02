import {DEFAULT_VIEW, DEFAULT_VIEW_PANELS} from "../shared/routing";
import {useActiveVkuiLocation} from "@vkontakte/vk-mini-apps-router";
import {Root, View} from "@vkontakte/vkui";
import {HomePage} from "../pages/home-page";
import {StoryPage} from "../pages/story-page";

export const AppRouter = () => {
    const { panel: activePanel = DEFAULT_VIEW_PANELS.HOME, view: activeView = DEFAULT_VIEW} = useActiveVkuiLocation();
    return (
        <Root activeView={activeView}>
            <View id={DEFAULT_VIEW} activePanel={activePanel}>
                <HomePage id="home"/>
                <StoryPage id="story"/>
            </View>
        </Root>
    )
}
