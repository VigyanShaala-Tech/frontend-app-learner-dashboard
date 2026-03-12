from tutor import hooks
from tutormfe.hooks import PLUGIN_SLOTS

hooks.Filters.ENV_PATCHES.add_item(
    (
        "mfe-env-config-runtime-definitions-learner-dashboard",
        """
        // This file contains configuration for plugins and environment variables.
const { PLUGIN_OPERATIONS, DIRECT_PLUGIN } = await import('@openedx/frontend-plugin-framework');
const { default: CustomApp } = await import('./src/CustomApp');
{% raw %}
config = {
  ...config,
  ...process.env,
}
config.pluginSlots = {
  learner_dashboard_page_plugin_slot: {
    plugins: [
      {
        op: PLUGIN_OPERATIONS.Insert,
        widget: {
          id: 'learner_dashboard_page_plugin_slot',
          type: DIRECT_PLUGIN,
          priority: 1,
          RenderWidget: (props) => <CustomApp {...props} />,
        },
      },
    ],
  },
};
{% endraw %}
"""
    ))