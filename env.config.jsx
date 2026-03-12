import React from "react";
import {PLUGIN_OPERATIONS, DIRECT_PLUGIN} from "@openedx/frontend-plugin-framework";
import CustomApp from "./src/CustomApp";

const getPluginSlots = () => {
    return {
        learner_dashboard_page_plugin_slot: {
            plugins: [
                {
                    op: PLUGIN_OPERATIONS.Insert,
                    widget:{
                        id: "learner_dashboard_page_plugin_slot",
                        type: DIRECT_PLUGIN,
                        priority: 1,
                        RenderWidget: (props)=>(
                            <CustomApp />
                        )
                    }
                }
            ]
        },
    }
}

const config = {
    ...process.env,
    get pluginSlots() {
        return getPluginSlots();
    }
}

export default config;