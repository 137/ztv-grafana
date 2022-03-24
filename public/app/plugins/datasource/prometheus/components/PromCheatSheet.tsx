import React from 'react';
import { ExploreStartPageProps, DataQuery } from '@grafana/ui';

const CHEAT_SHEET_ITEMS = [
  {
    title: '请求效率',
    expression: 'rate(http_request_total[5m])',
    label: '给定一个HTTP请求计数器，此查询将计算最近5分钟的每秒平均请求速率.',
  },
  {
    title: '95%请求延迟',
    expression: 'histogram_quantile(0.95, sum(rate(prometheus_http_request_duration_seconds_bucket[5m])) by (le))',
    label: '计算超过5分钟的请求延迟所占比例.',
  },
  {
    title: '警报触发',
    expression: 'sort_desc(sum(sum_over_time(ALERTS{alertstate="firing"}[24h])) by (alertname))',
    label: '总计过去24小时内一直触发的警报.',
  },
];

export default (props: ExploreStartPageProps) => (
  <div>
    <h2>PromQL Cheat Sheet</h2>
    {CHEAT_SHEET_ITEMS.map(item => (
      <div className="cheat-sheet-item" key={item.expression}>
        <div className="cheat-sheet-item__title">{item.title}</div>
        <div
          className="cheat-sheet-item__example"
          onClick={e => props.onClickExample({ refId: 'A', expr: item.expression } as DataQuery)}
        >
          <code>{item.expression}</code>
        </div>
        <div className="cheat-sheet-item__label">{item.label}</div>
      </div>
    ))}
  </div>
);
