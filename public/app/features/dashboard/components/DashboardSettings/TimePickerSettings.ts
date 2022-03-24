import coreModule from 'app/core/core_module';
import { DashboardModel } from 'app/features/dashboard/state';

export class TimePickerCtrl {
  panel: any;
  dashboard: DashboardModel;

  constructor() {
    this.panel = this.dashboard.timepicker;
    this.panel.refresh_intervals = this.panel.refresh_intervals || [
      '5s',
      '10s',
      '30s',
      '1m',
      '5m',
      '15m',
      '30m',
      '1h',
      '2h',
      '1d',
    ];
  }
}

const template = `
<div class="editor-row">
	<h5 class="section-heading">时间选项</h5>

  <div class="gf-form-group">
		<div class="gf-form">
			<label class="gf-form-label width-10">时区</label>
			<div class="gf-form-select-wrapper">
				<select ng-model="ctrl.dashboard.timezone" class='gf-form-input' ng-options="f.value as f.text for f in
				  [{value: '', text: 'Default'}, {value: 'browser', text: '本地浏览器时间'},{value: 'utc', text: 'UTC'}]">
				</select>
			</div>
		</div>

		<div class="gf-form">
			<span class="gf-form-label width-10">自动刷新</span>
			<input type="text" class="gf-form-input max-width-25" ng-model="ctrl.panel.refresh_intervals" array-join>
		</div>
		<div class="gf-form">
			<span class="gf-form-label width-10">延迟-</span>
			<input type="text" class="gf-form-input max-width-25" ng-model="ctrl.panel.nowDelay"
			    placeholder="0m"
			    valid-time-span
			    bs-tooltip="'输入1m忽略最后一分钟（因为它可能包含不完整的度量）'"
 				  data-placement="right">
		</div>

		<gf-form-switch class="gf-form" label="隐藏时间选择器" checked="ctrl.panel.hidden" label-class="width-10">
		</gf-form-switch>
	</div>
</div>
`;

export function TimePickerSettings() {
  return {
    restrict: 'E',
    template: template,
    controller: TimePickerCtrl,
    bindToController: true,
    controllerAs: 'ctrl',
    scope: {
      dashboard: '=',
    },
  };
}

coreModule.directive('gfTimePickerSettings', TimePickerSettings);
