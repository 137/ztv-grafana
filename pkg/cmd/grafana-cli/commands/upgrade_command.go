package commands

import (
	"github.com/fatih/color"
	"github.com/grafana/grafana/pkg/cmd/grafana-cli/logger"
	s "github.com/grafana/grafana/pkg/cmd/grafana-cli/services"
	"github.com/grafana/grafana/pkg/cmd/grafana-cli/utils"
)

func upgradeCommand(c utils.CommandLine) error {
	pluginsDir := c.PluginDirectory()
	pluginName := c.Args().First()

	localPlugin, err := s.ReadPlugin(pluginsDir, pluginName)

	if err != nil {
		return err
	}

	plugin, err2 := c.ApiClient().GetPlugin(pluginName, c.RepoDirectory())

	if err2 != nil {
		return err2
	}

	if shouldUpgrade(localPlugin.Info.Version, &plugin) {
		s.RemoveInstalledPlugin(pluginsDir, pluginName)
		return InstallPlugin(pluginName, "", c)
	}

	logger.Infof("%s %s is up to date \n", color.GreenString("✔"), pluginName)
	return nil
}
