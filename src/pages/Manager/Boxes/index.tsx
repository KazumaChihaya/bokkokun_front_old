import { Tabs } from 'antd';
import React, { useState } from 'react';
import { useOutlet } from 'react-router-dom';
import BoxPane from './components/BoxPane';
import { BoxFilter } from './components/BoxTable';

const { TabPane } = Tabs;

type PaneInfo = {
  key: string;
  title: string;
  closable: boolean;
  filter?: BoxFilter;
};

const Boxes: React.FC = () => {
  const [panes] = useState([
    {
      key: 'all',
      title: '全箱',
      closable: false,
    },
    {
      key: 'active',
      title: 'アクティブ',
      closable: false,
      filter: (v) => v.filter((c) => c.status == 'アクティブ'),
    },
    {
      key: 'reserve',
      title: '予約中',
      closable: false,
      filter: (v) => v.filter((c) => c.status == '予約中'),
    },
    {
      key: 'vacant',
      title: '空き',
      closable: false,
      filter: (v) => v.filter((c) => c.status == '空き'),
    },
  ] as PaneInfo[]);
  const [activeKey, setActiveKey] = useState<string>('all');

  const children = useOutlet();
  return (
    children ?? (
      <Tabs
        type="editable-card"
        activeKey={activeKey}
        onChange={setActiveKey}
        animated
      >
        {panes.map((pane) => (
          <TabPane key={pane.key} tab={pane.title} closable={pane.closable}>
            <BoxPane filter={pane.filter} />
          </TabPane>
        ))}
      </Tabs>
    )
  );
};

export default Boxes;
