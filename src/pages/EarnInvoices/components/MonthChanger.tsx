import {
  AddEarnParam, useCreateEarnMutation,
} from '@/services/arrow-manage/earn';
import React, { useCallback, useRef, useState } from 'react';
import { format, addMonths, subMonths } from 'date-fns';
import { Button, DatePicker, Descriptions, Input, InputNumber, message, Modal } from 'antd';
import moment from 'moment';
import { TagsOutlined } from '@ant-design/icons';
import ChangeLock from './ChangeLock';
import { EarnInvoice } from '@/services/arrow-manage/artist';

export type MonthChangerProps = {
  activeKey: string,
  setActiveKey: any,
  earn_invoice?: EarnInvoice,
};

const MonthChanger: React.FC<MonthChangerProps> = ({
  activeKey,
  setActiveKey,
  earn_invoice,
}) => {
  const prevMonth = async () => {
    setActiveKey(format(subMonths(new Date(activeKey), 1), 'yyyy-MM'));
  };

  const nextMonth = async () => {
    setActiveKey(format(addMonths(new Date(activeKey), 1), 'yyyy-MM'));
  };

  return (
    <>
      <table>
        <tbody>
          <tr>
            <td style={{width: '80px'}}>
              <Button
                icon={<TagsOutlined />}
                onClick={prevMonth}
              >
                前の月
              </Button>
            </td>
            <td style={{width: '200px', textAlign: 'center'}}>
              {format(new Date(activeKey+'-01'), 'yyyy年MM月')}
              {!!earn_invoice ? (earn_invoice.lock_type ? '(確定済)' : '(未確定)') : ''}
            </td>
            <td style={{width: '80px'}}>
              <Button
                icon={<TagsOutlined />}
                onClick={nextMonth}
              >
                月の月
              </Button>
            </td>
            <td style={{width: '80px'}}></td>
            <td style={{width: '80px'}}>
              {!!earn_invoice ? 
              <ChangeLock yearmonth={activeKey} lock_type={earn_invoice.lock_type} key={activeKey}/>
              :<></>}
            </td>
          </tr>
        </tbody>
      </table>
    </>
  );
};

export default MonthChanger;
