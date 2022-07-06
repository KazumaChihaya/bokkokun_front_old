import { Store, useStores } from '@/services/manager/earn';
import { Card, Space, Tabs } from 'antd';
import React, { useState } from 'react';
import { UseQueryResult } from 'react-query';
import { useOutlet } from 'react-router-dom';
import { format } from 'date-fns'
import EarnInvoiceTable from './components/EarnInvoiceTable';
import MonthChanger from './components/MonthChanger';
import StartCalc from './components/StartCalc';
import { EarnInvoice } from '@/services/manager/artist';
import { useEarnInvoice } from '@/services/manager/earn_invoice';
import ChangeLock from './components/ChangeLock';

const { TabPane } = Tabs;

type PaneInfo = {
  key: string;
  title: string;
  closable: boolean;
};


const Earns: React.FC = () => {
  const [activeKey, setActiveKey] = useState<string>(format(new Date(), 'yyyy-MM'));

  const { data: data, isLoading: isEarnInvoiceLoading } =
    useEarnInvoice(activeKey) as UseQueryResult<{earn_invoice: EarnInvoice}>;

  const earn_invoice = data?.earn_invoice;

  return (
    <>
      <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
        <Card>
          <MonthChanger activeKey={activeKey} setActiveKey={setActiveKey} earn_invoice={earn_invoice}/>
        </Card>
        {earn_invoice ? 
          <EarnInvoiceTable activeKey={activeKey} earn_invoice={earn_invoice}/>
        : 
        <>
          <div>
            <span>まだこの月は計算されていません。</span>
            <StartCalc activeKey={activeKey} key={activeKey}></StartCalc>
          </div>
        </>}
      </Space>
    </>
  );
};

export default Earns;
