import { Store, useStores } from '@/services/manager/earn';
import { Card, Space, Tabs } from 'antd';
import React, { useState } from 'react';
import { UseQueryResult } from 'react-query';
import { useOutlet } from 'react-router-dom';
import { format } from 'date-fns'
import BoxInvoiceTable from './components/BoxInvoiceTable';
import MonthChanger from './components/MonthChanger';
import StartCalc from './components/StartCalc';
import { BoxInvoice } from '@/services/manager/artist';
import { useBoxInvoice } from '@/services/manager/box_invoice';
import ChangeLock from './components/ChangeLock';

const { TabPane } = Tabs;

type PaneInfo = {
  key: string;
  title: string;
  closable: boolean;
};


const Earns: React.FC = () => {
  const [activeKey, setActiveKey] = useState<string>(format(new Date(), 'yyyy-MM'));

  const { data: data, isLoading: isBoxInvoiceLoading } =
    useBoxInvoice(activeKey) as UseQueryResult<{box_invoice: BoxInvoice}>;

  const box_invoice = data?.box_invoice;

  return (
    <>
      <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
        <Card>
          <MonthChanger activeKey={activeKey} setActiveKey={setActiveKey} box_invoice={box_invoice}/>
        </Card>
        {box_invoice ? 
          <BoxInvoiceTable activeKey={activeKey} box_invoice={box_invoice}/>
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
