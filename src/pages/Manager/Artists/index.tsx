import { Tabs } from 'antd';
import React, { useState } from 'react';
import { useOutlet } from 'react-router-dom';
import ArtistPane from './components/ArtistPane';
import { ArtistFilter } from './components/ArtistTable';

const { TabPane } = Tabs;

type PaneInfo = {
  key: string;
  title: string;
  closable: boolean;
  filter?: ArtistFilter;
};

const Artists: React.FC = () => {
  const [panes] = useState([
    {
      key: 'all',
      title: '全作家',
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
      key: 'quit',
      title: '退会',
      closable: false,
      filter: (v) => v.filter((c) => c.status == '退会'),
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
            <ArtistPane filter={pane.filter} />
          </TabPane>
        ))}
      </Tabs>
    )
  );
};

export default Artists;
