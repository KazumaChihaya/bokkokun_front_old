import { Store, useStores } from '@/services/manager/earn';
import { Tabs } from 'antd';
import React, { useState } from 'react';
import { UseQueryResult } from 'react-query';
import { useOutlet } from 'react-router-dom';
import EarnPane from './components/EarnPane';

const { TabPane } = Tabs;

type PaneInfo = {
  key: string;
  title: string;
  closable: boolean;
};


const Earns: React.FC = () => {
  const { data: _rawStores } =
    useStores() as UseQueryResult<Store[]>;
  const stores = _rawStores ? _rawStores?.map(store => {
    return {
      key: String(store.id),
      title: store.name,
      closable: false,
    };
  }) : [];
  const [activeKey, setActiveKey] = useState<string>(String(1));
  const [page, setPage] = React.useState(1);

  const setTabKey = (key: string) => {
    setActiveKey(key);
    setPage(1);
  }

  const children = useOutlet();
  return (
    children ?? (
      <Tabs
        type="editable-card"
        activeKey={activeKey}
        onChange={setTabKey}
        animated
      >
        {stores.map((pane) => (
          <TabPane key={pane.key} tab={pane.title} closable={pane.closable}>
            <EarnPane activeKey={activeKey} page={page} setPage={setPage}/>
          </TabPane>
        ))}
      </Tabs>
    )
  );
};

export default Earns;
